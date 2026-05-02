import mongoose from "mongoose";
import { IPurchaseOrder } from "../../utils/types";

const purchaseOrderSchema = new mongoose.Schema<IPurchaseOrder>(
  {
    poNumber: { type: String, required: true, unique: true },
    tradeNumber: { type: String, required: true },
    date: { type: Date, required: true },
    supplierName: { type: String, required: true },
    items: [
      {
        item: { type: String, required: true },
        specifications: { type: String },
        unit: { type: String },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    preparedBy: { type: String },
    preparedBySignature: { type: String },
    approvedBy: { type: String },
    approvedBySignature: { type: String },
    rejectionReason: { type: String },
    proofUrl: { type: String },
  },
  { timestamps: true }
);

export const PurchaseOrder = mongoose.model<IPurchaseOrder>("PurchaseOrder", purchaseOrderSchema);
