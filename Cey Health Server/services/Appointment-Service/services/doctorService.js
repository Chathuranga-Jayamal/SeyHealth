const DoctorModel = require("../models/doctorModel");

const db = require("../config/db");

const DoctorService = {
    async listDoctors() {
        return await DoctorModel.getAllDoctors();
    },

    async getDoctorById(duid) {
        return await DoctorModel.getDoctorById(duid);
    },

    async getUniqueSpecializations() {
        const [rows] = await db.query(
            `SELECT DISTINCT d.spec AS specialization
            FROM Doctors d`
        );
        return rows.map(r => r.specialization);
    },

    async getUniqueQualifications() {
        const [rows] = await db.query(
            `SELECT DISTINCT d.qualification_title AS qualification
            FROM Doctors d`
        );
        return rows.map(r => r.qualification);
    }
};

module.exports = DoctorService;
