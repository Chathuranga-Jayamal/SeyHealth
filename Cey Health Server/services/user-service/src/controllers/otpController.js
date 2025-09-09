import authService from "../services/authService.js";
import OtpService from "../services/otpService.js";

class OTPController {
  async verifyEmailController(req, res) {
    const { otp } = req.body;

    try {
      const otpService = new OtpService();
      const result = await otpService.verifyEmailOtp(otp, req);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Email OTP verification failed:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  //verify whatsapp otp & signup
  //1. get otp from request body
  //2. check session/session data and verify otp
  //3. create user and insert into database
  //4. distroy current session (short session)
  //6. respond with success message & status code (201)
  async verifyWhatsappController(req, res) {
    const { otp } = req.body;

    try {
      const otpService = new OtpService();
      const result = await otpService.verifyRegistrationOtp(otp, req);

      if (result) {
        const response = await authService.signup(req); // returns { id: ... }

        const user = { id: response.id };
        res
          .status(200)
          .json({ success: true, userId: user.id, message: "OTP verified" });
      } else {
        res.status(400).json({ success: false, message: "Invalid OTP" });
      }
    } catch (error) {
      console.error("Whatsapp OTP verification failed:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Email otp resend controller
  async resendEmailOtpController(req, res) {
    try {
      const otpService = new OtpService();
      const result = await otpService.resendEmailOtp(req);
      res.status(200).json({
        success: true,
        message: result,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
export default new OTPController();
