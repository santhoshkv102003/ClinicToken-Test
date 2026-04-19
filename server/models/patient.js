import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    treatment: { type: String, required: true },
    status: {
      type: String,
      enum: ["in-queue", "consulting", "completed"],
      default: "in-queue",
    },
    priority: { type: String, enum: ["normal", "emergency"], default: "normal" },
    consultationStartTime: { type: Date },
    consultationEndTime: { type: Date },
    email: { type: String },
    notificationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
