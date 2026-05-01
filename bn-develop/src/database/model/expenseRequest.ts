// src/database/model/expenseRequest.ts
import mongoose from 'mongoose';

const expenseRequestSchema = new mongoose.Schema({
  requested_for: {
    type: String,
    required: true,
    enum: ['employee', 'supplier','other']
  },
  idNumber:{
    type:"String",
    required: function(){
      return this.requested_for === 'other';
    }
  },
  phoneNumber:{
    type: String,
    required: function(){
      return this.requested_for === 'other';
    }
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  beneficiary: {
    type: String,
  },
  selectedSupplies:{
    type: Array,
    required: function (){
      return this.requested_for === 'supplier';
    }
  },
  quantity: {
    type: Number,
  },
  total_amount_paid: {
    type: Number,
    default: 0,
  },
  total_amount_to_be_paid: {
    type: Number,
    required: true,
  },
  total_remaining_balance: {
    type: Number,
    required: true,
  },
  expenseHistory: [
    {
      paymentAmount: Number,
      date: Date,
      paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      remainingBalance: Number,
      notes: String, // Optional field for remarks about the payment.
    },
  ],
  expected_payment_date: {
    type: Date,
    required: true,
  },
  payment_mode: {
    type: String,
    required: true,
    enum: ['Cheque', 'Cash', 'Transfer'],
  },
  payment_account: {
    type: String,
    required: true,
    enum: ['Bank', 'Petty Cash']
  },
  prepared_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
    enum: ['full-payment', 'transportation','advance-payment','salary']
  },
  preparer_details: {
    name: String,
    email: String
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approver_details: {
    name: String,
    email: String
  }, //
  description:{
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  rejection_reason: {
    type: String,
  },
  relatedRequestId:{
    type: mongoose.Schema.Types.ObjectId, ref: "ExpenseRequest", default: null
  }
}, { timestamps: true });

export const ExpenseRequest = mongoose.model('ExpenseRequest', expenseRequestSchema);