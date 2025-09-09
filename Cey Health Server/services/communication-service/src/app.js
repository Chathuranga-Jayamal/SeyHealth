import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./router.js";

const app = express();
const port = 4000;

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

// Router
app.use("/comm", router);

app.listen(port, () => {
  console.log(`Communication service is running on port ${port}`);
});
