const express = require("express");
const DoctorController = require("../controllers/doctorController");

const router = express.Router();

router.get("/", DoctorController.getDoctors);
router.get("/:duid", DoctorController.getDoctorbyID);

router.get("/specializations", DoctorController.getUniqueSpecializations);
router.get("/qualifications", DoctorController.getUniqueQualifications);


module.exports = router;
