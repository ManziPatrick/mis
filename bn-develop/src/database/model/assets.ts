import mongoose from "mongoose";
import { IAssets } from "../../utils/types";

const assetsSchema = new mongoose.Schema<IAssets>(
  {
    item: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: Date,
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
    location: {
      type: String,
      required: true,
    },
    totalNumber: {
      type: Number,
      required: true,
    },
    totalNumberInGoodCondition: {
      type: Number,
      required: true,
    },
    totalNumberInCriticalCondition: {
      type: Number,
      required: true,
    },
    values: {
      type: Number,
      required: true,
    },
    totalValues: {
      type: Number,
      required: true,
    },
    criticalCondition: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Assets = mongoose.model<IAssets>("Assets", assetsSchema);
