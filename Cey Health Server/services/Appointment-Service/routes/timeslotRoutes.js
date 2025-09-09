const express = require("express");
const router = express.Router();
const timeslotController = require("../controllers/timeslotController");

// Get all timeslots for a doctor
router.get("/:duid", timeslotController.getDoctorTimeslots);
router.post("/", timeslotController.createTimeslot);


module.exports = router;
