// src/modules/finance/controller/financeController.ts
import { Request, Response } from "express";
import {
  getExpenseRequests,
  createExpenseRequest,
  getExpenseRequestById,
  deleteExpenseRequest,
  getPaymentVouchers,
  getPaymentVoucherById,
  deletePaymentVoucher,
  createUniformPayment,
  addPettyCashEntry,
  getLatestPettyCashBalance,
  createReceivedMoney,
  getReceivedMoney,
  getReceivedMoneyById,
  deleteReceivedMoney,
  getPettyCashEntries,
  getPettyCashEntryById,
  createPayroll,
  getPayroll,
} from "../repository/financeRepository";
import {
  generatePaymentVoucher,
  uploadSignedVoucher,
} from "../services/paymentVoucher";
import { getUserById, getUsersByRole, IRole } from "../../user/repository";
import { ExpenseRequest } from "../../../database/model/expenseRequest";
import { PaymentVoucher } from "../../../database/model/paymentVoucher";
import { NotificationService } from "../../notification/services/notificationService";
import { eventEmitter } from "../../notification/services/notificationService";
import { UserService } from "../../user/services/userService";
import { ReceivedMoney } from "../../../database/model/receivedMoney";
import { uploadFile } from "../../../utils";
import { PettyCash } from "../../../database/model/pettyCash";
import { FinanceService } from "../service/financeService";
import { Payment } from "../../../database/model/payment";
import { Stock } from "../../../database/model/stock";
import { Assets } from "../../../database/model/assets";
import { Supplier } from "../../../database/model/supplier";
import { ISupplier } from "../../../utils/types";
import { Employee } from "../../../database/model/employee";
import { Payroll } from "../../../database/model/payroll";
import moment from "moment";
import mongoose from "mongoose";
import { ExpenseHistory } from "../../../database/model/expenseHistory";
import { Uniform } from "../../../database/model/uniformStock";
import { Supply } from "../../../database/model/supply";
import { PersonalRequest } from "../../../database/model/personalRequest";

interface ExtendedRequest extends Request {
  user: {
    id: string;
    role: string;
    firstName?: string;
    lastName?: string;
};
}

export class FinanceController {
  private notificationService: NotificationService;
  private userService: UserService;
  private static isInitialized = false;

  constructor() {
    this.notificationService = new NotificationService();
    this.userService = new UserService();

    if (!FinanceController.isInitialized) {
      this.setupNotificationListeners();
      FinanceController.isInitialized = true;
    }
  }

  private async setupNotificationListeners() {
    // Listen for new expense requests
    eventEmitter.on(
      "expense-request-created",
      async (data: {
        amount: number;
        description: string;
        requestedBy: string;
        requesterId: string;
      }) => {
        let adminUsers, financeUsers;
        try {
          // Get admin and finance users
          adminUsers = await this.userService.getUsersByRole("admin");
          financeUsers = await this.userService.getUsersByRole("finance");

          const adminEmails = adminUsers
            .map((user) => user.email)
            .filter(Boolean);
          const financeEmails = financeUsers
            .map((user) => user.email)
            .filter(Boolean);

          if (adminEmails.length === 0 && financeEmails.length === 0) {
            console.log("No recipients found for notification");
            return;
          }

          // Send in-app notifications
          await this.notificationService.notifyExpenseRequest({
            amount: data.amount,
            description: data.description,
            requestedBy: data.requestedBy,
            adminIds: adminUsers.map((user) => user._id.toString()),
            //financeIds: financeUsers.map((user) => user._id.toString()),
          });

          // Send email notifications
          await this.notificationService.sendExpenseRequestEmail({
            amount: data.amount,
            description: data.description,
            requestedBy: data.requestedBy,
            adminEmails,
            //financeEmails,
          });
        } catch (error) {
          console.error("Error handling expense request notification:", error);
          console.log("Admin users:", adminUsers);
          //console.log("Finance users:", financeUsers);
        }
      }
    );

    // Listen for expense approvals
    eventEmitter.on(
      "expense-request-approved",
      async (data: {
        expenseId: string;
        amount: number;
        description: string;
        requestedBy: string;
        approvedBy: string;
        approvedById: string;
      }) => {
        try {
          // Get finance users
          const financeUsers = await this.userService.getUsersByRole("finance");

          // Send in-app notifications
          await this.notificationService.notifyExpenseApproval({
            expenseId: data.expenseId,
            amount: data.amount,
            description: data.description,
            requestedBy: data.requestedBy,
            approvedBy: data.approvedBy,
            financeIds: financeUsers.map((user) => user._id.toString()),
          });

          // Send email notifications
          await this.notificationService.sendExpenseApprovalEmail({
            amount: data.amount,
            description: data.description,
            requestedBy: data.requestedBy,
            approvedBy: data.approvedBy,
            financeEmails: financeUsers.map((user) => user.email),
          });
        } catch (error) {
          console.error("Error handling expense approval notification:", error);
        }
      }
    );

    // Listen for expense rejections
    eventEmitter.on(
      "expense-request-rejected",
      async (data: {
        expenseId: string;
        amount: number;
        description: string;
        requestedBy: string;
        rejectedBy: string;
        rejectedById: string;
      }) => {
        try {
          // Get finance users
          const financeUsers = await this.userService.getUsersByRole("finance");

          // Send in-app notifications
          await this.notificationService.notifyExpenseRejection({
            expenseId: data.expenseId,
            amount: data.amount,
            description: data.description,
            requestedBy: data.requestedBy,
            rejectedBy: data.rejectedBy,
            financeIds: financeUsers.map((user) => user._id.toString()),
          });

          // Send email notifications
          await this.notificationService.sendExpenseRejectionEmail({
            amount: data.amount,
            description: data.description,
            requestedBy: data.requestedBy,
            rejectedBy: data.rejectedBy,
            financeEmails: financeUsers.map((user) => user.email),
          });
        } catch (error) {
          console.error(
            "Error handling expense rejection notification:",
            error
          );
        }
      }
    );

    // Listen for uniform purchase requests
    eventEmitter.on(
      "uniform-purchase-request",
      async (data: {
        studentId: string;
        name: string;
        faculty: string;
        level: string;
        uniformType?: {
          itemName: string;
          quantity: number;
        }[];
        amountPaid: number;
        fullUniform?: "yes" | "no";
      }) => {
        try {
          // get stoke users
          const storeUsers = await this.userService.getUsersByRole("stock");

          // send in-app notifications
          await this.notificationService.notifyUniformPurchase({
            studentId: data.studentId,
            name: data.name,
            faculty: data.faculty,
            level: data.level,
            uniformType: data.uniformType || null,
            amountPaid: data.amountPaid,
            fullUniform: data.fullUniform ? "Full uniform" : "Partial uniform",
            storeIds: storeUsers.map((user) => user._id.toString()),
          });

          // send email notifications
          await this.notificationService.sendUniformPurchaseEmail({
            studentId: data.studentId,
            name: data.name,
            faculty: data.faculty,
            level: data.level,
            uniformType: data.uniformType,
            amountPaid: data.amountPaid,
            storeEmails: storeUsers.map((user) => user.email),
          });
        } catch (error) {
          console.error("Error handling uniform purchase notification:", error);
        }
      }
    );
  }

