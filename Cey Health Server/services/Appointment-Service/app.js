const express = require("express");
const doctorRoutes = require("./routes/doctorRoutes.js");
const appointmentRoutes = require("./routes/appointmentRoutes");
const patientRoutes = require("./routes/patientRoutes");
const timeslotRoutes = require("./routes/timeslotRoutes");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const PORT = 4500;

// Routes
app.use("/book/doctors", doctorRoutes);
app.use("/book/appointments", appointmentRoutes);
app.use("/book/patients", patientRoutes)
app.use("/book/timeslots", timeslotRoutes);


// Base API
app.get("/book", (req, res) => {
    res.send("API is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/book`);
});
