import mongoose from "mongoose";
import { IUtilizationReport } from "../../utils/types";

const utilizationReportSchema = new mongoose.Schema<IUtilizationReport>(
  {
    tradeNumber: { type: String, required: true },
    rqfLevel: { type: String, required: true },
    titleOfModule: { type: String, required: true },
    schoolYear: { type: String, required: true },
    dateOfSubmission: { type: Date, required: true },
    items: [
      {
        item: { type: String, required: true },
        quantityReceived: { type: Number, required: true },
        totalStudents: { type: Number, required: true },
        quantityUtilized: { type: Number, required: true },
        balance: { type: Number, required: true },
      },
    ],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    preparedBy: { type: String },
    preparedBySignature: { type: String },
    checkedBy: { type: String },
    checkedBySignature: { type: String },
    approvedBy: { type: String },
    approvedBySignature: { type: String },
    rejectionReason: { type: String },
    proofUrl: { type: String },
  },
  { timestamps: true }
);

export const UtilizationReport = mongoose.model<IUtilizationReport>("UtilizationReport", utilizationReportSchema);