  async addToPettyCash(
    transactionType: "expense" | "income",
    amount: number,
    description: string,
    referenceModel: "ReceivedMoney" | "ExpenseRequest"
  ) {
    try {
      const currentBalance = await getLatestPettyCashBalance();

      // Calculate new balance
      const newBalance =
        transactionType === "income"
          ? currentBalance + amount
          : currentBalance - amount;

      // Create new petty cash entry
      const pettyCashEntry = await addPettyCashEntry({
        transaction_type: transactionType,
        amount_paid: transactionType === "expense" ? amount : 0,
        amount_received: transactionType === "income" ? amount : 0,
        amount_balance: newBalance,
        description,
        reference_model: referenceModel,
      });

      return pettyCashEntry;
    } catch (error) {
      throw new Error(`Failed to add petty cash entry: ${error.message}`);
    }
  }

  async addReceivedMoney(req: Request, res: Response) {
    try {
      const receivedMoney = new ReceivedMoney(req.body);
      await receivedMoney.save();

      // Add to petty cash if it's marked for petty cash
      if (req.body.addToPettyCash) {
        await this.addToPettyCash(
          "income",
          Number(receivedMoney.amount),
          `Received money: ${receivedMoney.reason}`,
          "ReceivedMoney"
        );
      }

      res.status(201).json(receivedMoney);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async approveExpenseRequest(req: Request, res: Response) {
    try {
      const expenseRequest = await ExpenseRequest.findById(req.params.id as string);
      if (!expenseRequest) {
        return res.status(404).json({ message: "Expense request not found" });
      }

      expenseRequest.status = "Approved";
      await expenseRequest.save();

      // Add to petty cash when expense is approved
      await this.addToPettyCash(
        "expense",
        Number(expenseRequest.total_amount_to_be_paid),
        `Expense: ${expenseRequest.requested_for}`,
        "ExpenseRequest"
      );

      res.json(expenseRequest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const getExpenseRequestsController = async (
  req: Request,
  res: Response
) => {
  try {
    const expenseRequests = await getExpenseRequests();
    if (!expenseRequests || expenseRequests.length === 0) {
      res.status(404).json({ message: "No expense requests found" });
      return;
    }

    // Populate the user references with required fields
    // await ExpenseRequest.populate(expenseRequests, [
    //     {
    //         path: 'prepared_by',
    //         select: 'firstName lastName email'
    //     },
    //     {
    //         path: 'approved_by',
    //         select: 'firstName lastName email'
    //     }
    // ]);

    res.status(200).json(expenseRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense requests", error });
  }
};

export const createExpenseRequestController = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    let {
      requested_for,
      total_amount_paid,
      expected_payment_date,
      payment_mode,
      payment_account,
      reason,
      employeeId,
      supplierId,
      description,
      selectedSupplies, // List of supply IDs
    } = req.body;

    if (!payment_mode || !payment_account || !reason || !description) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (!expected_payment_date) {
      res.status(400).json({ message: "Expected payment date is required" });
      return;
    }

    const user = await getUserById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const latestBalance = await getLatestPettyCashBalance();
    if (latestBalance < total_amount_paid) {
      res.status(400).json({ message: "Insufficient balance in petty cash" });
      return;
    }

    let expenseRequest;
    let beneficiary;
    let remainingBalance = 0;
    let relatedRequestId = null;
    let idNumber;
    let phoneNumber;

    if (requested_for === "supplier") {
      if (!supplierId) {
        res
          .status(400)
          .json({ message: "Supplier ID is required for supplier-related expenses" });
        return;
      }

      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        res.status(404).json({ message: "Supplier not found" });
        return;
      }

      if (supplier.status === "pending") {
        res.status(400).json({ message: "Supplier is not approved yet by admin" });
        return;
      }

      beneficiary = supplier.name;

      // Validate and retrieve selected supplies
      if (!selectedSupplies || !Array.isArray(selectedSupplies) || selectedSupplies.length === 0) {
        res
          .status(400)
          .json({ message: "You must select at least one supply for payment" });
        return;
      }

      const unpaidOrAdvanceSupplies = await Supply.find({
        _id: { $in: selectedSupplies },
        supplierId,
        status: { $in: ["Unpaid", "advance-payment"] },
      });

      if (unpaidOrAdvanceSupplies.length !== selectedSupplies.length) {
        res
          .status(400)
          .json({ message: "Some selected supplies are invalid or not eligible for payment" });
        return;
      }

      // Calculate total cost and remaining balance
      const totalSupplyCost = unpaidOrAdvanceSupplies.reduce(
        (sum, supply) => sum + (supply.remainingBalance || supply.totalCost),
        0
      );

      if (total_amount_paid > totalSupplyCost) {
        res
          .status(400)
          .json({ message: "Amount paid exceeds total supply cost" });
        return;
      }

      remainingBalance = totalSupplyCost - total_amount_paid;

      const unpaidSupplies = await Supply.find({
        _id: { $in: selectedSupplies },
        supplierId: supplierId,
        status: "advance-payment",
        remainingBalance: { $gt: 0 }, // Still has unpaid balance
      });
      
      if (unpaidSupplies.length > 0) {
        const unpaidSupplyIds = unpaidSupplies.map((supply) => supply._id);
      
        const previousExpenseRequest = await ExpenseRequest.findOne({
          supplierId: supplierId,
          selectedSupplies: { $in: unpaidSupplyIds }, // Ensure it relates to unpaid supplies
        });
      
        if (previousExpenseRequest) {
          console.log("Found a related previous expense request:", previousExpenseRequest._id);
          relatedRequestId = previousExpenseRequest._id;
        }
      }

      req.body.total_amount_to_be_paid = totalSupplyCost;
    } else if (requested_for === "employee") {
      if (!employeeId) {
        res
          .status(400)
          .json({ message: "Employee ID is required for employee-related expenses" });
        return;
      }

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        res.status(404).json({ message: "Employee not found" });
        return;
      }

      if(reason.toLowerCase() === 'advance payment'){
        if(employee.netSalary < total_amount_paid){
          res.status(400).json({ message: "Amount paid exceeds employee's net salary" });
          return;
        }
      }
      if(employee.type === "staff" && employee.transportAllowence > 0){
        if(reason === "transportation" && total_amount_paid > employee.transportAllowence){
          res.status(400).json({message: "Transport exceed employee's allowance"})
          return;
        }
      }
      if(employee.type === "non-staff" && reason === "salary"){
        if(employee.netSalary < total_amount_paid){
          res.status(400).json({ message: "Amount paid exceeds employee's net salary" });
          return;
        }
      }

      req.body.total_amount_to_be_paid = total_amount_paid;
    } else if (requested_for === "other") {
      if(!req.body.idNumber || !req.body.phoneNumber){
        res.status(400).json({message: "ID Number and Phone Number are required"})
        return;
      }
      beneficiary = req.body.beneficiary;
      idNumber = req.body.idNumber;
      phoneNumber = req.body.phoneNumber;
      req.body.total_amount_to_be_paid = total_amount_paid;
    } else {
      res.status(400).json({ message: "Invalid requested_for value" });
      return;
    }

    expenseRequest = await createExpenseRequest({
      ...req.body,
      status: "Pending",
      date: new Date(),
      total_remaining_balance: remainingBalance,
      prepared_by: req.user.id,
      preparer_details: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
      beneficiary,
      idNumber,
      phoneNumber,
      selectedSupplies,
      relatedRequestId
    });

    eventEmitter.emit("expense-request-created", {
      amount: req.body.total_amount_to_be_paid,
      description: requested_for,
      requestedBy: `${user.firstName} ${user.lastName}`,
      requesterId: req.user.id,
    });

    res.status(201).json(expenseRequest);
  } catch (error) {
    res.status(500).json({ message: "Error creating expense request", error });
  }
};

const updateExpenseHistory = (request, amount, userId, reason) => {
  const totalPaid =
    request.total_remaining_balance === 0
      ? amount
      : request.total_amount_paid + amount;
  request.expenseHistory.push({
    paymentAmount: amount,
    date: new Date(),
    paidBy: userId,
    remainingBalance: request.total_amount_to_be_paid - totalPaid,
    notes: `Paid ${amount} towards ${request.requested_for}`,
  });
  request.total_amount_paid = totalPaid;
  request.total_remaining_balance = request.total_amount_to_be_paid - totalPaid;
  request.status = "Pending";
  request.reason = reason;
};

export const getExpenseRequestByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const expenseRequest = await getExpenseRequestById(req.params.id as string);
    if (!expenseRequest) {
      res.status(404).json({ message: "Expense request not found" });
      return;
    }

    // Populate the user references with required fields
    // await ExpenseRequest.populate(expenseRequest, [
    //     {
    //         path: 'prepared_by',
    //         select: 'firstName lastName email'
    //     },
    //     {
    //         path: 'approved_by',
    //         select: 'firstName lastName email'
    //     }
    // ]);

    res.status(200).json(expenseRequest);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense request", error });
  }
};

export const deleteExpenseRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const expenseRequest = await deleteExpenseRequest(req.params.id as string);
    if (!expenseRequest) {
      res.status(404).json({ message: "Expense request not found" });
      return;
    }
    res.status(200).json({ message: "Expense request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense request", error });
  }
};

