import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    treatment: { type: String, required: true },
    status: {
      type: String,
      enum: ["in-queue", "completed"],
      default: "in-queue",
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
