import mongoose from "mongoose";
import { IStock } from "../../utils/types";

const stockSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  unity: {
    type: String,
    required: true,
  },
  unityPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  minimumThreshold: {
    type: Number,
    required: true,
    default: 5,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  proofOfDelivery: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

stockSchema.pre("save", function (next) {
  this.totalPrice = this.quantity * this.unityPrice;
  next();
});

const Stock = mongoose.model<IStock>("Stock", stockSchema);

export { Stock };