// Create a single instance
const financeController = new FinanceController();

export const updateExpenseRequestController = async (
  req: ExtendedRequest,
  res: Response
) => {
  const session = await mongoose.startSession(); // Start a transaction session
  session.startTransaction();
  
  try {
    const { id } = req.params;
    const adminId = await getUserById(req.user.id);
    if (!adminId) {
      res.status(404).json({ message: "User not found" });
      return 
    }

    const expenseRequest = await getExpenseRequestById(id as string, { session });

    if (!expenseRequest) {
      res.status(404).json({ message: "Expense request not found" });
      return 
    }

    const { status, rejectionReason } = req.body;

    if (!status || !["Approved", "Rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return 
    }

    if (status === "Rejected" && !rejectionReason) {
      res.status(400).json({
        message: "Rejection reason is required when rejecting an expense request",
      });
      return;
    }

    if (expenseRequest.requested_for === "supplier") {
      let { selectedSupplies, total_amount_paid, relatedRequestId } = expenseRequest;

      const unpaidSupplies = await Supply.find({
        _id: { $in: selectedSupplies },
        supplierId: expenseRequest.supplierId,
        status: { $in: ["Unpaid", "advance-payment"] },
      }).session(session);

      for (const supply of unpaidSupplies) {
        const remainingForThisSupply =
          (supply.remainingBalance || supply.totalCost) -
          Math.min(supply.remainingBalance || supply.totalCost, total_amount_paid);

        const updatedStatus =
          remainingForThisSupply === 0 ? "fully-paid" : "advance-payment";
          total_amount_paid -= Math.min(supply.remainingBalance || supply.totalCost, total_amount_paid);

        await Supply.findByIdAndUpdate(
          supply._id as any,
          {
            status: updatedStatus,
            remainingBalance: remainingForThisSupply,
          },
          { session }
        );
      }
      if (relatedRequestId) {
        const previousRequest = await ExpenseRequest.findById(relatedRequestId as any).session(session);
        if (previousRequest) {
          previousRequest.total_remaining_balance -= total_amount_paid;
          await previousRequest.save({ session });
        }
      }
    }


    // Preserve the history before modifying
    const previousState = {
      approved_by: expenseRequest.approved_by,
      total_amount_paid: expenseRequest.total_amount_paid,
      total_remaining_balance: expenseRequest.total_remaining_balance,
    };

    // Update status and approver
    expenseRequest.status = status;
    if (status === "Rejected") {
      expenseRequest.rejection_reason = rejectionReason;
    }
    expenseRequest.approved_by = adminId.id;
    await expenseRequest.save({ session });

    // Record expense history
    const expenseHistoryRecord = new ExpenseHistory({
      expenseRequestId: expenseRequest._id,
      previousState,
      updatedBy: adminId,
      updatedAt: new Date(),
    });
    await expenseHistoryRecord.save({ session });

    let payeeName = "";
    let totalAmountToBePaid = 0;

    if (expenseRequest.employeeId) {
      const employee = await Employee.findById(expenseRequest.employeeId as any);
      if (employee) {
        payeeName = employee.name;
        totalAmountToBePaid = employee.netSalary;
      }
    } else if (expenseRequest.supplierId) {
      const supplier = await Supplier.findById(expenseRequest.supplierId as any);
      if (supplier) {
        payeeName = supplier.name;
      }
    } else {
      payeeName = expenseRequest.beneficiary;
    }

    // Create or update payment record
    const payment = new Payment({
      payeeType: expenseRequest.employeeId
        ? "Employee"
        : expenseRequest.supplierId
        ? "Supplier"
        : "Other",
      payeeId:
        expenseRequest.employeeId?._id ||
        expenseRequest.supplierId?._id ||
        expenseRequest._id,
      payeeName,
      description: expenseRequest.description,
      amountPaid: Number(expenseRequest.total_amount_paid),
      totalAmount: Number(expenseRequest.total_amount_to_be_paid),
      remainingBalance: Number(expenseRequest.total_remaining_balance),
      referenceId: expenseRequest._id,
      reason: expenseRequest.reason,
      status:
        Number(expenseRequest.total_remaining_balance) === 0
          ? "Paid"
          : Number(expenseRequest.total_remaining_balance) > 0
          ? "Pending"
          : "Overpaid",
      paymentDate: expenseRequest.date,
    });
    await payment.save({ session });

    // Add to petty cash if approved
    if (status === "Approved") {
      try {
        await financeController.addToPettyCash(
          "expense",
          Number(expenseRequest.total_amount_paid),
          `Expense: ${expenseRequest.requested_for}`,
          "ExpenseRequest"
        );
      } catch (error) {
        console.error("Failed to add to petty cash:", error);
      }
    }

    // Generate payment voucher
    let paymentVoucher;
    if (status === "Approved") {
      paymentVoucher = await generatePaymentVoucher(expenseRequest, req.user);
    }

    // Emit event for notifications
    if (status === "Approved") {
      eventEmitter.emit("expense-request-approved", {
        expenseId: id,
        amount: expenseRequest.total_amount_paid,
        description: expenseRequest.requested_for,
        requestedBy: expenseRequest.preparer_details?.name || "Unknown User",
        approvedBy: `${req.user.firstName} ${req.user.lastName}`,
        approvedById: adminId,
      });
    }
    if (status === "Rejected") {
      eventEmitter.emit("expense-request-rejected", {
        expenseId: id,
        amount: expenseRequest.total_amount_paid,
        description: expenseRequest.requested_for,
        requestedBy: expenseRequest.preparer_details?.name || "Unknown User",
        rejectedBy: `${req.user.firstName} ${req.user.lastName}`,
        rejectedById: adminId,
      });
    }

    await session.commitTransaction(); // Commit the transaction
    session.endSession(); // End session **only once**

    res.status(200).json({
      message:`Expense request ${status} successfully`,
      ...(paymentVoucher && { paymentVoucher }),
      payment
    });
  } catch (error: any) {
    console.error("Error updating expense request:", error);

    // Only abort if session is still active
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession(); // End session in catch block **only once**

    res.status(500).json({
      message: "Error updating expense request",
      error: error.message,
    });
  }
};


export const getPaymentVouchersController = async (
  req: Request,
  res: Response
) => {
  try {
    const paymentVouchers = await getPaymentVouchers();
    if (!paymentVouchers || paymentVouchers.length === 0) {
      res.status(404).json({ message: "No payment vouchers found" });
      return;
    }
    await PaymentVoucher.populate(paymentVouchers, [
      {
        path: "prepared_by",
        select: "firstName lastName email",
      },
      {
        path: "approved_by",
        select: "firstName lastName email",
      },
      {
        path: "uploaded_by",
        select: "firstName lastName email",
      },
    ]);
    res.status(200).json(paymentVouchers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment vouchers", error });
  }
};

export const getPaymentVoucherByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Try to find by payment voucher ID first
    let paymentVoucher = await getPaymentVoucherById(id as string);

    // If not found, try to find by expense request ID
    if (!paymentVoucher) {
      paymentVoucher = await PaymentVoucher.findOne({ expense_request_id: id as any });
    }

    if (!paymentVoucher) {
      res.status(404).json({ message: "Payment voucher not found" });
      return;
    }

    await PaymentVoucher.populate(paymentVoucher, [
      {
        path: "prepared_by",
        select: "firstName lastName email",
      },
      {
        path: "approved_by",
        select: "firstName lastName email",
      },
      {
        path: "uploaded_by",
        select: "firstName lastName email",
      },
      {
        path: "expense_request_id",
        select: "requested_for total_amount_to_be_paid date beneficiary",
      },
    ]);

    res.status(200).json(paymentVoucher);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment voucher", error });
  }
};

