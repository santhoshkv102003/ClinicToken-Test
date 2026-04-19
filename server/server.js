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

import notificationService from "./services/notificationService.js";

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
    const settings = await getSettings();

    // Calculate Token Number (simple increment for today)
    const count = await Patient.countDocuments({});
    const tokenNumber = count + 1;

    const patient = await Patient.create({
      name,
      age,
      phone,
      treatment,
      status: "in-queue",
      tokenNumber
    });

    // Calculate wait time for notification (Initial logic when booking)
    // patientsAhead = tokenNumber - currentToken - 1
    // If no one is consulting, currentToken effectively 0
    const consulting = await Patient.findOne({ status: "consulting" });
    const currentToken = consulting ? consulting.tokenNumber : 0;
    const patientsAhead = tokenNumber - currentToken - 1;
    
    let waitTime = patientsAhead * (settings.averageConsultationTimeMs / 60000);
    
    // Add remaining time if someone is consulting
    if (consulting) {
      const elapsed = (new Date() - consulting.consultationStartTime) / 60000;
      const remaining = Math.max(0, (settings.averageConsultationTimeMs / 60000) - elapsed);
      waitTime += remaining;
    } else {
      // If doctor not started, use default logic: (token_number - 1) * default_avg
      if (currentToken === 0) {
        waitTime = (tokenNumber - 1) * (settings.defaultAvgTimeMs / 60000);
      }
    }

    // Send Notification
    await notificationService.sendNotification(patient, tokenNumber, waitTime);

    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Next patient: move current consulting to completed, move first in queue → consulting
app.patch("/api/patients/next", async (req, res) => {
  try {
    const settings = await getSettings();
    
    // 1. Finish the current 'consulting' patient
    const currentConsulting = await Patient.findOne({ status: "consulting" });
    if (currentConsulting) {
      currentConsulting.status = "completed";
      currentConsulting.consultationEndTime = new Date();
      await currentConsulting.save();

      // Calculate duration and update average using SMOOTHING formula
      // avg_time = (old_avg * w + last_consultation_time) / (w + 1)
      const startTime = currentConsulting.consultationStartTime || currentConsulting.createdAt;
      const duration = currentConsulting.consultationEndTime - startTime;
      
      const w = settings.smoothingFactor || 3;
      settings.averageConsultationTimeMs = (settings.averageConsultationTimeMs * w + duration) / (w + 1);
      
      settings.lastConsultationTimes.push(duration);
      if (settings.lastConsultationTimes.length > 10) settings.lastConsultationTimes.shift();
      
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

// PATCH /api/settings - Adjust pace manually
app.patch("/api/settings", async (req, res) => {
  try {
    const { averageConsultationTimeMs, smoothingFactor } = req.body;
    const settings = await getSettings();
    
    if (averageConsultationTimeMs !== undefined) settings.averageConsultationTimeMs = averageConsultationTimeMs;
    if (smoothingFactor !== undefined) settings.smoothingFactor = smoothingFactor;
    
    await settings.save();
    res.json(settings);
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
