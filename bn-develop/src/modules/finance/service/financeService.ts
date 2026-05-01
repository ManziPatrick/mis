import { Payment } from '../../../database/model/payment';

export class FinanceService {
  async createPayment(paymentData: {
    payeeType: string;
    payeeId: string;
    payeeName: string;
    amountPaid: number;
    totalAmount: number;
    proofOfPaymentUrl?: string;
    referenceId: string;
    referenceType: string;
    description?: string;
  }) {
    const remainingBalance = paymentData.totalAmount - paymentData.amountPaid;
    
    const payment = new Payment({
      ...paymentData,
      remainingBalance,
      status: remainingBalance === 0 ? 'Paid' : 'Pending'
    });

    await payment.save();
    
    // Update the reference document (Expense/Payroll/Stock) with payment info
    await this.updateReferenceDocument(
      paymentData.referenceType,
      paymentData.referenceId,
      payment
    );

    return payment;
  }

  private async updateReferenceDocument(referenceType: string, referenceId: string, payment: any) {
    // Update the corresponding document based on referenceType
    switch (referenceType) {
      case 'Expense':
        // Update expense request
        break;
      case 'Payroll':
        // Update payroll
        break;
      case 'Stock':
        // Update stock payment
        break;
      // Add other cases as needed
    }
  }

  async getPaymentsByReference(referenceType: string, referenceId: string) {
    return Payment.find({ referenceType, referenceId });
  }

  async updatePayment(paymentId: string, updateData: {
    amountPaid?: number;
    proofOfPaymentUrl?: string;
  }) {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error('Payment not found');

    if (updateData.amountPaid) {
      payment.amountPaid += updateData.amountPaid;
      payment.remainingBalance = payment.totalAmount - payment.amountPaid;
      // Status will be automatically updated by the middleware
    }

    if (updateData.proofOfPaymentUrl) {
      payment.proofOfPaymentUrl = updateData.proofOfPaymentUrl;
    }

    return payment.save();
  }
} 