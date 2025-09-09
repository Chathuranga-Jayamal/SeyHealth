import db from "../config/db.js";

class Timeslot {
  async createTimeslot(duid, date, start_time, end_time) {
    const [result] = await db.query(
      `INSERT INTO Timeslots (duid, date, start_time, end_time, status) 
            VALUES (?, ?, ?, ?, 'available')`,
      [duid, date, start_time, end_time]
    );
    return {
      duid: duid,
      date: date,
      start_time: start_time,
      end_time: end_time,
      status: "available",
    };
  }
}

export default Timeslot;
