// Payment model
import mongoose, { Document } from "mongoose";

interface IPayment extends Document {
  payeeType: string;
  payeeId: string;
  payeeName: string;
  amountPaid: number;
  totalAmount: number;
  paymentDate: Date;
  proofOfPaymentUrl: string;
  remainingBalance: number;
  status: string;
  referenceId: mongoose.Types.ObjectId;
  referenceType: string;
  reason: string;
}

const paymentSchema = new mongoose.Schema({
    payeeType: { type: String, required: true }, // e.g., 'Employee', 'Student', 'Supplier'
    payeeId: { type: mongoose.Schema.Types.ObjectId, required: true },
    payeeName: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    description: { type: String },
    proofOfPaymentUrl: { type: String },
    remainingBalance: { type: Number, required: true, default: 0 },
    status: { 
      type: String, 
      enum: ["Paid", "Pending", "Overpaid"], 
      required: true,
      default: "Pending"
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: { 
        type: String,
        required: true,
        enum: ["advance-payment", "transportation", "full-payment",'salary']
     }
  },
  { timestamps: true }
);

// Add middleware to auto-update status
paymentSchema.pre('save', function(next) {
  this.status = this.remainingBalance === 0 ? "Paid" : this.remainingBalance > 0 ? "Pending" : "Overpaid";
  next();
});

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
