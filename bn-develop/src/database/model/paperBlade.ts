import mongoose from "mongoose";
import { IPaperBlade } from "../../utils/types";

const paperBladeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    quantityBrought: {
        type: Number,
        required: true,
    },
    dateBrought: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

export const PaperBlade = mongoose.model<IPaperBlade>("PaperBlade", paperBladeSchema);