const appointmentService = require("../services/appointmentService");

exports.createAppointment = async (req, res) => {
  try {
    const { puid, duid, tsid } = req.body;
    const payment_payload = await appointmentService.createAppointment(puid, duid, tsid);
    console.log(payment_payload);
    res.send(payment_payload); // Responds with ready-to-go form
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating appointment" });
  }
};
exports.getAppointments = async (req, res) => {
  try{
    console.log(req.params.id);
    const appointments = await appointmentService.getAppointments(req.params.id);
    res.send(appointments)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
}
exports.updateLink = async (req, res) => {
  try{
    const aid = req.params.id;
    const {link} = req.body;
    console.log(aid, link);
    const result = await appointmentService.updateLink(aid, link);
    res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating appointment" });
  }
}


exports.paymentNotify = async (req, res) => {
  try {
    await appointmentService.handleNotify(req.body);
    res.status(200).send("Notification received");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error handling notification");
  }
};

exports.paymentSuccess = async (req, res) => {
  await appointmentService.setSuccessful(req.query.order_id);
  res.redirect("http://localhost:5500/booking");
  console.log(req.query.order_id);
};

exports.paymentCancel = async (req, res) => {
  await appointmentService.cancelAppointment(req.params.id);
  res.redirect("http://localhost:5500/booking");
  console.log(req.params.id);
};
