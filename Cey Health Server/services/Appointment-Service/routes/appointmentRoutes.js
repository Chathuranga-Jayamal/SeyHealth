const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/", appointmentController.createAppointment);
router.get("/user/:id/", appointmentController.getAppointments);

router.put("/updatelink/:id/", appointmentController.updateLink);


// PayHere callbacks
router.post("/notify/", appointmentController.paymentNotify);
router.get("/success/", appointmentController.paymentSuccess);
router.get("/cancel/:id/", appointmentController.paymentCancel);

module.exports = router;
