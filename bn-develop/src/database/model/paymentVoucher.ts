import mongoose from 'mongoose';

const paymentVoucherSchema = new mongoose.Schema({
    voucher_number: {
        type: String,
        required: true,
        unique: true
    },
    expense_request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpenseRequest',
        required: true
    },
    amount_paid: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Generated', 'Paid', 'Cancelled'],
        default: 'Generated'
    },
    generated_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    payment_mode: {
        type: String,
        required: true,
        enum: ['Cheque', 'Cash', 'Transfer']
    },
    payment_account: {
        type: String,
        required: true,
        enum: ['Bank', 'Petty Cash']
    },
    beneficiary: {
        type: String,
        required: true
    },
    prepared_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    document_status: {
        type: String,
        enum: ['Pending', 'Signed'],
        default: 'Pending'
    },
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    upload_date: {
        type: Date,
        required: false
    }
}, { timestamps: true });

export const PaymentVoucher = mongoose.model('PaymentVoucher', paymentVoucherSchema); 