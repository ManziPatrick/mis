// src/modules/finance/repository/index.ts
import { ExpenseRequest } from "../../../database/model/expenseRequest";
import { ClientSession } from "mongoose";
import { PaymentVoucher } from "../../../database/model/paymentVoucher";
import { ReceivedMoney } from "../../../database/model/receivedMoney";
import { PettyCash } from "../../../database/model/pettyCash";
import { Payroll } from "../../../database/model/payroll";

import { UniformPayment } from "../../../database/model/uniform";
import { IUniformPayment } from "../../../utils/types";
import { IEmployee } from '../../../utils/types';
import { Employee } from "../../../database/model/employee";
import { Payment } from "../../../database/model/payment";

interface IExpenseRequest {
    requested_for: string;
    date: Date;
    beneficiary: string;
    quantity: number;
    total_amount_paid: number;
    total_amount_to_be_paid: number;
    total_remaining_balance: number;
    expected_payment_date: Date;
    payment_mode: string;
    payment_account: string;
    approved_by: string;
    status: string;
    relatedRequestId:string;
}

interface CreateReceivedMoneyInput {
    date: Date;
    amount: number;
    received_from: string;
    reason: string;
    received_by: string; // Finance user ID
    approved_by: string; // Admin user ID
    signed_document: string;
    account: string;
}

export const getExpenseRequests = async () => {
    return await ExpenseRequest.find().populate([{path: 'employeeId', select: 'name email'}, {path: 'supplierId', select: 'name email'}]);
};

export const createExpenseRequest = async (expenseRequest: IExpenseRequest) => {
    const newExpenseRequest = await ExpenseRequest.create(expenseRequest);
    return await newExpenseRequest.populate([{path: 'employeeId', select: 'name email'}, {path: 'supplierId', select: 'name email'},{path: 'relatedRequestId'}]);
};

export const getExpenseRequestById = async (id: string, options: { session?: ClientSession } = {}) => {
    try {
      return await ExpenseRequest.findById(id)
        .populate('employeeId')
        .populate('supplierId')
        .populate('relatedRequestId')
        .session(options.session || null);
    } catch (error) {
      console.error(`Error fetching expense request with ID ${id}:`, error);
      throw new Error('Unable to fetch expense request');
    }
  };
  

export const deleteExpenseRequest = async (id: string) => {
    return await ExpenseRequest.findByIdAndDelete(id);
};

export const getPaymentVouchers = async () => {
    return await PaymentVoucher.find();
};

export const getPaymentVoucherById = async (id: string) => {
    return await PaymentVoucher.findById(id);
};

export const deletePaymentVoucher = async (id: string) => {
    return await PaymentVoucher.findByIdAndDelete(id);
};

export const createReceivedMoney = async (data: CreateReceivedMoneyInput): Promise<any> => {
    try {
        const receivedMoney = new ReceivedMoney({
            ...data,
            status: 'Pending' // You might want to add a status field to track approval state
        });
        await receivedMoney.save();
        
        // Populate the user references
        await receivedMoney.populate([
            {
                path: 'received_by',
                select: 'firstName lastName email'
            },
            {
                path: 'approved_by',
                select: 'firstName lastName email'
            },
            {
                path: 'approved_by',
                select: 'firstName lastName email'
            }
        ]);
        
        return receivedMoney;
    } catch (error) {
        throw error;
    }
};

export const getReceivedMoney = async () => {
    return await ReceivedMoney.find();
};

export const getReceivedMoneyById = async (id: string) => {
    return await ReceivedMoney.findById(id);
};

export const deleteReceivedMoney = async (id: string) => {
    return await ReceivedMoney.findByIdAndDelete(id);
};

export const createUniformPayment = async (data: IUniformPayment) => {
    const uniformPayment = new UniformPayment(data);
    return await uniformPayment.save();
};



export const getUniformPayment = async () => {
    return await UniformPayment.find();
};

export const getUniformPaymentById = async (id: string) => {
    return await UniformPayment.findById(id);
};

export const addPettyCashEntry = async (pettyCashData: {
    transaction_type: 'expense' | 'income';
    amount_paid: number;
    amount_received: number;
    amount_balance: number;
    description: string;
    reference_model: 'ReceivedMoney' | 'ExpenseRequest';
}) => {
    try {
        const pettyCashEntry = new PettyCash(pettyCashData);
        return await pettyCashEntry.save();
    } catch (error) {
        throw new Error(`Failed to create petty cash entry: ${error.message}`);
    }
};

export const getLatestPettyCashBalance = async () => {
    try {
        const lastTransaction = await PettyCash.findOne()
            .sort({ createdAt: -1 });
        return Number(lastTransaction?.amount_balance?.toString() || 0);
    } catch (error) {
        throw new Error(`Failed to get latest petty cash balance: ${error.message}`);
    }
};

export const getPettyCashEntries = async () => {
    return await PettyCash.find();
};

export const getPettyCashEntryById = async (id: string) => {
    return await PettyCash.findById(id);
};

export const createPayroll = async (payrollData: any) => {
    const employee = await Employee.findById(payrollData.employeeId).select('netSalary');
    const payment = await Payment.findOne({_id: payrollData.paymentId});
    const payroll = new Payroll({
        ...payrollData,
        netSalary: employee?.netSalary || 0,
        advance: [{
            amount: payment?.amountPaid || 0, 
            reason: payrollData.reason
        }],
        totalAmount: payrollData.netSalary - payrollData.advance[0].amount,
        status: payment?.status
    });
    await payroll.save();
    return await payroll.populate<{employeeId: IEmployee}>({
        path: 'employeeId',
        select: 'name'
    });
};

export const getPayroll = async () => {
    return await Payroll.find().populate<{employeeId: IEmployee}>({
        path: 'employeeId',
        select: 'name'
    });
};