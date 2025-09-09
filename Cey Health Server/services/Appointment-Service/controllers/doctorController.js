const DoctorService = require("../services/doctorService");

const DoctorController = {
    async getDoctors(req, res) {
        try {
            const doctors = await DoctorService.listDoctors();
            console.log(doctors);
            res.status(200).json({ success: true, data: doctors });
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: err.message });
        }
    },

    async getDoctorbyID(req, res) {
        try {
            const doctors = await DoctorService.getDoctorById(req.params.duid);
            res.status(200).json({ success: true, data: doctors });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    async getUniqueSpecializations (req, res) {
        try {
            const data = await DoctorService.getUniqueSpecializations();
            res.json({ specializations: data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching unique specializations" });
        }
    },

    async getUniqueQualifications(req, res){
        try {
            const data = await DoctorService.getUniqueQualifications();
            res.json({ qualifications: data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching unique qualifications" });
        }
    }
};

module.exports = DoctorController;
