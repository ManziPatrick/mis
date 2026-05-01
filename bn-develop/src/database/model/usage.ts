import mongoose from "mongoose";

const UsageSchema = new mongoose.Schema({
  quantityUsed: { type: Number, required: true },
  dateUsed: { type: Date, default: Date.now },
  purpose: { type: String, required: true },
});

export const Usage  = mongoose.model('Usage', UsageSchema);