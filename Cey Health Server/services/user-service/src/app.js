import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import otpRouter from "./router/authRouter.js";
import userRouter from "./router/userRouter.js";

const app = express();
const port = 5000;

// Allow frontend from localhost:5500
app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  })
);

// JSON body + request logger
app.use(express.json());
app.use(morgan("dev"));

// Routers
app.use("/auth", otpRouter); // Short session (OTP)
app.use("/user", userRouter); // Long session (login)

app.listen(port, () => {
  console.log(`User service is running on port ${port}`);
});
