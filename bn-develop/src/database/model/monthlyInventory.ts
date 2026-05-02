import mongoose from "mongoose";
import { IMonthlyInventory } from "../../utils/types";

const monthlyInventorySchema = new mongoose.Schema<IMonthlyInventory>(
  {
    tradeNumber: { type: String, required: true },
    schoolYear: { type: String, required: true },
    month: { type: String, required: true },
    items: [
      {
        item: { type: String, required: true },
        initialStock: { type: Number, required: true },
        purchasedStock: { type: Number, required: true },
        consumedStock: { type: Number, required: true },
        remainingStock: { type: Number, required: true },
      },
    ],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    preparedBy: { type: String },
    preparedBySignature: { type: String },
    checkedBy: { type: String },
    checkedBySignature: { type: String },
    verifiedBy: { type: String },
    verifiedBySignature: { type: String },
    approvedBy: { type: String },
    approvedBySignature: { type: String },
    rejectionReason: { type: String },
    proofUrl: { type: String },
  },
  { timestamps: true }
);

export const MonthlyInventory = mongoose.model<IMonthlyInventory>("MonthlyInventory", monthlyInventorySchema);
