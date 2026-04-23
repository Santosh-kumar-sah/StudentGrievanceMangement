import mongoose from "mongoose";

// Refactor: Grievance schema for student grievance management.
const grievanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Academic", "Hostel", "Transport", "Other"],
      default: "Other"
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

const Grievance = mongoose.model("Grievance", grievanceSchema);

export default Grievance;