const pool = require("../config/db");

const DoctorModel = {
    async getAllDoctors() {
        try {
            const [rows] = await pool.query(`
                SELECT u.id, u.first_name, d.price, u.last_name, d.spec, d.qualification_title
                FROM Users u
                INNER JOIN Doctors d ON u.id = d.duid
            `);
            return rows;
        } catch (err) {
            throw new Error("Database query failed: " + err.message);
        }
    },

    async getDoctorById(duid) {
        try {
            const [rows] = await pool.query(`
                SELECT * FROM Users u
                INNER JOIN Doctors d ON u.id = d.duid
                WHERE duid = ?`, duid);
            return rows;
        } catch (err) {
            throw new Error("Database query failed: " + err.message);
        }
    }
};

module.exports = DoctorModel;
