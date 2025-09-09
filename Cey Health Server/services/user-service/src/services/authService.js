import Hash from "../utils/hash.js";
import User from "../models/userModel.js";
import OtpService from "./otpService.js";

class AuthService extends Hash {
  async registerUserWithEmail(email, password, req) {
    try {
      const existingUser = await User.getUserByEmail(email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await this.hashPassword(password);

      const emailOtp = new OtpService();
      const otpData = await emailOtp.requireEmailOtp(email);

      req.session.otpVerification = {
        ...otpData,
        hashedPassword,
      };

      console.log("Session after setting OTP:", req.session);

      return email;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  //store user data service
  async registerUserDataService(userData, req) {
    console.log(req.session);

    const { email, hashedPassword } = req.session.otpVerification;
    if (!req.session) throw new Error("No session found");

    if (!email || !hashedPassword) {
      throw new Error("No data found in session");
    }

    try {
      const fname = userData.first_name;
      const lname = userData.last_name;
      const whatsapp = userData.phone;
      const role = userData.role;
      const birthday = userData.birthday;
      const street = userData.street;
      const city = userData.city;
      const postal_code = userData.postal_code;
      const status = userData.status;

      console.log(
        fname,
        lname,
        whatsapp,
        role,
        birthday,
        street,
        city,
        postal_code,
        status
      );

      if (
        !fname ||
        !lname ||
        !whatsapp ||
        !role ||
        !birthday ||
        !street ||
        !city ||
        !postal_code ||
        !status
      ) {
        console.log(userData);
        throw new Error("All fields are required");
      }

      const userCredentials = {
        email,
        hashedPassword,
      };

      const whatsappOtp = new OtpService();
      const otpData = await whatsappOtp.requreWhatsappOtp(whatsapp);

      // store data in sessions as a objects (userCredentials, otpData, userData)
      req.session.otpVerification = {
        ...userCredentials,
        ...otpData,
        ...userData,
      };
      console.log("Session after setting OTP:", req.session.otpVerification);
      return whatsapp;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async registerWhatsappNumber(req, phone) {
    if (!phone) {
      throw new Error("Phone number is required");
    }

    if (!req.session.otpVerification) {
      console.error("No session data found:", req.session);
      throw new Error("No data found in session");
    }

    const otpService = new OtpService();
    const result = await otpService.requreWhatsappOtp(phone, req);

    req.session.otpVerification = {
      ...req.session.otpVerification,
      phone,
      ...result,
    };
    console.log(
      "Session after setting WhatsApp OTP:",
      req.session.otpVerification
    );

    return phone;
  }

  async signup(req) {
    if (!req.session.otpVerification)
      throw new Error("No data found in session");

    const user = this.mapSessionToUser(req.session.otpVerification);
    const result = await User.createUser(user);

    if (result.affectedRows === 1) {
      console.log("User created successfully");

      const NewUser = { id: result.insertId };

      // Wait until session is destroyed
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            console.log("Error destroying session:", err);
            return reject(err);
          }
          resolve();
        });
      });

      return NewUser;
    }

    throw new Error("User creation failed");
  }

  mapSessionToUser(data) {
    return {
      email: data.email,
      hashedPassword: data.hashedPassword,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      role: data.role,
      birthday: data.birthday,
      street: data.street,
      city: data.city,
      postal_code: data.postal_code,
      status: data.status,
    };
  }

  //get user role
  async getUserRoleByID(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    let num = Number(userId);

    const user = await User.getUserById(num);
    if (!user) {
      throw new Error("User not found");
    }

    return user.role;
  }
}

export default new AuthService();
