import mongoose from "mongoose";
import { IRequisition } from "../../utils/types";

const requisitionSchema = new mongoose.Schema<IRequisition>(
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
    verifiedByDept: { type: String },
    verifiedByDeptSignature: { type: String },
    verifiedByLogistics: { type: String },
    verifiedByLogisticsSignature: { type: String },
    checkedByDHT: { type: String },
    checkedByDHTSignature: { type: String },
    approvedByHT: { type: String },
    approvedByHTSignature: { type: String },
    rejectionReason: { type: String },
    proofUrl: { type: String },
  },
  { timestamps: true }
);

export const Requisition = mongoose.model<IRequisition>("Requisition", requisitionSchema);
