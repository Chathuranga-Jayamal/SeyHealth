import authService from "../services/authService.js";
import passport from "../config/passport.js";
import jwtService from "../services/jwtService.js";

// ------------------------------------------------ Registration and Login Management ------------------------------------------------

// Initial email and password registration controller
class AuthController {
  async initiateEmailRegistration(req, res) {
    const { email, password } = req.body;
    try {
      const result = await authService.registerUserWithEmail(
        email,
        password,
        req
      );
      res.status(200).json({
        success: true,
        message: "OTP is sent to your email. please enter the OTP",
        email: result,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Load User Data Controller
  async registerUserDataController(req, res) {
    const { userData } = req.body;
    try {
      const result = await authService.registerUserDataService(userData, req);
      res.status(200).json({
        success: true,
        message:
          "User data registered successfully, and please enter the Whatsapp OTP to complete the registration",
        whatsapp: result,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Google and Facebook callback controller
  async callbackController(req, res) {
    try {
      const sessionData = req.session.passport?.user;

      if (!sessionData) {
        console.log("No session data found:", req.session);
        return res.redirect(
          `http://localhost:5500/client/views/index.html?error=auth_failed`
        );
      }

      req.session.otpVerification = sessionData;
      console.log("Session:", req.session.otpVerification);

      // Check if the user already exists
      if (sessionData.existingUser) {
        console.log("Existing user found:", sessionData);
        try {
          //Generate JWT tokens
          const tokens = jwtService.generateTokens(sessionData);

          res.cookie(
            "accessToken",
            tokens.accessToken,
            jwtService.getCookieOptions("access")
          );

          console.log(
            "JWT tokens generated and cookies set",
            "AccessToken:",
            tokens.accessToken
          );
        } catch (error) {
          console.error("Error generating JWT tokens:", error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to generate tokens" });
        }

        return res.redirect(
          `http://localhost:5500/auth/callback?existing=true&userId=${sessionData.id}&email=${sessionData.email}&role=${sessionData.role}`
        );
      }

      return res.redirect(
        `http://localhost:5500/signUp1/gfWhatsappverify`
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(
        `http://localhost:5500/client/views/index.html?error=server_error`
      );
    }
  }

  // Load WhatsApp Number and send OTP Controller (In social media login)
  async whatsappNumberController(req, res) {
    const { phone } = req.body;
    console.log("Phone number:", phone);
    try {
      const result = await authService.registerWhatsappNumber(req, phone);
      res.status(200).json({
        success: true,
        message: "OTP is sent to your WhatsApp. Please enter the OTP",
        whatsapp: result,
      });
    } catch (error) {
      console.error("WhatsApp number registration failed:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Login Controller (local strategy)
  async loginController(req, res) {
    const { email, password } = req.body;

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "Invalid email or password",
        });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Login error:", loginErr);
          return res
            .status(500)
            .json({ success: false, message: loginErr.message });
        }

        console.log("User logged in successfully:", user);

        req.session.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        console.log("User session created:", req.session.user);

        try {
          //Generate JWT tokens
          const tokens = jwtService.generateTokens(user);

          res.cookie(
            "accessToken",
            tokens.accessToken,
            jwtService.getCookieOptions("access")
          );

          console.log(
            "JWT tokens generated and cookies set",
            "AccessToken:",
            tokens.accessToken
          );

          return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
              id: user.id,
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              role: user.role,
            },
            tokens: {
              accessToken: tokens.accessToken,
              expiresIn: "7d",
            },
          });
        } catch (jwtError) {
          console.error("JWT error:", jwtError);
          return res
            .status(500)
            .json({ success: false, message: "Failed to generate tokens" });
        }
      });
    })(req, res);
  }
}

export default new AuthController();
