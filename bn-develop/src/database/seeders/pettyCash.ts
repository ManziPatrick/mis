import { PettyCash } from "../model/pettyCash";
import { ReceivedMoney } from "../model/receivedMoney";
import { User } from "../model/user";

export const seedPettyCash = async () => {
  const admin = await User.findOne({ email: "admin@mis.com" });
  if (!admin) {
    console.log("Admin user not found. Please seed users first.");
    return;
  }

  // Seed Received Money
  const receivedData = [
    {
      date: new Date(),
      amount: 1000000,
      received_from: "Government Grant",
      reason: "Quarterly funding",
      received_by: admin._id,
      approved_by: admin._id,
      account: "Petty Cash",
    },
    {
      date: new Date(),
      amount: 50000,
      received_from: "Student Fees",
      reason: "Late registration fee",
      received_by: admin._id,
      approved_by: admin._id,
      account: "Petty Cash",
    },
  ];

  for (const data of receivedData) {
    const existing = await ReceivedMoney.findOne({ reason: data.reason });
    if (!existing) {
      const received = await ReceivedMoney.create(data);
      console.log(`Received money for ${data.reason} seeded`);

      // Also create a PettyCash entry for income
      await PettyCash.create({
        transaction_type: "income",
        amount_received: data.amount,
        description: data.reason,
        reference_model: "ReceivedMoney",
      });
    }
  }

  // Seed some expenses in PettyCash
  const expenses = [
    {
      transaction_type: "expense",
      amount_paid: 5000,
      description: "Office stationery",
      reference_model: "ExpenseRequest",
    },
    {
      transaction_type: "expense",
      amount_paid: 2000,
      description: "Taxi fare for staff",
      reference_model: "ExpenseRequest",
    },
  ];

  for (const expense of expenses) {
    const existing = await PettyCash.findOne({ description: expense.description });
    if (!existing) {
      await PettyCash.create(expense);
      console.log(`Petty cash expense for ${expense.description} seeded`);
    }
  }
};
