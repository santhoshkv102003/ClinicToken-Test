import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Patient from "./models/patient.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// DB Connection
// DB Connection
// mongoose
//   .connect(process.env.MONGO_URI, { dbName: "hospital_tokens" })
//   .then(() => console.log("MongoDB connected ✅"))
//   .catch((err) => console.error("MongoDB error:", err));
// Connect to DB before every request (for Vercel serverless environment)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// ROUTES

// Get patients by status
app.get("/api/patients", async (req, res) => {
  try {
    const status = req.query.status; // "in-queue" or "completed"
    const filter = status ? { status } : {};
    const patients = await Patient.find(filter).sort({ createdAt: 1 });
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add new patient (booking)
app.post("/api/patients", async (req, res) => {
  try {
    const { name, age, phone, treatment } = req.body;

    const patient = await Patient.create({
      name,
      age,
      phone,
      treatment,
      status: "in-queue",
    });

    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Next patient: move first in queue → completed
app.patch("/api/patients/next", async (req, res) => {
  try {
    const next = await Patient.findOne({ status: "in-queue" })
      .sort({ createdAt: 1 });

    if (!next) {
      return res.status(400).json({ message: "No patients in queue" });
    }

    next.status = "completed";
    await next.save();

    res.json({ message: "Next patient completed", patient: next });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset all: delete all patients
app.delete("/api/patients", async (req, res) => {
  try {
    await Patient.deleteMany({});
    res.json({ message: "All patients deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Summary endpoint (optional)
app.get("/api/summary", async (req, res) => {
  try {
    const inQueueCount = await Patient.countDocuments({ status: "in-queue" });
    const completedCount = await Patient.countDocuments({ status: "completed" });

    res.json({
      inQueue: inQueueCount,
      completed: completedCount,
      waitMinutes: inQueueCount * 5,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
}

export default app;
