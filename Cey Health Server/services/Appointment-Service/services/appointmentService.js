const pool = require("../config/db");
const md5 = require('crypto-js/md5');

exports.createAppointment = async (puid, duid, tsid) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Get doctor's price
    const [patient] = await conn.query("SELECT * FROM Users WHERE id = ?", [puid])
    const [doctor] = await conn.query("SELECT price FROM Doctors WHERE duid = ?", [duid]);
    const [timeslot] = await conn.query("SELECT duid, status FROM Timeslots WHERE tsid = ?", [tsid]);
    if (patient.length === 0) throw new Error("Patient not found");
    if (doctor.length === 0) throw new Error("Doctor not found");
    if (timeslot[0].duid != duid || timeslot[0].status != "Available") throw new Error("Provide a Valid Time Slot");
    await conn.query("UPDATE Timeslots SET status = ? WHERE tsid = ? ", ["Booked", tsid])

    const price = doctor[0].price;

    // 2. Insert appointment (pending payment)
    const [appointment] = await conn.query(
      "INSERT INTO Appointments (puid, duid, tsid, pay_status, status) VALUES (?, ?, ?, 'pending', 'unpaid')",
      [puid, duid, tsid]
    );
    const aid = appointment.insertId;

    await conn.commit();

    let merchantSecret  = 'Mjg4OTQ5MTU4NzM5NjA4NDg0NjEyODU4OTAwODU0MTU2NTE1NDc3';
    let merchantId      = '1231693';
    let hashedSecret    = md5(merchantSecret).toString().toUpperCase();
    let amountFormated  = parseFloat( price ).toLocaleString( 'en-us', { minimumFractionDigits : 2 } ).replaceAll(',', '');
    let currency        = 'LKR';
    let hash            = md5(merchantId + aid + amountFormated + currency + hashedSecret).toString().toUpperCase();

    // 3. Initiate PayHere Checkout
    const paymentPayload = {
      merchant_id: merchantId, // Sandbox merchant ID
      return_url: "http://localhost:3000/api/v1/booking/book/appointments/success",
      cancel_url: "http://localhost:3000/api/v1/booking/book/appointments/cancel/" + aid,
      notify_url: "http://localhost:3000/api/v1/booking/book/appointments/notify",
      first_name: patient[0].first_name,
      last_name: patient[0].last_name,
      email: patient[0].email,
      phone: patient[0].phone,
      address: patient[0].street + ", " + patient[0].city,
      city: patient[0].city,
      country: "Sri Lanka",
      order_id: aid,
      items: "Doctor Consultation",
      currency: "LKR",
      amount: amountFormated,
      hash: hash
    };

    // PayHere wants you to build an HTML form, so return payload for frontend
    return paymentPayload;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};




exports.getAppointments = async (id) => {
  try {
    const [rows] = await pool.query(
      `Select pu.first_name AS patientFirstName, 
      pu.last_name AS patientLastName,
      du.first_name AS doctorFirstName, 
      du.last_name AS doctorLastName,
      ts.date AS timeSlotDate,
      ts.start_time AS timeSlotStartTime,
      a.* 
      from Appointments a 
      JOIN Users du ON du.id = a.duid 
      JOIN Users pu ON pu.id = a.puid 
      JOIN Timeslots ts ON ts.tsid = a.tsid
      WHERE a.pay_status = ? AND (a.duid = ? OR a.puid = ?)`, ["paid", id, id]

    );
    console.log(rows);
    return rows;
  } catch (err) {
    throw err;
  }
}

// Handle PayHere notify callback
exports.handleNotify = async (data) => {
const { order_id, payment_id, status_code, payhere_amount } = data;

const conn = await pool.getConnection();
  try {
    let payStatus = "failed";
    if (status_code == 2) payStatus = "success";
    else if (status_code == -1) payStatus = "cancelled";

    await conn.query(
      "UPDATE Appointments SET pay_status = ?, pay_date = CURRENT_DATE, status = ? WHERE aid = ?",
      [payStatus, payStatus === "success" ? "confirmed" : "cancelled", order_id]
    );
  } finally {
    conn.release();
  }
}

exports.setSuccessful = async (aid) => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "UPDATE Appointments SET pay_status = ?, pay_date = CURRENT_DATE, status = ? WHERE aid = ?",
      ["paid", "paid", aid]
    );
  } finally {
    conn.release();
  }
}

exports.cancelAppointment = async (aid) => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "Delete from Appointments WHERE aid = ?",
      [aid]
    );
  } finally {
    conn.release();
  }
};


exports.updateLink = async (aid, link) => {
  try {
    const result = await pool.query(
      "UPDATE Appointments SET zoom_id = ? WHERE aid = ?", [link, aid]
    );

    return result;
  } catch (err) {
    throw err;
  }
}


