// src/database/model/receivedMoney.ts
import mongoose from 'mongoose';

const receivedMoneySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    amount: {
        type: mongoose.Types.Decimal128,
        required: true,
    },
    received_from: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    received_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    signed_document: {
        type: String,
        required: false
    },
    account: {
        type: String,
        required: true,
        enum: ['Bank', 'Petty Cash']
    },
}, { timestamps: true });

export const ReceivedMoney = mongoose.model('ReceivedMoney', receivedMoneySchema);
