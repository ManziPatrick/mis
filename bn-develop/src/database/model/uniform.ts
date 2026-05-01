import mongoose, { Schema, Document } from "mongoose";

interface IUniformType {
  itemName: string;
  quantity: number;
}

interface IUniformPayment extends Document {
  studentId: string;
  name: string;
  faculty: string;
  level: string;
  fullUniform: boolean;
  numberOfFullUniforms: number;
  uniformType?: IUniformType[];
  amountPaid: number;
  modeOfPayment: "Bank" | "Petty Cash";
  proofOfPaymentUrl: string;
  paymentStatus: 'pending'| 'approved'| 'rejected', 
  status: "paid" | "pending" | "rejected";
  approvedBy?: mongoose.Schema.Types.ObjectId;
  rejectedReason: string;
}

const UniformPaymentSchema = new Schema<IUniformPayment>(
  {
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    faculty: { type: String, required: true },
    level: { type: String, required: true },
    fullUniform: { type: Boolean, required: true },
    numberOfFullUniforms: { type: Number, default:0, required: function () { return this.fullUniform; } },
    uniformType: {
      type: [
        {
          itemName: { type: String, required: function () { return !this.fullUniform; } },
          quantity: { type: Number, required: function () { return !this.fullUniform; } },
        },
      ],
      default: [],
    },    
    amountPaid: { type: Number, required: true },
    modeOfPayment: {
      type: String,
      required: true,
      enum: ["Bank", "Petty Cash"],
    },
    proofOfPaymentUrl: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: "paid",
      enum: ["paid", "pending", "rejected","approved"],
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending', // Default to "pending" when payment is made
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    rejectedReason: { type: String },
  },
  { timestamps: true }
);

UniformPaymentSchema.index({ "uniformType.itemName": 1 }, { sparse: true });

const UniformPayment = mongoose.model<IUniformPayment>(
  "UniformPayment",
  UniformPaymentSchema
);

export { UniformPayment };
