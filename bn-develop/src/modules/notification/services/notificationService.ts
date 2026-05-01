// src/modules/notification/services/notificationService.ts
import { io } from '../../../index';
import { createNotification, NotificationRepo } from '../repository/notificationRepo';
import { EventEmitter } from 'events';
import { 
  sendExpenseRejectionEmail, 
  sendWelcomeEmail,
  sendExpenseRequestEmail,
  sendExpenseApprovalEmail,
  sendBookDeletionRequestEmail,
  sendBookDeletionApprovalEmail,
  sendBookDeletionRejectionEmail,
  sendSupplierApprovalEmail,
  sendSupplierCreationEmail,
  sendSupplierRejectionEmail,
  sendUniformPurchaseEmail,
  sendPasswordResetEmail,
  sendOTPEmail,
  sendEmployeeCreationEmail,
  sendEmployeeApprovalEmail,
  sendEmployeeRejectionEmail,
  sendEmployeeDeletionRequestEmail,
  sendEmployeeDeletionApprovalEmail,
  sendEmployeeDeletionRejectionEmail,
  sendUpdateUniformRequestEmail,
  sendUpdateUniformApprovalEmail,
  sendUpdateUniformRejectionEmail,
} from './notificationEmail';
import { sendSMS } from './notificationSMS';
import { NotificationType } from '../../../utils/notificationTypes';

export const eventEmitter = new EventEmitter();

const saveAndEmitNotification = async (userId: string, message: string, event: string, type: NotificationType) => {
    await createNotification({
        user: userId,
        message: message,
        type: type,
        isRead: false
    });
    io.to(userId).emit(event, message, type);
};

export class NotificationService {
  private notificationRepo: NotificationRepo;

  constructor() {
    this.notificationRepo = new NotificationRepo();
  }

  async sendUserWelcomeNotification(userData: {
    email: string;
    password: string;
    role: string;
    name?: string;
    userId: string;
  }) {
    try {
      await sendWelcomeEmail(userData);
    } catch (error) {
      console.error('Error in sendUserWelcomeNotification:', error);
      throw error;
    }
  }

  async notifyExpenseRequest(expenseData: {
    amount: number;
    description: string;
    requestedBy: string;
    adminIds: string[];
    //financeIds: string[];
  }) {
    try {
      const { amount, description, requestedBy, adminIds } = expenseData;
      const message = `New expense request: ${description} for Rwf ${amount} by ${requestedBy}`;
      
      // Notify all admins
      for (const adminId of adminIds) {
        await saveAndEmitNotification(adminId, message, 'expense-request', NotificationType.EXPENSE_REQUEST);
      }

      // Notify finance team
      // for (const financeId of financeIds) {
      //   await saveAndEmitNotification(financeId, message, 'expense-request', NotificationType.EXPENSE_REQUEST);
      // }
    } catch (error) {
      console.error('Error in notifyExpenseRequest:', error);
      throw error;
    }
  }

  async notifyExpenseApproval(approvalData: {
    expenseId: string;
    amount: number;
    description: string;
    requestedBy: string;
    approvedBy: string;
    financeIds: string[];
  }) {
    try {
      const { amount, description, requestedBy, approvedBy, financeIds } = approvalData;
      const message = `Expense approved: ${description} for Rwf ${amount} requested by ${requestedBy}, approved by ${approvedBy}`;
      
      // Notify finance team
      for (const financeId of financeIds) {
        await saveAndEmitNotification(financeId, message, 'expense-approved', NotificationType.EXPENSE_APPROVED);
      }
    } catch (error) {
      console.error('Error in notifyExpenseApproval:', error);
      throw error;
    }
  }

  async notifyExpenseRejection(rejectionData: {
    expenseId: string;
    amount: number;
    description: string;
    requestedBy: string;
    rejectedBy: string;
    financeIds: string[];
  }) {
    try {
      const { amount, description, requestedBy, rejectedBy, financeIds } = rejectionData;
      const message = `Expense rejected: ${description} for Rwf ${amount} requested by ${requestedBy}, rejected by ${rejectedBy}`;
      
      // Notify finance team
      for (const financeId of financeIds) {
        await saveAndEmitNotification(financeId, message, 'expense-rejected', NotificationType.EXPENSE_REJECTED);
      }
    } catch (error) {
      console.error('Error in notifyExpenseRejection:', error);
      throw error;
    }
  }