export const deletePaymentVoucherController = async (
  req: Request,
  res: Response
) => {
  try {
    const paymentVoucher = await deletePaymentVoucher(req.params.id as string);
    if (!paymentVoucher) {
      res.status(404).json({ message: "Payment voucher not found" });
      return;
    }
    res.status(200).json({ message: "Payment voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment voucher", error });
  }
};

export const uploadSignedVoucherDocument = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  try {
    const { voucherId } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const updatedVoucher = await uploadSignedVoucher(voucherId as string, file, req.user);

    res.status(200).json({
      message: "Signed voucher uploaded successfully",
      paymentVoucher: updatedVoucher,
    });
  } catch (error) {
    console.error("Upload signed voucher error:", error);
    res.status(500).json({ message: "Failed to upload signed voucher" });
  }
};

export const createReceivedMoneyController = async (
  req: ExtendedRequest,
  res: Response
) => {
  const financeController = new FinanceController();
  try {
    const { date, amount, received_from, reason, account } = req.body;

    const userId = req.user?.id;

    if (!date || !amount || !received_from || !reason || !account) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Get first admin user
    const approvers = await getUsersByRole("admin");
    if (!approvers || approvers.length === 0) {
      res.status(404).json({ message: "No admin approver found" });
      return;
    }
    const approver = approvers[0]; // Get first admin

    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const uploadResult = await uploadFile(file);
    const receivedMoney = await createReceivedMoney({
      date,
      amount,
      received_from,
      reason,
      received_by: userId,
      approved_by: approver._id.toString(),
      signed_document: uploadResult.file.url,
      account,
    });

    // Add to petty cash if account is Petty Cash
    if (account === "Petty Cash") {
      try {
        //console.log('Adding to petty cash...');
        await financeController.addToPettyCash(
          "income",
          Number(receivedMoney.amount),
          `Received money: ${receivedMoney.reason}`,
          "ReceivedMoney"
        );
        //console.log('Successfully added to petty cash');
      } catch (error) {
        console.error("Failed to add to petty cash:", error);
      }
    }

    res
      .status(201)
      .json({ message: "Received money created successfully", receivedMoney });
  } catch (error) {
    //console.error('Error in createReceivedMoneyController:', error);
    res.status(500).json({ message: "Error creating received money", error });
  }
};

