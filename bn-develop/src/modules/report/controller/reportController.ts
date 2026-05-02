import { Request, Response } from "express";
import { Stock } from "../../../database/model/stock"; // Adjust path as necessary
import { Transaction } from "../../../database/model/transaction";
import { ExpenseRequest } from "../../../database/model/expenseRequest";
import { LibraryTable } from "../../../database/model/libraryTable";
import { Supplier } from "../../../database/model/supplier";
import { Employee } from "../../../database/model/employee";
import { PettyCash } from "../../../database/model/pettyCash";

const getYearMonthsDaysDateRanges = (year?: number) => {
  const targetYear = year || new Date().getFullYear();
  const months = [];
  const days = [];

  for (let month = 0; month < 12; month++) {
    const firstDay = new Date(Date.UTC(targetYear, month, 1, 0, 0, 0));
    const lastDay = new Date(Date.UTC(targetYear, month + 1, 0, 23, 59, 59));

    months.push({
      firstDay,
      lastDay,
      monthName: new Date(targetYear, month).toLocaleString('default', { month: 'long' }),
      year: targetYear,
    });

    for (let day = 1; day <= lastDay.getUTCDate(); day++) {
      const dayStart = new Date(Date.UTC(targetYear, month, day, 0, 0, 0));
      const dayEnd = new Date(Date.UTC(targetYear, month, day, 23, 59, 59));
      days.push({
        date: dayStart.toISOString().split('T')[0], // Format YYYY-MM-DD
        dayStart,
        dayEnd,
        month: new Date(targetYear, month).toLocaleString('default', { month: 'long' }),
        year: targetYear,
      });
    }
  }

  return { months, days };
};

