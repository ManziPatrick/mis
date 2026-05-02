import mongoose from "mongoose";
import { IReceivedNote } from "../../utils/types";

const receivedNoteSchema = new mongoose.Schema<IReceivedNote>(
  {
    grnNumber: { type: String, required: true, unique: true },
    poNumber: { type: String, required: true },
    tradeNumber: { type: String, required: true },
    date: { type: Date, required: true },
    supplierName: { type: String, required: true },
    items: [
      {
        item: { type: String, required: true },
        specifications: { type: String },
        unit: { type: String },
        quantity: { type: Number, required: true },
        remarks: { type: String },
      },
    ],
    committeeMembers: [{ name: { type: String } }],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvedBy: { type: String },
    approvedBySignature: { type: String },
    rejectionReason: { type: String },
    proofUrl: { type: String },
  },
  { timestamps: true }
);

export const ReceivedNote = mongoose.model<IReceivedNote>("ReceivedNote", receivedNoteSchema);
