import express from "express";
import { OtpSessionMiddleware } from "../middleware/sessionMiddleware.js";
import AuthController from "../controllers/authController.js";
import OtpController from "../controllers/otpController.js";
import validateInput from "../middleware/validateInput.js";
import passport from "../config/passport.js";

const router = express.Router();

router.use(OtpSessionMiddleware);
router.use(passport.initialize());
router.use(passport.session());

// Default registration route
router.post(
  "/register",
  validateInput(["email", "password"]),
  AuthController.initiateEmailRegistration
);

// Resend email OTP route
router.post("/email/otp/resend", OtpController.resendEmailOtpController);

// Email OTP verification route
router.post("/email/verify", OtpController.verifyEmailController);

// User data registration route (get data from form)
router.post("/form", AuthController.registerUserDataController);

// Whatsapp OTP verification
router.post("/whatsapp/verify", OtpController.verifyWhatsappController);

// Google login entry
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Facebook login entry
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

// Google callback -> custom controller
router.get(
  "/google/callback",
  passport.authenticate("google"),
  AuthController.callbackController
);

// Facebook callback -> custom controller
router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  AuthController.callbackController
);

// post whatsapp phone number
router.post(
  "/whatsapp/phone",
  validateInput(["phone"]),
  AuthController.whatsappNumberController
);

export default router;
