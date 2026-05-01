// src/database/model/pettyCash.ts
import mongoose from "mongoose";

const pettyCashSchema = new mongoose.Schema({
    transaction_type: {
        type: String,
        enum: ["expense", "income"],
        required: true
    },
    amount_paid: {
        type: Number,
        get: (v: any) => Number(v),
        default: 0
    },
    amount_received: {
        type: Number,
        get: (v: any) => Number(v),
        default: 0
    },
    amount_balance: {
        type: Number,
        get: (v: any) => Number(v),
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    reference_model: {
        type: String,
        required: true,
        enum: ['ReceivedMoney', 'ExpenseRequest']
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Pre-save middleware to calculate balance
pettyCashSchema.pre('save', function(next) {
    if (this.transaction_type === 'expense') {
        this.amount_paid = this.amount_paid || 0;
        this.amount_received = 0;
    } else {
        this.amount_received = this.amount_received || 0;
        this.amount_paid = 0;
    }
    next();
});

export const PettyCash = mongoose.model("PettyCash", pettyCashSchema);


