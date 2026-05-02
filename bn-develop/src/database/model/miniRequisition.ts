import mongoose from "mongoose";
import { IMiniRequisition } from "../../utils/types";

const miniRequisitionSchema = new mongoose.Schema<IMiniRequisition>(
  {
    voucherNumber: { type: String, required: true, unique: true },
    tradeNumber: { type: String, required: true },
    date: { type: Date, required: true },
    items: [
      {
        item: { type: String, required: true },
        quantityRequisitioned: { type: Number, required: true },
        quantityReceived: { type: Number, default: 0 },
        observation: { type: String },
      },
    ],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    requestedBy: { type: String },
    requestedBySignature: { type: String },
    verifiedByAssistant: { type: String },
    verifiedByAssistantSignature: { type: String },
    approvedByDHT: { type: String },
    approvedByDHTSignature: { type: String },
    rejectionReason: { type: String },
    proofUrl: { type: String },
  },
  { timestamps: true }
);

export const MiniRequisition = mongoose.model<IMiniRequisition>("MiniRequisition", miniRequisitionSchema);