export const getReceivedMoneyController = async (
  req: Request,
  res: Response
) => {
  try {
    const receivedMoney = await getReceivedMoney();
    if (!receivedMoney || receivedMoney.length === 0) {
      res.status(404).json({ message: "No received money found" });
      return;
    }
    await ReceivedMoney.populate(receivedMoney, [
      {
        path: "received_by",
        select: "firstName lastName email",
      },
      {
        path: "approved_by",
        select: "firstName lastName email",
      },
    ]);
    res
      .status(200)
      .json({ message: "Received money fetched successfully", receivedMoney });
  } catch (error) {
    res.status(500).json({ message: "Error fetching received money", error });
  }
};

export const getReceivedMoneyByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const receivedMoney = await getReceivedMoneyById(req.params.id as string);
    if (!receivedMoney) {
      res.status(404).json({ message: "Received money not found" });
      return;
    }
    await ReceivedMoney.populate(receivedMoney, [
      {
        path: "received_by",
        select: "firstName lastName email",
      },
      {
        path: "approved_by",
        select: "firstName lastName email",
      },
    ]);
    res
      .status(200)
      .json({ message: "Received money fetched successfully", receivedMoney });
  } catch (error) {
    res.status(500).json({ message: "Error fetching received money", error });
  }
};

export const deleteReceivedMoneyController = async (
  req: Request,
  res: Response
) => {
  try {
    const receivedMoney = await deleteReceivedMoney(req.params.id as string);
    if (!receivedMoney) {
      res.status(404).json({ message: "Received money not found" });
      return;
    }
    res.status(200).json({ message: "Received money deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting received money", error });
  }
};

