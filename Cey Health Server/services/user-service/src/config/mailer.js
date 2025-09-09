import env from "dotenv";
env.config({ path: "../.env" });

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.email_service,
  auth: {
    user: process.env.email_user,
    pass: process.env.email_password,
  },
});

export default transporter;