  async notifyBookDeletionRequest(requestData: {
    bookId: string;
    bookTitle: string;
    requestedBy: string;
    reason: string;
    adminIds: string[];
  }) {
    try {
      const { bookTitle, requestedBy, reason, adminIds } = requestData;
      const message = `Book deletion requested: "${bookTitle}" by ${requestedBy}. Reason: ${reason}`;
      
      // Notify admins
      for (const adminId of adminIds) {
        await saveAndEmitNotification(adminId, message, 'book-requested', NotificationType.BOOK_DELETION_REQUEST);
      }
    } catch (error) {
      console.error('Error in notifyBookDeletionRequest:', error);
      throw error;
    }
  }

  async notifyBookDeletionApproval(approvalData: {
    bookId: string;
    bookTitle: string;
    approvedBy: string;
    libraryIds: string[];
  }) {
    try {
      const { bookTitle, approvedBy, libraryIds } = approvalData;
      const message = `Book deletion approved: "${bookTitle}" by ${approvedBy}`;
      
      // Notify library team
      for (const libraryId of libraryIds) {
        await saveAndEmitNotification(libraryId, message, 'book-approved', NotificationType.BOOK_DELETION_APPROVED);
      }
    } catch (error) {
      console.error('Error in notifyBookDeletionApproval:', error);
      throw error;
    }
  }

  async notifyBookDeletionRejection(rejectionData: {
    bookId: string;
    bookTitle: string;
    rejectedBy: string;
    libraryIds: string[];
  }) {
    try {
      const { bookTitle, rejectedBy, libraryIds } = rejectionData;
      const message = `Book deletion rejected: "${bookTitle}" by ${rejectedBy}.`;
      
      // Notify library team
      for (const libraryId of libraryIds) {
        await saveAndEmitNotification(libraryId, message, 'book-rejected', NotificationType.BOOK_DELETION_REJECTED);
      }
    } catch (error) {
      console.error('Error in notifyBookDeletionRejection:', error);
      throw error;
    }
  }

  async notifySupplierCreation(data: {
    supplierName: string;
    commodity: string;
    createdBy: string;
    adminIds: string[];
  }) {
    try {
      const { supplierName, commodity, createdBy, adminIds } = data;
      const message = `New supplier "${supplierName}" with commodity: ${commodity} is created by ${createdBy}`;

      // Notify admins
      for (const adminId of adminIds) {
        await saveAndEmitNotification(adminId, message, 'supplier-created', NotificationType.SUPPLIER_CREATED);
      }
    } catch (error) {
      console.error('Error in notifySupplierCreation:', error);
      throw error;
    }
  }

  async notifySupplierApproval(data: {
    supplierName: string;
    approvedBy: string;
    procurementIds: string[];
  }) {
    try {
      const { supplierName, approvedBy, procurementIds } = data;
      const message = `Supplier "${supplierName}" registration approved by ${approvedBy}`;

      // Notify procurement team
      for (const procurementId of procurementIds) {
        await saveAndEmitNotification(procurementId, message, 'supplier-approved', NotificationType.SUPPLIER_APPROVED);
      }
    } catch (error) {
      console.error('Error in notifySupplierApproval:', error);
      throw error;
    }
  }

  async notifySupplierRejection(data: {
    supplierName: string;
    rejectedBy: string;
    procurementIds: string[];
  }) {
    try {
      const { supplierName, rejectedBy, procurementIds } = data;
      const message = `Supplier "${supplierName}" registration rejected by ${rejectedBy}`;

      // Notify procurement team
      for (const procurementId of procurementIds) {
        await saveAndEmitNotification(procurementId, message, 'supplier-rejected', NotificationType.SUPPLIER_REJECTED);
      }
    } catch (error) {
      console.error('Error in notifySupplierRejection:', error);
      throw error;
    }
  }

