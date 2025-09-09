import express from "express";
import zoomController from "./controllers/zoomController.js";
import emailController from "./controllers/emailController.js";
const router = express.Router();

// Zoom meeting routes
router.post("/zoom/create", zoomController.createMeeting);
router.put("/zoom/update", zoomController.updateMeeting);
router.delete("/zoom/delete", zoomController.deleteMeeting);

//Email routes
router.post("/email/send", emailController.sendEmailController);

export default router;
