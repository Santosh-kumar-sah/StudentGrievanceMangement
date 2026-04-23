import mongoose from "mongoose";

// Refactor: User schema replaced with Student schema.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", userSchema);

export default Student;