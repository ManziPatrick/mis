import mongoose from "mongoose";
import { ITransaction } from "../../utils/types";

const transactionSchema = new mongoose.Schema<ITransaction>({
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["IN", "OUT"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  pricePerItem: {
    type: Number,
    required: function () {
      return (this.transactionType === "IN" || this.transactionType === "OUT") && this.transactionSource === "general stock"; // Require price for both incoming and outgoing transactions
    },
  },
  totalPrice: {
    type: Number,
    required: true,
    default: function () {
      return this.quantity * this.pricePerItem; // Calculate total price based on quantity and price
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  previousQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  newQuantity: {
    type: Number,
    required: true,
    default: function () {
      return this.previousQuantity + this.quantity;
    },
  },
  takenBy: {
    type: String,
    required: function () {
      return this.transactionType === "OUT"; // Required for OUT transactions
    },
  },
  itemPrices: [{
    itemName: { type: String, required: function(){ return this.transactionSource === "full uniform" || this.transactionSource === 'partial uniform' || this.transactionSource === 'uniform stock'} },
    price: { type: Number, required: function(){ return this.transactionSource === "full uniform" || this.transactionSource === 'partial uniform' || this.transactionSource === 'uniform stock'} },
    quantity: { type: Number, required: function(){ return this.transactionSource === "full uniform" || this.transactionSource === 'partial uniform' || this.transactionSource === 'uniform stock'} },
  }],
  transactionSource: {
    type: String,
    enum: ["uniform stock", "general stock", "full uniform", "partial uniform"], // Can define any other types of transactions
    required: true,
  },
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
