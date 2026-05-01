// supplier model
import mongoose from "mongoose";
import { ISupplier } from "../../utils/types";

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tin: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
    },
    commodity: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    contract: {
        type: String,
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    deleteReason: {
        type: String,
    },
    rejected_reason: {
        type: String,
    },
}, { timestamps: true });

export const Supplier = mongoose.model<ISupplier>("Supplier", supplierSchema);
