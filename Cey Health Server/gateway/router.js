import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwtMiddleware from "./jwtMiddleware.js";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

// Public routes (no JWT verification needed)
const publicRoutes = [
  "/auth/register",
  "/user/login",
  "/auth/google",
  "/auth/facebook",
  "/auth/google/callback",
  "/auth/facebook/callback",
  "/auth/email/verify",
  "/auth/whatsapp/verify",
  "/auth/form",
  "/auth/whatsapp/phone",
  "/auth/email/resend",
  "/auth/whatsapp/resend",
  "/user/logout",
];

// Check if route is public or JWT-specific
const isPublicRoute = (path) => {
  return publicRoutes.some((route) => path.includes(route));
};

//Router to User-Management Micro Services
app.use(
  "/api/v1/users",
  (req, res, next) => {
    // Skip JWT verification for public routes
    if (isPublicRoute(req.path)) {
      console.log(`Gateway: Public route accessed - ${req.path}`);
      return next();
    }

    // Apply JWT verification for protected routes
    console.log(`Gateway: Protected route accessed - ${req.path}`);
    return jwtMiddleware.authenticate(req, res, next);
  },
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    logLevel: "debug",

    onProxyReq: (proxyReq, req) => {
      // Forward cookies
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }

      // Forward user headers (set by JWT middleware)
      if (req.headers["userId"]) {
        proxyReq.setHeader("userid", req.headers["userId"]);
      }
      if (req.headers["email"]) {
        proxyReq.setHeader("email", req.headers["email"]);
      }
      if (req.headers["role"]) {
        proxyReq.setHeader("role", req.headers["role"]);
      }
      if (req.headers["type"]) {
        proxyReq.setHeader("type", req.headers["type"]);
      }
    },

    onProxyRes: (proxyRes, req, res) => {
      const cookies = proxyRes.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies); // Send session cookies back to browser
      }
    },
  })
);

// Router to Communication Microservice
// Router to Communication Microservice
app.use(
  "/api/v1/communication",
  (req, res, next) => {
    if (isPublicRoute(req.path)) {
      console.log(`Gateway: Public route accessed - ${req.path}`);
      return next();
    }

    console.log(`Gateway: Protected communication route - ${req.path}`);
    return jwtMiddleware.authenticate(req, res, next);
  },
  createProxyMiddleware({
    target: "http://localhost:4000",
    changeOrigin: true,
    logLevel: "debug",

    onProxyReq: (proxyReq, req) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }

      if (req.headers["userId"]) {
        proxyReq.setHeader("userid", req.headers["userId"]);
      }
      if (req.headers["email"]) {
        proxyReq.setHeader("email", req.headers["email"]);
      }
      if (req.headers["role"]) {
        proxyReq.setHeader("role", req.headers["role"]);
      }
      if (req.headers["type"]) {
        proxyReq.setHeader("type", req.headers["type"]);
      }
    },

    onProxyRes: (proxyRes, req, res) => {
      const cookies = proxyRes.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }
    },
  })
);



// Router to AI Microservice
app.use(
  "/api/v1/chatbot",
  (req, res, next) => {
   // console.log(req);
    if (isPublicRoute(req.path)) {
      console.log(`Gateway: Public route accessed - ${req.path}`);
      return next();
    }

    console.log(`Gateway: Protected communication route - ${req.path}`);
    return jwtMiddleware.authenticate(req, res, next);
  },
  createProxyMiddleware({
    target: "http://localhost:3500",
    pathRewrite: {
      "/api/v1/chatbot": "/chat",
    },
    changeOrigin: true,
    logLevel: "debug",

    onProxyReq: (proxyReq, req) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }

      if (req.headers["userId"]) {
        proxyReq.setHeader("userid", req.headers["userId"]);
      }
      if (req.headers["email"]) {
        proxyReq.setHeader("email", req.headers["email"]);
      }
      if (req.headers["role"]) {
        proxyReq.setHeader("role", req.headers["role"]);
      }
      if (req.headers["type"]) {
        proxyReq.setHeader("type", req.headers["type"]);
      }
    },

    onProxyRes: (proxyRes, req, res) => {
      const cookies = proxyRes.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }
    },
  })
);
// Router to Appointment Booking Microservice
app.use(
  "/api/v1/booking",
  (req, res, next) => {
    if (isPublicRoute(req.path)) {
      console.log(`Gateway: Public route accessed - ${req.path}`);
      return next();
    }

    console.log(`Gateway: Protected communication route - ${req.path}`);
    return jwtMiddleware.authenticate(req, res, next);
  },
  createProxyMiddleware({
    target: "http://localhost:4500",
    changeOrigin: true,
    logLevel: "debug",

    onProxyReq: (proxyReq, req) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("cookie", req.headers.cookie);
      }

      if (req.headers["userId"]) {
        proxyReq.setHeader("userid", req.headers["userId"]);
      }
      if (req.headers["email"]) {
        proxyReq.setHeader("email", req.headers["email"]);
      }
      if (req.headers["role"]) {
        proxyReq.setHeader("role", req.headers["role"]);
      }
      if (req.headers["type"]) {
        proxyReq.setHeader("type", req.headers["type"]);
      }
    },

    onProxyRes: (proxyRes, req, res) => {
      const cookies = proxyRes.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }
    },
  })
);
app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});


