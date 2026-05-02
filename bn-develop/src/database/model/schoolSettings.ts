import mongoose from "mongoose";
import { ISchoolSettings } from "../../utils/types";

const schoolSettingsSchema = new mongoose.Schema<ISchoolSettings>(
  {
    schoolName: { type: String, required: true, default: "School Name" },
    address: { type: String, required: true, default: "School Address" },
    logoUrl: { type: String },
    tradePrefix: { type: String },
  },
  { timestamps: true }
);

export const SchoolSettings = mongoose.model<ISchoolSettings>("SchoolSettings", schoolSettingsSchema);
