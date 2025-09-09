const db = require("../config/db");

// Get timeslots for a given doctor
exports.getDoctorTimeslots = async (duid) => {
  const [rows] = await db.query(
    `SELECT tsid, date, start_time, end_time, status 
     FROM Timeslots 
     WHERE duid = ? AND status = ?
     ORDER BY date, start_time`,
    [duid, "Available"]
  );
  return rows;
};

exports.createTimeslot = async (duid, date, start_time, end_time) => {
  const [result] = await db.query(
    `INSERT INTO Timeslots (duid, date, start_time, end_time, status) 
     VALUES (?, ?, ?, ?, 'available')`,
    [duid, date, start_time, end_time]
  );

  return { tsid: result.insertId, duid, date, start_time, end_time, status: "available" };
};
