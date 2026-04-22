import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Travel", "Bills", "Shopping", "Health", "Other"],
      default: "Other"
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;