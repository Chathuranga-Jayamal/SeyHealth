import env from "dotenv";
env.config({ path: "../.env" });

export const longTermSession = {
  name: "user_session",
  secret: process.env.longterm_session_secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: "lax",
  },
};

export const shortTermSession = {
  name: "otp_session",
  secret: process.env.shortterm_session_secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
};