export const getPettyCashEntriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const pettyCashEntries = await getPettyCashEntries();
    if (!pettyCashEntries || pettyCashEntries.length === 0) {
      res.status(404).json({ message: "No petty cash entries found" });
      return;
    }
    await PettyCash.populate(pettyCashEntries, [
      {
        path: "reference_id",
        select: "reason",
      },
    ]);
    res.status(200).json(pettyCashEntries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching petty cash entries", error });
  }
};

export const getPettyCashEntryByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const pettyCashEntry = await getPettyCashEntryById(req.params.id as string);
    if (!pettyCashEntry) {
      res.status(404).json({ message: "Petty cash entry not found" });
      return;
    }
    await PettyCash.populate(pettyCashEntry, [
      {
        path: "reference_id",
        select: "reason",
      },
    ]);
    res.status(200).json(pettyCashEntry);
  } catch (error) {
    res.status(500).json({ message: "Error fetching petty cash entry", error });
  }
};

export const createPayUniformController = async (
  req: Request,
  res: Response
) => {
  const financeController = new FinanceController();

  try {
    const {
      studentId,
      name,
      faculty,
      level, // This will now handle multiple items for partial uniforms
      amountPaid,
      modeOfPayment,
      fullUniform,
      numberOfFullUniforms,
    } = req.body;
    const itemNames = Array.isArray(req.body.itemName)
      ? req.body.itemName
      : [req.body.itemName];
    const quantity = Array.isArray(req.body.quantity)
      ? req.body.quantity
      : [req.body.quantity];
    const formattedUniformType = itemNames.map(
      (itemName: string, index: number) => ({
        itemName: itemName.toLowerCase(),
        quantity: quantity[index],
      })
    );
    const proofOfPayment = req.file;
    const uniformType = formattedUniformType.map((item) => ({
      itemName: item.itemName.toLowerCase(),
      quantity: item.quantity,
    }));

    if (!proofOfPayment) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    if (
      !studentId ||
      !name ||
      !faculty ||
      !level ||
      !amountPaid ||
      !modeOfPayment ||
      !fullUniform
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const uploadResult = await uploadFile(proofOfPayment);
    if (!uploadResult || !uploadResult.file || !uploadResult.file.url) {
      res.status(500).json({ message: "Failed to upload proof of payment" });
      return;
    }

    // Check uniform stock availability only if fullUniform is false
    if (fullUniform === false) {
      // Loop through uniformType items to check stock for each item
      for (let { itemName, quantity } of formattedUniformType) {
        const uniformStock = await Uniform.findOne({
          itemPrices: { $elemMatch: { itemName: itemName.toLowerCase() } },
        });

        if (!uniformStock) {
          res
            .status(400)
            .json({ message: `Item ${itemName} not found in stock` });
          return;
        }

        const item = uniformStock.itemPrices.find(
          (item) => item.itemName.toLowerCase() === itemName.toLowerCase()
        );

        if (!item || uniformStock.quantity < quantity) {
          res
            .status(400)
            .json({ message: `Insufficient stock for ${itemName}` });
          return;
        }
      }
    }

    // Prepare uniform payment data
    const uniformPaymentData: any = {
      studentId,
      name,
      faculty,
      level,
      uniformType,
      amountPaid,
      modeOfPayment,
      proofOfPaymentUrl: uploadResult.file.url,
      fullUniform,
      numberOfFullUniforms,
    };

    // Add uniformType data for partial uniforms
    if (fullUniform === false) {
      uniformPaymentData.uniformType = formattedUniformType.map((item) => ({
        itemName: item.itemName.toLowerCase(),
        quantity: item.quantity,
      }));
    }

    // Create the uniform payment
    const uniformPayment = await createUniformPayment(uniformPaymentData);

    // Add payment to petty cash if mode of payment is "petty cash"
    if (modeOfPayment.toLowerCase() === "petty cash") {
      try {
        await financeController.addToPettyCash(
          "income",
          Number(amountPaid),
          `Uniform payment from ${name} - ${formattedUniformType
            .map((item) => item.itemName)
            .join(", ")}`,
          "ReceivedMoney"
        );
      } catch (error) {
        console.error("Failed to add uniform payment to petty cash:", error);
      }
    }

    // Emit event for uniform purchase request
    eventEmitter.emit("uniform-purchase-request", {
      studentId,
      name,
      faculty,
      level,
      amountPaid,
      ...(fullUniform === false && { formattedUniformType }), // Include uniformType if partial uniform
    });

    // Update uniform stock if fullUniform is false
    if (fullUniform === false) {
      for (let { itemName, quantity } of formattedUniformType) {
        await Uniform.updateOne(
          { item: itemName.toLowerCase() },
          { $inc: { quantity: -quantity } }
        );
      }
    }

    res.status(201).json({
      message: "Uniform payment created successfully",
      uniformPayment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error processing uniform payment:", error);
  }
};

export const getUniformItemsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { item } = req.query; // Get item from query params

    if (!item) {
      res.status(400).json({ message: "Item is required" });
      return;
    }

    // Check if item is a string
    if (typeof item !== "string") {
      res.status(400).json({ message: "Invalid item type" });
      return;
    }

    // Search for the uniform either by general item or by itemName in itemPrices
    const uniform = await Uniform.findOne({
      $or: [
        { item: { $regex: new RegExp(item, "i") } }, // Search by general item name
        { "itemPrices.itemName": { $regex: new RegExp(item, "i") } }, // Search within itemPrices for itemName
      ],
    })
      .populate("category", "-__v")
      .populate("supplierId", "-__v");

    if (!uniform) {
      res.status(404).json({ message: "Uniform not found" });
      return;
    }

    // Return the whole uniform document
    res.status(200).json(uniform);
  } catch (error) {
    console.error("Error retrieving uniform items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generatePayrollForAll = async () => {
  const employees = await Employee.find({});
  let payrolls = [];
  let message: string;

  const currentMonth = moment().month() + 1; // Get current month (1-12)
  const currentYear = moment().year(); // Get current year

  for (const employee of employees) {
    let totalAdvancePaid = 0;
    let remainingSalary = 0;
    let status = "Pending";

    // Check if payroll already exists for the current month and year
    const existingPayroll = await Payroll.findOne({
      employeeId: employee._id,
      month: currentMonth,
      year: currentYear,
    });

    if (employee.type === "non-staff") {
      const salaryPayments = await Payment.find({
        payeeType: "Employee",
        payeeId: new mongoose.Types.ObjectId(employee._id),
        reason: "salary",
        paymentDate: {
          $gte: moment().startOf("month").toDate(),
          $lte: moment().endOf("month").toDate(),
        },
      });

      const totalSalaryPaid = salaryPayments.reduce(
        (sum, payment) => sum + payment.amountPaid,
        0
      );

      if (totalSalaryPaid === employee.netSalary) {
        status = "Paid";
      } else if (totalSalaryPaid > employee.netSalary) {
        status = "Overpaid";
      } else {
        remainingSalary = employee.netSalary - totalSalaryPaid;
        status = "Pending";
      }
    }

    // Get ALL advance payments for the current month
    const advancePayments = await Payment.find({
      payeeType: "Employee",
      payeeId: new mongoose.Types.ObjectId(employee._id),
      reason: "advance payment",
      paymentDate: {
        $gte: moment().startOf("month").toDate(),
        $lte: moment().endOf("month").toDate(),
      },
    });

    if (!status || status === "Pending") {
      if (advancePayments.length > 0) {
        totalAdvancePaid = advancePayments.reduce(
          (sum, payment) => sum + payment.amountPaid,
          0
        );

        remainingSalary = employee.netSalary - totalAdvancePaid;

        status = remainingSalary === 0
          ? "Paid"
          : remainingSalary < 0
          ? "Overpaid"
          : "Pending";
      } else {
        remainingSalary = employee.netSalary;
      }
    }

    const payrollData = {
      advance: totalAdvancePaid,
      remainingAmount: remainingSalary > 0 ? remainingSalary : 0,
      status,
    };

    if (existingPayroll) {
      // If payroll exists for the same month and year, update it
      const updatedPayroll = await Payroll.findByIdAndUpdate(
        existingPayroll._id,
        payrollData,
        { new: true }
      );

      payrolls.push(updatedPayroll);
      console.log(`Payroll updated for ${employee.name} (Month: ${currentMonth}, Year: ${currentYear})`);
      message = `Payroll updated for ${employee.name} (Month: ${currentMonth}, Year: ${currentYear})`;
    } else {
      // Create a new payroll for the current month and year
      const payroll = await Payroll.create({
        employeeId: employee._id,
        name: employee.name,
        netSalary: employee.netSalary,
        month: currentMonth,
        year: currentYear,
        ...payrollData,
        date: new Date(),
      });

      payrolls.push(payroll);
      console.log(`Payroll created for ${employee.name} (Month: ${currentMonth}, Year: ${currentYear})`);
      message = `Payroll created for ${employee.name} (Month: ${currentMonth}, Year: ${currentYear})`;
    }
  }
  return { payrolls, message };
};


export const generatePayrollManualy = async (req: Request, res: Response) => {
  try {
    const payroll = await generatePayrollForAll();
    res.status(200).json({ message: "Payroll generated successfully", payroll });
  } catch (error) {
    res.status(500).json({ message: "Error creating payroll", error });
  }
};
export const getPayrollController = async (req: Request, res: Response) => {
  try {
    const payroll = await getPayroll();
    if (!payroll || payroll.length === 0) {
      res.status(404).json({ message: "No payroll found" });
      return;
    }
    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPayrollByMonthAndYearController = async (req: Request, res: Response) => {
  try {
    let { month, year } = req.query;

    if (!month && !year) {
      res.status(400).json({ message: "Month or year is required" });
      return 
    }

    const query: any = {};

    if (month) {
      const monthNum = Number(month);
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        res.status(400).json({ message: "Invalid month. Must be between 1 and 12." });
        return 
      }
      query.month = monthNum;
    }

    if (year) {
      const yearNum = Number(year);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
        res.status(400).json({ message: "Invalid year. Must be a valid 4-digit year." });
        return 
      }
      query.year = yearNum;
    }

    const payrolls = await Payroll.find(query).sort({ date: -1 }).lean();

    if (payrolls.length === 0) {
      res.status(404).json({ message: "No payrolls found for the given month/year." });
      return 
    }

    res.status(200).json({ payrolls, count: payrolls.length });
  } catch (error) {
    console.error("Error fetching payrolls:", error.message);
    res.status(500).json({ message: "Error fetching payrolls", error: error.message });
  }
};


export const getPaymentsByReferenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const { referenceType, referenceId } = req.query;

    const payments = await Payment.find({
      referenceType,
      referenceId,
    }).sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

// export const createStockPaymentController = async (req: Request, res: Response) => {
//     try {
//         const { stockId, amountPaid, proofOfPayment } = req.body;

//         // Populate supplier details
//         const stock = await Stock.findById(stockId).populate<{supplierId: ISupplier}>('supplierId', 'name');
//         if (!stock) {
//             return res.status(404).json({ message: 'Stock not found' });
//         }

//         let proofOfPaymentUrl = '';
//         if (proofOfPayment) {
//             const uploadResult = await uploadFile(proofOfPayment);
//             proofOfPaymentUrl = uploadResult.file.url;
//         }

//         const payment = new Payment({
//             payeeType: 'Supplier',
//             payeeId: stock.supplierId._id,
//             payeeName: stock.supplierId.name,
//             amountPaid,
//             totalAmount: stock.totalAmount,
//             remainingBalance: stock.totalAmount - amountPaid,
//             proofOfPaymentUrl,
//             referenceId: stock._id,
//         });

//         await payment.save();

//         // Update stock payment status
//         stock.amountPaid = (stock.amountPaid || 0) + amountPaid;
//         stock.remainingBalance = stock.totalAmount - stock.amountPaid;
//         stock.paymentStatus = stock.remainingBalance === 0 ? 'Paid' : 'Partial';
//         await stock.save();

//         res.status(201).json({
//             message: "Stock payment created successfully",
//             payment,
//             stock
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error creating stock payment',
//             error: error.message
//         });
//     }
// };

export const getAllPaymentsController = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({});
    if (!payments || payments.length === 0) {
      res.status(404).json({ message: "No payments found" });
      return;
    }
    await Payment.populate(payments, [
      {
        path: "referenceId",
        select: "reason",
      },
    ]);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

export const getPaymentByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching payment",
      error: error.message,
    });
  }
};

