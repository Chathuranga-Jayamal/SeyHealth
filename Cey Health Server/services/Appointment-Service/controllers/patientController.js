const patientService = require("../services/patientService");

exports.getPatientHistory = async (req, res) => {
  try {
    const { puid } = req.params;
    const history = await patientService.getPatientHistory(puid);

    if (!history) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching patient history" });
  }
};
exports.setPatientHistory = async (req, res) => {
  try {
    const { puid } = req.params;
    const result = await patientService.setPatientHistory(puid, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error setting patient history" });
  }
};
