import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

class JwtMiddleware {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
  }

  extractToken(req) {
    if (req.cookies && req.cookies.accessToken) {
      return req.cookies.accessToken;
    }
    return null;
  }

  verifyToken(token) {
    try {
      //console.log("Verifying access token:", token);
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      console.log(`Error verifying access token: ${error.message}`);
      throw new Error(`Invalid access token: ${error.message}`);
    }
  }

  authenticate = (req, res, next) => {
    try {
      const token = this.extractToken(req);

      if (!token) {
        console.log("No JWT token found");
        return res.status(401).json({
          success: false,
          message: "Access token required",
          code: "NO_TOKEN",
        });
      }

      const decoded = this.verifyToken(token);

      req.headers["userId"] = decoded.userId;
      req.headers["email"] = decoded.email;
      req.headers["role"] = decoded.role;
      req.headers["type"] = decoded.type;

      console.log(
        `Gateway: Authenticated user ${decoded.userId} (${decoded.email})`
      );

      next();
    } catch (error) {
      console.error("JWT varification faild", error.message);

      let errorCode = "INVALID_TOKEN";
      if (error.message.includes("expired")) {
        errorCode = "TOKEN_EXPIRED";
      } else if (error.message.includes("malformed")) {
        errorCode = "MALFORMED_TOKEN";
      }

      res.status(401).json({
        success: false,
        message: "Invalid access token",
        error: error.message,
        code: errorCode,
      });
    }
  };
}

export default new JwtMiddleware();
