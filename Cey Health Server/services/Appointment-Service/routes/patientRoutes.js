const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

router.get("/:puid/history", patientController.getPatientHistory);
router.post("/:puid/history", patientController.setPatientHistory);

module.exports = router;
