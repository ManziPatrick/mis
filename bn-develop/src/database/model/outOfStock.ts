// src/database/model/outOfStock.ts

import mongoose from "mongoose";
import { IOutOfStock } from "../../utils/types";

const outOfStockSchema = new mongoose.Schema<IOutOfStock>({
    item: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    takenBy: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export const OutOfStock = mongoose.model<IOutOfStock>("OutOfStock", outOfStockSchema);