export const processApprovedPersonalRequestController = async (
  req: ExtendedRequest,
  res: Response
) => {
  const session = await mongoose.startSession(); // Start a transaction session
  session.startTransaction();

  try {
    const { id } = req.params;

    const personalRequest = await PersonalRequest.findById(id).session(session).populate('prepared_by');

    if (!personalRequest) {
      res.status(404).json({ message: "Personal request not found" });
      return;
    }

    if (personalRequest.status !== "Approved") {
      res.status(400).json({ message: "Personal request is not approved" });
      return;
    }

    // Check if payment already exists for this personal request
    const existingPayment = await Payment.findOne({ 
      referenceId: personalRequest._id 
    }).session(session);

    if (existingPayment) {
      res.status(400).json({ 
        message: "This personal request has already been processed",
        payment: existingPayment
      });
      return;
    }

    const { payment_mode, payment_account } = req.body;

    const latestBalance = await getLatestPettyCashBalance();
    if ( payment_account === "Petty Cash" && latestBalance < personalRequest.amount) {
      res.status(400).json({ message: "Insufficient balance in petty cash" });
      return;
    }

    // Preserve the history before modifying
    // const previousState = {
    //   approved_by: personalRequest.approved_by,
    //   amount: personalRequest.amount,
    // };

    // Update payment details
    personalRequest.payment_mode = payment_mode;
    personalRequest.payment_account = payment_account;
    personalRequest.processed = true;
    personalRequest.processedAt = new Date();
    await personalRequest.save({ session });

    // Create or update payment record
    const payment = new Payment({
      payeeType: "User",
      payeeId: personalRequest.prepared_by,
      payeeName: req.user.firstName + " " + req.user.lastName,
      description: personalRequest.request_description,
      amountPaid: Number(personalRequest.amount),
      totalAmount: Number(personalRequest.amount),
      remainingBalance: 0,
      referenceId: personalRequest._id,
      reason: "full-payment",
      status: "Paid",
      paymentDate: new Date(),
    });
    await payment.save({ session });

    // Remove money from petty cash if payment account is Petty Cash
    if (payment_account === "Petty Cash") {
      try {
        await financeController.addToPettyCash(
          "expense",
          Number(personalRequest.amount),
          `Personal Request: ${personalRequest.reason}`,
          "ExpenseRequest"
        );
      } catch (error) {
        console.error("Failed to remove from petty cash:", error);
      }
    }

    // Generate payment voucher
    let paymentVoucher;
    paymentVoucher = await generatePaymentVoucher(personalRequest, req.user);

    await session.commitTransaction(); // Commit the transaction
    session.endSession(); // End session **only once**

    res.status(200).json({
      message: `Personal request processed successfully`,
      ...(paymentVoucher && { paymentVoucher }),
      payment,
    });
  } catch (error: any) {
    console.error("Error processing personal request:", error);

    // Only abort if session is still active
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession(); // End session in catch block **only once**

    res.status(500).json({
      message: "Error processing personal request",
      error: error.message,
    });
  }
};