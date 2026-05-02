import mongoose from "mongoose";
import { IAssetAssignment } from "../../utils/types";

const assetAssignmentSchema = new mongoose.Schema<IAssetAssignment>({
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assets",
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  assignedDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["assigned", "returned"],
    default: "assigned",
  },
  conditionOnAssignment: {
    type: String,
    required: true,
  },
  conditionOnReturn: {
    type: String,
  },
});

export const AssetAssignment = mongoose.model<IAssetAssignment>("AssetAssignment", assetAssignmentSchema);
