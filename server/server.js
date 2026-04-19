import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Patient from "./models/patient.js";
import Settings from "./models/settings.js";
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

// Helper to get settings
const getSettings = async () => {
  let settings = await Settings.findOne({ singletonIdentifier: "GLOBAL_SETTINGS" });
  if (!settings) {
    settings = await Settings.create({ singletonIdentifier: "GLOBAL_SETTINGS" });
  }
  return settings;
};

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

// Next patient: move current consulting to completed, move first in queue → consulting
app.patch("/api/patients/next", async (req, res) => {
  try {
    // 1. Finish the current 'consulting' patient (if any)
    const currentConsulting = await Patient.findOne({ status: "consulting" });
    if (currentConsulting) {
      currentConsulting.status = "completed";
      currentConsulting.consultationEndTime = new Date();
      await currentConsulting.save();

      // Calculate duration and update average
      const startTime = currentConsulting.consultationStartTime || currentConsulting.createdAt;
      const duration = currentConsulting.consultationEndTime - startTime;
      const settings = await getSettings();

      settings.lastConsultationTimes.push(duration);
      if (settings.lastConsultationTimes.length > 5) {
        settings.lastConsultationTimes.shift();
      }

      const sum = settings.lastConsultationTimes.reduce((a, b) => a + b, 0);
      settings.averageConsultationTimeMs = sum / settings.lastConsultationTimes.length;
      await settings.save();
    }

    // 2. Start the next 'in-queue' patient
    const next = await Patient.findOne({ status: "in-queue" }).sort({ createdAt: 1 });

    if (!next) {
      return res.status(200).json({ 
        message: currentConsulting ? "Consultation finished, no more patients in queue" : "No patients in queue", 
        finishedPatient: currentConsulting || null,
        nextPatient: null 
      });
    }

    next.status = "consulting";
    next.consultationStartTime = new Date();
    await next.save();

    res.json({ 
      message: "Moved to next patient", 
      finishedPatient: currentConsulting || null,
      nextPatient: next 
    });
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
    const consultingCount = await Patient.countDocuments({ status: "consulting" });
    const completedCount = await Patient.countDocuments({ status: "completed" });
    
    const settings = await getSettings();
    const avgMinutes = settings.averageConsultationTimeMs / 60000;

    res.json({
      inQueue: inQueueCount,
      consulting: consultingCount,
      completed: completedCount,
      averageConsultationTimeMinutes: avgMinutes,
      waitMinutes: (inQueueCount + consultingCount) * avgMinutes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Settings endpoint
app.get("/api/settings", async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
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
