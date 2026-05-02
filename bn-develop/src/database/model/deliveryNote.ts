import mongoose from "mongoose";
import { IDeliveryNote } from "../../utils/types";

const deliveryNoteSchema = new mongoose.Schema<IDeliveryNote>(
  {
    dnNumber: { type: String, required: true, unique: true },
    poNumber: { type: String, required: true },
    tradeNumber: { type: String, required: true },
    date: { type: Date, required: true },
    items: [
      {
        item: { type: String, required: true },
        specifications: { type: String },
        unit: { type: String },
        quantityOrdered: { type: Number, required: true },
        quantityDelivered: { type: Number, required: true },
      },
    ],
    deliveredBy: [{ name: { type: String } }],
    receivingCommittee: [{ name: { type: String } }],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvedBy: { type: String },
    approvedBySignature: { type: String },
    rejectionReason: { type: String },
    proofUrl: { type: String },
  },
  { timestamps: true }
);

export const DeliveryNote = mongoose.model<IDeliveryNote>("DeliveryNote", deliveryNoteSchema);
