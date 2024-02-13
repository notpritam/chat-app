import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import morgan from "morgan";

dotenv.config({ path: ".env.local" });

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

const mongoURL = process.env.MONGO_URI;

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

export default app;
