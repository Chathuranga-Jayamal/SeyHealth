const timeslotService = require("../services/timeslotService");

exports.getDoctorTimeslots = async (req, res) => {
  try {
    const { duid } = req.params;
    const slots = await timeslotService.getDoctorTimeslots(duid);
    console.log(slots);
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching doctor timeslots" });
  }
};

exports.createTimeslot = async (req, res) => {
  try {
    const { duid, date, start_time, end_time } = req.body;

    if (!duid || !date || !start_time || !end_time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newSlot = await timeslotService.createTimeslot(duid, date, start_time, end_time);
    res.status(201).json(newSlot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating timeslot" });
  }
};