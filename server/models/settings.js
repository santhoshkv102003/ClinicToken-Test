import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    averageConsultationTimeMs: {
      type: Number,
      default: 300000, // Default to 5 minutes
    },
    defaultAvgTimeMs: {
      type: Number,
      default: 300000,
    },
    smoothingFactor: {
      type: Number,
      default: 3,
    },
    lastConsultationTimes: {
      type: [Number],
      default: [],
    },
    singletonIdentifier: {
      type: String,
      default: "GLOBAL_SETTINGS",
      unique: true,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
