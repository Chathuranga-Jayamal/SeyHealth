import OTP from "../utils/generateOtp.js";
import transporter from "../config/mailer.js";
import bcrypt from "bcryptjs";
import twilio from "twilio";

class OtpService extends OTP {
  //Sendig email otp handler
  //1. get otp
  //2. hash otp
  //3. send email and otp to sendEmailOTP method
  //4. return email and otp
  async requireEmailOtp(email) {
    const otp = await this.getOtp();
    const hashedOtp = await this.hashOTP(otp);

    const result = await this.sendEmailOTP(email, otp);
    if (result && result.accepted && result.accepted.length > 0) {
      console.log("Email sent successfully:", result.response);
      return {
        email: email,
        otp: hashedOtp,
        expiresAt: Date.now() + 15 * 60 * 1000,
      };
    }

    throw new Error("Failed to send email");
  }

  //Sending otp to email
  async sendEmailOTP(email, otp) {
    const mailOptions = {
      from: `"Sey Health" <${process.env.EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Expires in 15 minutes.</p>`,
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      return error;
    }
  }

  // Resend email OTP
  async resendEmailOtp(req) {
    if (!req.session.otpVerification) throw new Error("No session data found");

    const { email, hashedPassword } = req.session.otpVerification;
    if (!email || !hashedPassword) {
      throw new Error("No data found in session");
    }

    const result = await this.requireEmailOtp(email);

    req.session.otpVerification = {
      hashedPassword,
      ...result,
    };

    console.log("Session after resending OTP:", req.session.otpVerification);
    return "Email OTP resent successfully";
  }

  //Sending otp to whatsapp handler
  //1. get otp
  //2. hash otp
  //3. send otp to sendWhatsappOTP method
  //4. return hashed otp
  async requreWhatsappOtp(whatsapp) {
    const otp = await this.getOtp();
    const hashedOtp = await this.hashOTP(otp);

    const result = await this.sendWhatsappOTP(whatsapp, otp);

    if (result) {
      console.log("OTP sent successfully:", result.response);

      return {
        otp: hashedOtp,
        expiresAt: Date.now() + 15 * 60 * 1000, //15 minutes
      };
    }

    throw new Error("Failed to send OTP");
  }

  //Sending otp to whatsapp
  //1. setup whatsapp message
  //2. Twilio API configeration
  //3. send message
  //4. return true
  async sendWhatsappOTP(whatsapp, otp) {
    const meassge = `Your OTP is: ${otp}, from Cey Health Team.`;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    try {
      client.messages.create({
        from: process.env.TWILIO_SANDBOX_NUMBER, // Twilio Sandbox number
        to: `whatsapp:${whatsapp}`, //  WhatsApp number (must be verified in sandbox) //+94xxxxxxxxx
        body: otp,
      });

      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  //handle email otp verification
  //1. verify otp method
  //2. replace otp session with only verified info
  async verifyEmailOtp(otp, req) {
    const result = await this.verifyRegistrationOtp(otp, req);

    const { email, hashedPassword } = req.session.otpVerification;

    // Replace OTP session with only verified info
    req.session.otpVerification = {
      email,
      hashedPassword,
      otpVerified: true,
    };

    return true;
  }

  //verify otp
  //1. check if session is initialized
  //2. check otp data in session
  //3. compare otp
  //4. return true
  async verifyRegistrationOtp(otp, req) {
    if (!req.session) {
      console.error("No session found");
      throw new Error("Session is not initialized.");
    }
    const otpData = req.session.otpVerification;
    if (!otpData || !otpData.otp) {
      console.error("No OTP data found in session");
      console.log(req.session);
      throw new Error("No OTP found in session. Please restart registration.");
    }

    const { otp: hashedOtp } = otpData;

    const isMatch = await bcrypt.compare(otp, hashedOtp);
    if (!isMatch) {
      throw new Error("Invalid OTP");
    }
    return true;
  }
}

export default OtpService;