  async notifyUniformPurchase(data: {
    studentId: string;
    name: string;
    faculty: string;
    level: string;
    amountPaid: number;
    storeIds: string[];
    uniformType?: {
      itemName: string;
      quantity: number;
    }[];
    fullUniform?: "Full uniform" | "Partial uniform";
  }) {
    try {
      const {
        studentId,
        name,
        faculty,
        level,
        uniformType,
        fullUniform,
        amountPaid,
        storeIds,
      } = data;

      const uniformMessage = uniformType && uniformType.length > 0
        ? uniformType.map((item) => `${item.itemName} - ${item.quantity}`).join(", ")
        : fullUniform === 'Full uniform' ? 'Full uniform' : 'Partial uniform';

      const message = `New uniform purchase request: Student ID: ${studentId} - Name: ${name} - Faculty: ${faculty} - Level: ${level} - Uniform: ${uniformMessage} - Amount Paid: ${amountPaid}`;

      // Notify store team
      for (const storeId of storeIds) {
        await saveAndEmitNotification(storeId, message, 'uniform-purchase', NotificationType.UNIFORM_PURCHASE);
      }
    } catch (error) {
      console.error('Error in notifyUniformPurchase:', error);
      throw error;
    }
  }

  async notifyEmployeeCreation(data: {
    name: string;
    department: string;
    occupation: string;
    nationality: string;
    netSalary: number;
    requestedBy: string;
    adminIds: string[];
  }) {
    try {
      const { 
        name,
        department,
        occupation,
        nationality,
        netSalary,
        requestedBy, 
        adminIds 
      } = data;
      const message = `New employee "${name}" in ${department} department as ${occupation} nationality "${nationality}" has been created by ${requestedBy} with a net salary of Rwf ${netSalary}`;

      // Notify admins
      for (const adminId of adminIds) {
        await saveAndEmitNotification(adminId, message, 'employee-created', NotificationType.EMPLOYEE_CREATED);
      }
    } catch (error) {
      console.error('Error in notifyEmployeeCreation:', error.message);
      throw error;
    }
  }

  async notifyEmployeeApproval(data: {
    name: string;
    approvedBy: string;
    hrIds: string[];
  }) {
    try {
      const { name, approvedBy, hrIds } = data;
      const message = `Employee "${name}" registration approved by ${approvedBy}`;

      // Notify hr team
      for (const hrId of hrIds) {
        await saveAndEmitNotification(hrId, message, 'employee-approved', NotificationType.EMPLOYEE_APPROVED);
      }
    } catch (error) {
      console.error('Error in notifyEmployeeApproval:', error.message);
      throw error;
    }
  }

  async notifyEmployeeRejection(data: {
    name: string;
    rejectedBy: string;
    hrIds: string[];
  }) {
    try {
      const { name, rejectedBy, hrIds } = data;
      const message = `Employee "${name}" registration rejected by ${rejectedBy}`;

      // Notify hr team
      for (const hrId of hrIds) {
        await saveAndEmitNotification(hrId, message, 'employee-rejected', NotificationType.EMPLOYEE_REJECTED);
      }
    } catch (error) {
      console.error('Error in notifyEmployeerRejection:', error.message);
      throw error;
    }
  }

  async notifyEmployeeDeletionRequest(requestData: {
    name: string;
    requestedBy: string;
    reason: string;
    adminIds: string[];
  }) {
    try {
      const { name, requestedBy, reason, adminIds } = requestData;
      const message = `Employee deletion requested: "${name}" by ${requestedBy}. Reason: ${reason}`;
      
      // Notify admins
      for (const adminId of adminIds) {
        await saveAndEmitNotification(adminId, message, 'employee-d-requested', NotificationType.EMPLOYEE_DELETION_REQUEST);
      }
    } catch (error) {
      console.error('Error in notifyEmployeeDeletionRequest:', error.message);
      throw error;
    }
  }

  async notifyEmployeeDeletionApproval(approvalData: {
    name: string;
    approvedBy: string;
    hrIds: string[];
  }) {
    try {
      const { name, approvedBy, hrIds } = approvalData;
      const message = `Employee deletion approved: "${name}" by ${approvedBy}`;
      
      // Notify hr team
      for (const hrId of hrIds) {
        await saveAndEmitNotification(hrId, message, 'employee-d-approved', NotificationType.EMPLOYEE_DELETION_APPROVED);
      }
    } catch (error) {
      console.error('Error in notifyEmployeeDeletionApproval:', error.message);
      throw error;
    }
  }

