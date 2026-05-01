import mongoose from 'mongoose';

const expenseHistorySchema = new mongoose.Schema({
    expenseRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpenseRequest',
        required: true
    },
    previousState: {
        type: Object,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const ExpenseHistory = mongoose.model('ExpenseHistory', expenseHistorySchema); 