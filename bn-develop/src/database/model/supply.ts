
import mongoose from 'mongoose';
import { ISupply } from '../../utils/types';

const supplySchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    item: String,
    quantity: Number,
    unitPrice: Number,
    totalCost: Number,
    deliveryDate: Date,
    remainingBalance: Number,
    status: { type: String, enum: ["Unpaid", "fully-paid","advance-payment"]}
  },{
    timestamps: true
  });
  
  export const Supply = mongoose.model<ISupply>("Supply", supplySchema);
  