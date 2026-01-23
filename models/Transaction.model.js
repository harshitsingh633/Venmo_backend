import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  status: {
    type: String,
    enum: ["SUCCESS", "FAILED", "PENDING"]
  },
  createdAt: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);