  async notifyEmployeeDeletionRejection(rejectionData: {
    name: string;
    rejectedBy: string;
    hrIds: string[];
  }) {
    try {
      const { name, rejectedBy, hrIds } = rejectionData;
      const message = `Book deletion rejected: "${name}" by ${rejectedBy}.`;
      
      // Notify hr team
      for (const hrId of hrIds) {
        await saveAndEmitNotification(hrId, message, 'employee-d-rejected', NotificationType.EMPLOYEE_DELETION_REJECTED);
      }
    } catch (error) {
      console.error('Error in notifyEmployeeDeletionRejection:', error.message);
      throw error;
    }
  }

  async notifyUpdateUniformRequest(data: {
    itemName: string;
    quantity: number;
    requestedBy: string;
    stockIds: string[];
  }) {
    try {
      const { itemName, quantity, requestedBy, stockIds } = data;
      const message = `New uniform update request: Iteam Name: ${itemName} Quantity: ${quantity} by ${requestedBy}`;

      // Notify stock team
      for (const stockId of stockIds) {
        await saveAndEmitNotification(stockId, message, 'uniform-update-request', NotificationType.UNIFORM_UPDATE_REQUEST);
      }
    } catch (error) {
      console.error('Error in notifyUpdateUniformRequest:', error.message);
      throw error;
    }
  }

  async notifyUpdateUniformApproval(data: {
    itemName: string;
    quantity: number;
    approvedBy: string;
    storeIds: string[];
  }) {
    try {
      const { itemName, quantity, approvedBy, storeIds } = data;
      const message = `Uniform update approved: Item Name: ${itemName} Quantity: ${quantity} by ${approvedBy}`;

      // Notify store team
      for (const storeId of storeIds) {
        await saveAndEmitNotification(storeId, message, 'uniform-update-approved', NotificationType.UNIFORM_UPDATE_APPROVED);
      }
    } catch (error) {
      console.error('Error in notifyUpdateUniformApproval:', error.message);
      throw error;
    }
  }

  async notifyUpdateUniformRejection(data: {
    itemName: string;
    quantity: number;
    rejectedBy: string;
    storeIds: string[];
  }) {
    try {
      const { itemName, quantity, rejectedBy, storeIds } = data;
      const message = `Uniform update rejected: Item Name: ${itemName} Quantity: ${quantity} by ${rejectedBy}`;

      // Notify store team
      for (const storeId of storeIds) {
        await saveAndEmitNotification(storeId, message, 'uniform-update-rejected', NotificationType.UNIFORM_UPDATE_REJECTED);
      }
    } catch (error) {
      console.error('Error in notifyUpdateUniformRejection:', error.message);
      throw error;
    }
  }

  async sendExpenseRequestEmail(data: {
    amount: number;
    description: string;
    requestedBy: string;
    adminEmails: string[];
    //financeEmails: string[];
  }) {
    return await sendExpenseRequestEmail(data);
  }

  async sendExpenseApprovalEmail(data: {
    amount: number;
    description: string;
    requestedBy: string;
    approvedBy: string;
    financeEmails: string[];
  }) {
    return await sendExpenseApprovalEmail(data);
  }

  async sendExpenseRejectionEmail(data: {
    amount: number;
    description: string;
    requestedBy: string;
    rejectedBy: string;
    financeEmails: string[];
  }) {
    return await sendExpenseRejectionEmail(data);
  }

  async sendBookDeletionRequestEmail(data: {
    bookTitle: string;
    requestedBy: string;
    reason: string;
    adminEmails: string[];
  }) {
    return await sendBookDeletionRequestEmail(data);
  }

  async sendBookDeletionApprovalEmail(data: {
    bookTitle: string;
    approvedBy: string;
    libraryEmails: string[];
  }) {
    return await sendBookDeletionApprovalEmail(data);
  }

  async sendBookDeletionRejectionEmail(data: {
    bookTitle: string;
    rejectedBy: string;
    libraryEmails: string[];
  }) {
    return await sendBookDeletionRejectionEmail(data);
  }

  async sendSupplierCreationEmail(data: {
    name: string;
    commodity: string;
    requestedBy: string;
    adminEmails: string[];
  }) {
    return await sendSupplierCreationEmail(data);
  }