const getYearWeeksDateRanges = (year?: number) => {
  const targetYear = year || new Date().getFullYear();
  const weeks = [];
  let date = new Date(Date.UTC(targetYear, 0, 1));
  
  while (date.getFullYear() === targetYear) {
    const firstDay = new Date(date);
    const lastDay = new Date(date);
    lastDay.setDate(lastDay.getDate() + 6);
    weeks.push({ 
      firstDay, 
      lastDay,
      weekNumber: Math.ceil((date.getTime() - new Date(targetYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1,
      year: targetYear
    });
    date.setDate(date.getDate() + 7);
  }
  return weeks;
};

// 1. Stock Summary Report (Overview of stock items)
export const stockSummaryReport = async (req: Request, res: Response) => {
  try {
    const stockItems = await Stock.find().populate('category supplierId');
    const report = stockItems.map(item => ({
      itemName: item.item,
      category: item.category.name,
      quantity: item.quantity,
      supplier: item?.supplierId?.name,
      totalValue: item.quantity * item.unityPrice, 
    }));

    res.status(200).json(report);
  } catch (error:any) {
    console.error("Error generating total stock value report:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 2. Low Stock Report (Items with quantity below a threshold)
export const lowStockReport = async (req: Request, res: Response) => {
  const minimumThreshold = 10; // Set your threshold (could be dynamic)
  
  try {
    const lowStockItems = await Stock.find({ quantity: { $lt: minimumThreshold } })
                                      .populate('category supplierId');
    
    if (lowStockItems.length === 0) {
        res.status(200).json([]);
      return ;
    }

    const report = lowStockItems.map(item => ({
      itemName: item.item,
      category: item.category.name,
      quantity: item.quantity,
      supplier: item?.supplierId?.name,
    }));

    res.status(200).json(report);
  } catch (error:any) {
    console.error("Error generating low stock report:", error);
    res.status(500).json({ message: "Internal server error", error:error.message });
  }
};

// 3. Stock Movement Report (Items with movements in/out)
export const stockMovementReport = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  try {
    const transactions = await Transaction.find({
      transactionDate: { $gte: startDate, $lte: endDate },
    }).populate('stockId');

    if (transactions.length === 0) {
        res.status(200).json([]);
        return ;
    }

    const report = transactions.map(txn => ({
      stockItem: txn?.stockId?.item,
      transactionType: txn.transactionType,
      quantity: txn.quantity,
      transactionDate: txn.date,
      transactionSource: txn.transactionSource,
      previousQuantity: txn.previousQuantity
    }));

    res.status(200).json(report);
  } catch (error:any) {
    console.error("Error generating total stock value report:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 4. Total Value of Stock (Total value based on unit price and quantity)
export const totalStockValueReport = async (req: Request, res: Response) => {
  try {
    const stockItems = await Stock.find();
    const totalValue = stockItems.reduce((acc, item) => {
      return acc + item.quantity * item.unityPrice;
    }, 0);

    res.status(200).json({ totalStockValue: totalValue });
  } catch (error:any) {
    console.error("Error generating total stock value report:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 5. Pending Approval requests
export const getPendingApprovalsReport = async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
    const previousYear = year - 1;

    // Get date ranges
    const { months: currentYearMonths, days: currentYearDays } = getYearMonthsDaysDateRanges(year);
    const { months: previousYearMonths } = getYearMonthsDaysDateRanges(previousYear);

    // Parallel execution for overall pending approvals
    const [FinancePendingApprovals, LibraryPendingApprovals, SupplierPendingApprovals, EmployeePendingApprovals] = await Promise.all([
      ExpenseRequest.find({ status: "Pending" }, "createdAt"),
      LibraryTable.find({ status: "Pending" }, "createdAt"),
      Supplier.find({ status: "pending" }, "createdAt"),
      Employee.find({ status: "pending" }, "createdAt"),
    ]);

    // Function to get monthly reports using aggregation for all models
    const getMonthlyReport = async (model: any, statusField: string, year: number) => {
      return model.aggregate([
        {
          $match: {
            [statusField]: { $in: ["Pending", "pending"] },
            createdAt: { $gte: new Date(`${year}-01-01T00:00:00Z`), $lt: new Date(`${year + 1}-01-01T00:00:00Z`) },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            totalRequests: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
    };

    // Fetch current & previous year reports for all models in parallel
    const [
      currentFinanceReports,
      currentLibraryReports,
      currentSupplierReports,
      currentEmployeeReports,
      previousFinanceReports,
      previousLibraryReports,
      previousSupplierReports,
      previousEmployeeReports,
    ] = await Promise.all([
      getMonthlyReport(ExpenseRequest, "status", year),
      getMonthlyReport(LibraryTable, "status", year),
      getMonthlyReport(Supplier, "status", year),
      getMonthlyReport(Employee, "status", year),
      getMonthlyReport(ExpenseRequest, "status", previousYear),
      getMonthlyReport(LibraryTable, "status", previousYear),
      getMonthlyReport(Supplier, "status", previousYear),
      getMonthlyReport(Employee, "status", previousYear),
    ]);

    // Fetch daily reports using parallel execution for all models
    const dailyReports = await Promise.all(
      currentYearDays.map(async (day) => {
        const [dailyFinance, dailyLibrary, dailySupplier, dailyEmployee] = await Promise.all([
          ExpenseRequest.find({ status: "Pending", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
          LibraryTable.find({ status: "Pending", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
          Supplier.find({ status: "pending", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
          Employee.find({ status: "pending", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
        ]);

        return {
          date: day.date,
          month: day.month,
          year: day.year,
          totalFinanceRequests: dailyFinance.length,
          totalLibraryRequests: dailyLibrary.length,
          totalSupplierRequests: dailySupplier.length,
          totalEmployeeRequests: dailyEmployee.length,
        };
      })
    );

    const report = {
      overall: {
        finance: FinancePendingApprovals.length,
        library: LibraryPendingApprovals.length,
        supplier: SupplierPendingApprovals.length,
        employee: EmployeePendingApprovals.length,
      },
      currentYear: {
        year,
        monthlyReports: {
          finance: currentFinanceReports,
          library: currentLibraryReports,
          supplier: currentSupplierReports,
          employee: currentEmployeeReports,
        },
        dailyReports,
      },
      previousYear: {
        year: previousYear,
        monthlyReports: {
          finance: previousFinanceReports,
          library: previousLibraryReports,
          supplier: previousSupplierReports,
          employee: previousEmployeeReports,
        },
      },
    };

    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//6. Approved requests
export const getApprovedRequestsReport = async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
    const previousYear = year - 1;

    // Get date ranges
    const { months: currentYearMonths, days: currentYearDays } = getYearMonthsDaysDateRanges(year);
    const { months: previousYearMonths } = getYearMonthsDaysDateRanges(previousYear);

    // Parallel execution for overall pending approvals
    const [FinanceApprovedApprovals, LibraryApprovedApprovals, SupplierApprovedApprovals, EmployeeApprovedApprovals] = await Promise.all([
      ExpenseRequest.find({ status: "Approved" }, "createdAt"),
      LibraryTable.find({ status: "Approved" }, "createdAt"),
      Supplier.find({ status: "approved" }, "createdAt"),
      Employee.find({ status: "approved" }, "createdAt"),
    ]);

    // Function to get monthly reports using aggregation
    const getMonthlyReport = async (model: any, statusField: string, year: number) => {
      return model.aggregate([
        {
          $match: {
            [statusField]: { $in: ["Approved", "approved"] },
            createdAt: { $gte: new Date(`${year}-01-01T00:00:00Z`), $lt: new Date(`${year + 1}-01-01T00:00:00Z`) },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            totalRequests: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
    };

    // Fetch current & previous year reports for all models in parallel
    const [
      currentFinanceReports,
      currentLibraryReports,
      currentSupplierReports,
      currentEmployeeReports,
      previousFinanceReports,
      previousLibraryReports,
      previousSupplierReports,
      previousEmployeeReports,
    ] = await Promise.all([
      getMonthlyReport(ExpenseRequest, "status", year),
      getMonthlyReport(LibraryTable, "status", year),
      getMonthlyReport(Supplier, "status", year),
      getMonthlyReport(Employee, "status", year),
      getMonthlyReport(ExpenseRequest, "status", previousYear),
      getMonthlyReport(LibraryTable, "status", previousYear),
      getMonthlyReport(Supplier, "status", previousYear),
      getMonthlyReport(Employee, "status", previousYear),
    ]);


    // Fetch daily reports using parallel execution
    const dailyReports = await Promise.all(
      currentYearDays.map(async (day) => {
        const [dailyFinance, dailyLibrary, dailySupplier, dailyEmployee] = await Promise.all([
          ExpenseRequest.find({ status: "Approved", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
          LibraryTable.find({ status: "Approved", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
          Supplier.find({ status: "approved", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
          Employee.find({ status: "approved", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
        ]);

        return {
          date: day.date,
          month: day.month,
          year: day.year,
          totalFinanceRequests: dailyFinance.length,
          totalLibraryRequests: dailyLibrary.length,
          totalSupplierRequests: dailySupplier.length,
          totalEmployeeRequests: dailyEmployee.length,
        };
      })
    );

    const report = {
      overall: {
        finance: FinanceApprovedApprovals.length,
        library: LibraryApprovedApprovals.length,
        supplier: SupplierApprovedApprovals.length,
        employee: EmployeeApprovedApprovals.length,
      },
      currentYear: {
        year,
        monthlyReports: {
          finance: currentFinanceReports,
          library: currentLibraryReports,
          supplier: currentSupplierReports,
          employee: currentEmployeeReports,
        },
        dailyReports,
      },
      previousYear: {
        year: previousYear,
        monthlyReports: {
          finance: previousFinanceReports,
          library: previousLibraryReports,
          supplier: previousSupplierReports,
          employee: previousEmployeeReports,
        },
      },
    };

    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


//7. Rejected requests
export const getRejectedRequestsReport = async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
    const previousYear = year - 1;

    // Get date ranges
    const { months: currentYearMonths, days: currentYearDays } = getYearMonthsDaysDateRanges(year);
    const { months: previousYearMonths } = getYearMonthsDaysDateRanges(previousYear);

    // Parallel execution for overall pending approvals
    const [FinanceRejected, LibraryRejected, SupplierRejected, EmployeeRejected] = await Promise.all([
      ExpenseRequest.find({ status: "Rejected" }, "createdAt"),
      LibraryTable.find({ status: "Rejected" }, "createdAt"),
      Supplier.find({ status: "rejected" }, "createdAt"),
      Employee.find({ status: "rejected" }, "createdAt"),
    ]);

    // Function to get monthly reports using aggregation
    const getMonthlyReport = async (model: any, statusField: string, year: number) => {
      return model.aggregate([
        {
          $match: {
            [statusField]: { $in: ["Rejeted", "rejected"] },
            createdAt: { $gte: new Date(`${year}-01-01T00:00:00Z`), $lt: new Date(`${year + 1}-01-01T00:00:00Z`) },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            totalRequests: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
    };

    // Fetch current & previous year reports for all models in parallel
    const [
      currentFinanceReports,
      currentLibraryReports,
      currentSupplierReports,
      currentEmployeeReports,
      previousFinanceReports,
      previousLibraryReports,
      previousSupplierReports,
      previousEmployeeReports,
    ] = await Promise.all([
      getMonthlyReport(ExpenseRequest, "status", year),
      getMonthlyReport(LibraryTable, "status", year),
      getMonthlyReport(Supplier, "status", year),
      getMonthlyReport(Employee, "status", year),
      getMonthlyReport(ExpenseRequest, "status", previousYear),
      getMonthlyReport(LibraryTable, "status", previousYear),
      getMonthlyReport(Supplier, "status", previousYear),
      getMonthlyReport(Employee, "status", previousYear),
    ]);


    // Fetch daily reports using parallel execution
    const dailyReports = await Promise.all(
      currentYearDays.map(async (day) => {
        const [dailyFinance, dailyLibrary, dailySupplier, dailyEmployee] = await Promise.all([
          ExpenseRequest.find({ status: "Rejected", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
          LibraryTable.find({ status: "Rejected", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
          Supplier.find({ status: "rejected", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
          Employee.find({ status: "rejected", createdAt: { $gte: day.dayStart, $lt: new Date(day.dayEnd.getTime() + 1000) } }),
        ]);

        return {
          date: day.date,
          month: day.month,
          year: day.year,
          totalFinanceRequests: dailyFinance.length,
          totalLibraryRequests: dailyLibrary.length,
          totalSupplierRequests: dailySupplier.length,
          totalEmployeeRequests: dailyEmployee.length,
        };
      })
    );

    const report = {
      overall: {
        finance: FinanceRejected.length,
        library: LibraryRejected.length,
        supplier: SupplierRejected.length,
        employee: EmployeeRejected.length,
      },
      currentYear: {
        year,
        monthlyReports: {
          finance: currentFinanceReports,
          library: currentLibraryReports,
          supplier: currentSupplierReports,
          employee: currentEmployeeReports,
        },
        dailyReports,
      },
      previousYear: {
        year: previousYear,
        monthlyReports: {
          finance: previousFinanceReports,
          library: previousLibraryReports,
          supplier: previousSupplierReports,
          employee: previousEmployeeReports,
        },
      },
    };

    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

//8. Petty Cash Report
export const getPettyCashReport = async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
    const previousYear = year - 1;

    // Fetch all year date ranges
    const { months: currentYearMonths, days: currentYearDays } = getYearMonthsDaysDateRanges(year);
    const { months: previousYearMonths } = getYearMonthsDaysDateRanges(previousYear);

    // Helper function to get monthly reports using aggregation
    const getMonthlyReport = async (year: number) => {
      return PettyCash.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${year}-01-01T00:00:00Z`),
              $lt: new Date(`${year + 1}-01-01T00:00:00Z`),
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            totalExpense: { $sum: "$amount_paid" },
            totalIncome: { $sum: "$amount_received" },
            transactionCount: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
    };

    // Fetch current & previous year monthly reports in parallel
    const [currentYearReports, previousYearReports] = await Promise.all([
      getMonthlyReport(year),
      getMonthlyReport(previousYear),
    ]);

    // Fetch daily reports in parallel
    const dailyReports = await Promise.all(
      currentYearDays.map(async (day) => {
        const dailyPettyCash = await PettyCash.find({
          createdAt: {
            $gte: day.dayStart,
            $lt: new Date(day.dayEnd.getTime() + 1000),
          },
        });

        return {
          date: day.date,
          month: day.month,
          year: day.year,
          totalExpense: dailyPettyCash.reduce((acc, item) => acc + item.amount_paid, 0),
          totalIncome: dailyPettyCash.reduce((acc, item) => acc + item.amount_received, 0),
          transactionCount: dailyPettyCash.length,
        };
      })
    );

    // Fetch overall report with limited fields
    const allPettyCash = await PettyCash.find({}, "amount_paid amount_received amount_balance updatedAt").sort({
      updatedAt: -1,
    });

    const summaryReport = {
      overall: {
        totalExpense: allPettyCash.reduce((acc, item) => acc + item.amount_paid, 0),
        totalIncome: allPettyCash.reduce((acc, item) => acc + item.amount_received, 0),
        balance: allPettyCash.length ? allPettyCash[0].amount_balance : 0,
        lastUpdatedAt: allPettyCash.length ? allPettyCash[0].updatedAt : null,
      },
      currentYear: {
        year,
        monthlyReports: currentYearReports,
        dailyReports, // Include daily data
      },
      previousYear: {
        year: previousYear,
        monthlyReports: previousYearReports,
      },
    };

    res.status(200).json({ summaryReport });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
