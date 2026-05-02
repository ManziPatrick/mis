import mongoose from "mongoose";
import { ITransaction } from "../../utils/types";

const transactionSchema = new mongoose.Schema<ITransaction>({
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: false,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LibraryTable",
    required: false,
  },
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assets",
    required: false,
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
    required: false,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: function () {
      return this.quantity * (this.pricePerItem || 0);
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
  },
  takenBy: {
    type: String,
    required: false,
  },
  itemPrices: [{
    itemName: { type: String },
    price: { type: Number },
    quantity: { type: Number },
  }],
  transactionSource: {
    type: String,
    enum: ["uniform stock", "general stock", "full uniform", "partial uniform", "library borrowing", "asset assignment"],
    required: true,
  },
});

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