  async sendSupplierApprovalEmail(data: {
    name: string;
    approvedBy: string;
    procurementEmails: string[];
  }) {
    return await sendSupplierApprovalEmail(data);
  }

  async sendSupplierRejectionEmail(data: {
    name: string;
    rejectedBy: string;
    procurementEmails: string[];
  }) {
    return await sendSupplierRejectionEmail(data);
  }

  async sendUniformPurchaseEmail(data: {
    studentId: string;
    name: string;
    faculty: string;
    level: string;
    uniformType: {
      itemName: string;
      quantity: number;
    }[];
    amountPaid: number;
    storeEmails: string[];
  }) {
    return await sendUniformPurchaseEmail(data);
  }

  async sendEmployeeCreationEmail(data: {
    name: string;
    department: string;
    occupation: string;
    nationality: string;
    netSalary: number;
    requestedBy: string;
    adminEmails: string[];
  }) {
    return await sendEmployeeCreationEmail(data);
  }

  async sendEmployeeApprovalEmail(data: {
    name: string;
    approvedBy: string;
    hrEmails: string[];
  }) {
    return await sendEmployeeApprovalEmail(data);
  }

  async sendEmployeeRejectionEmail(data: {
    name: string;
    rejectedBy: string;
    hrEmails: string[];
  }) {
    return await sendEmployeeRejectionEmail(data);
  }

  async sendEmployeeDeletionRequestEmail(data: {
    name: string;
    requestedBy: string;
    reason: string;
    adminEmails: string[];
  }) {
    return await sendEmployeeDeletionRequestEmail(data);
  }

  async sendEmployeeDeletionApprovalEmail(data: {
    name: string;
    approvedBy: string;
    hrEmails: string[];
  }) {
    return await sendEmployeeDeletionApprovalEmail(data);
  }

  async sendEmployeeDeletionRejectionEmail(data: {
    name: string;
    rejectedBy: string;
    hrEmails: string[];
  }) {
    return await sendEmployeeDeletionRejectionEmail(data);
  }

  async sendUpdateUniformRequestEmail(data: {
    itemName: string;
    quantity: number;
    requestedBy: string;
    adminEmails: string[];
  }) {
    return await sendUpdateUniformRequestEmail(data);
  }

  async sendUpdateUniformApprovalEmail(data: {
    itemName: string;
    quantity: number;
    approvedBy: string;
    stockEmails: string[];
  }) {
    return await sendUpdateUniformApprovalEmail(data);
  }

  async sendUpdateUniformRejectionEmail(data: {
    itemName: string;
    quantity: number;
    rejectedBy: string;
    stockEmails: string[];
  }) {
    return await sendUpdateUniformRejectionEmail(data);
  }

  async sendPasswordResetEmail(data: {
    email: string;
    resetToken: string;
    names: string;
  }){
    // Send password reset email
    await sendPasswordResetEmail(data);
  }

  async sendOTPEmail(data: {
    email: string;
    otp: string;
    firstName: string;
  }){
    // Send OTP email
    await sendOTPEmail(data);
  }

  async sendOTPviaSMS(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      const message = `Your otp code is: ${otp}`;
      // console.log(`Sending SMS to: ${phoneNumber}`);
      // console.log(`OTP message: Your otp code is: ${otp}`);

      if (!phoneNumber || !otp) {
        //throw new Error('Missing phone number or OTP');
        console.error('Missing phone number or OTP');
      }

      await sendSMS(phoneNumber, message);
      return true;
    } catch (error) {
      console.error('Error sending OTP via SMS:', error.message);
      //return false;
    }
  }
  
  async sendWelcomemessageViaSMS(phoneNumber: string, email: string, password: string, role: string, name: string): Promise<boolean> {
    try {
      const message = `Welcome to our platform, your account has been created successfully. Your credentials are: Email: ${email}, Password: ${password}, Role: ${role}, Name: ${name}, Phone Number: ${phoneNumber}`;
      if(!phoneNumber || !email || !password || !role || !name){
        console.error('Missing phone number or email or password or role or name');
      }

      await sendSMS(phoneNumber, message);
      return true;
    } catch (error) {
      console.error('Error sending Welcome message via SMS:', error.message);
      
    }
  }
}
