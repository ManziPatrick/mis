import mongoose from "mongoose";
import { IStoreCard } from "../../utils/types";

const storeCardSchema = new mongoose.Schema<IStoreCard>(
  {
    tradeNumber: { type: String, required: true },
    schoolYear: { type: String, required: true },
    itemDescription: { type: String, required: true },
    entries: [
      {
        date: { type: Date, required: true },
        qtyReceived: { type: Number, default: 0 },
        qtyRequested: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },
        userName: { type: String },
      },
    ],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    preparedBy: { type: String },
    preparedBySignature: { type: String },
    verifiedBy: { type: String },
    verifiedBySignature: { type: String },
    rejectionReason: { type: String },
    proofUrl: { type: String },
  },
  { timestamps: true }
);

export const StoreCard = mongoose.model<IStoreCard>("StoreCard", storeCardSchema);
