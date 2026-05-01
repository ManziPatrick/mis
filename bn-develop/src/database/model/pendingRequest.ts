import mongoose, { Schema, Document } from "mongoose";
interface PendingUpdate extends Document {
   stockId: string,
  itemName: string,
  quantity: number,
  price?:number,
  proofOfDelivery: string,
  requestedBy: string,
  status:  "Pending"| "Approved"| "Rejected",
  createdAt:Date,
  updatedAt:Date,
};
const PendingUpdateSchema = new Schema({
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: "UnifornStock", required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: false },
  proofOfDelivery: { type: String, required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export const PendingUpdate = mongoose.model<PendingUpdate & Document>("PendingUpdate", PendingUpdateSchema);
