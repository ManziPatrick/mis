// src/database/model/personalRequest.ts
import mongoose from 'mongoose';

const personalRequestSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true
    },
    request_description: {
        type: String,
        required: true
    },
    prepared_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    rejected_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true
    },
    payment_mode: {
        type: String,
        enum: ['Cheque', 'Cash', 'Transfer'],
    },
    payment_account: {
        type: String,
        enum: ['Bank', 'Petty Cash']
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    processed: {
        type: Boolean,
        default: false,
    },
    processedAt: {
        type: Date,
    },
    rejection_reason: {
        type: String,
    },
}, { timestamps: true });

export const PersonalRequest = mongoose.model('PersonalRequest', personalRequestSchema);