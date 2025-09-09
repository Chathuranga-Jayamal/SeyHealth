import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

class JwtService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    this.accessTokenExpiry = "7d"; //7 days
  }

  // Generate access token
  generateAccessToken(payload) {
    const tokenPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      type: "access",
    };

    console.log("Generating access token:", tokenPayload);
    return jwt.sign(tokenPayload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: "sey-health",
      audience: "sey-health-users",
    });
  }
  //Generate both access
  generateTokens(userData) {
    const payload = {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
    };

    console.log("Generating tokens for user:", payload);
    return {
      accessToken: this.generateAccessToken(payload),
    };
  }

  //Get cookie options for access token
  getCookieOptions(tokenType = "access") {
    const baseOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: "lax",
      path: "/",
    };

    if (tokenType === "access") {
      return {
        ...baseOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      };
    }
    return baseOptions;
  }
}

export default new JwtService();
