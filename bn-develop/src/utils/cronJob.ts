import cron from "node-cron";
import { generatePayrollForAll } from "../modules/finance/controller/financeController";
import { findLowStockItems } from "../modules/stock/repository/stockRepositories";

// Schedule job to run at midnight on the first day of every month
cron.schedule("0 0 1 * *", async () => {
    try {
        console.log("Running monthly payroll generation...");
        await generatePayrollForAll();
        console.log("Monthly payroll generation completed.");
    } catch (error) {
        console.error("Error generating payroll:", error);
    }
});

cron.schedule("0 9 * * *", async () => {
    try {
        console.log("Checking for low stock items...");
        const lowStockItems = await findLowStockItems()
      if (lowStockItems.length > 0) {
        console.log("Low stock items detected:");
        lowStockItems.forEach((item) => {
          console.log(`- ${item.item}: ${item.quantity} remaining.`);
        });
  
        // Optional: Send email alerts
      } else {
        console.log("No low stock items detected.");
      }
    } catch (error) {
      console.error("Error checking low stock:", error);
    }
  })