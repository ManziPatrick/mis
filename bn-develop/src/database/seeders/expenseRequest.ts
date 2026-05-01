// src/database/seeders/expenseRequest.ts
import { ExpenseRequest } from '../model/expenseRequest';
import { User } from '../model/user';

export const seedExpenseRequest = async () => {
  const expenseRequests = await ExpenseRequest.find();
  if (expenseRequests.length > 0) return;

  const admin = await User.findOne({ email: 'genesistechnologies2024@gmail.com' });
  if (!admin) {
    throw new Error('Admin user not found. Please seed users first.');
  }

  const expenseRequest = {
    requested_for: "other",
    beneficiary: "Jane Doe",
    quantity: 1,
    total_amount_paid: 1000,
    total_amount_to_be_paid: 5000,
    total_remaining_balance: 4000,
    expected_payment_date: new Date(),
    payment_mode: "Cash",
    payment_account: "Petty Cash",
    prepared_by: admin._id,
    reason: "transportation",
    description: "Transport allowance for staff",
    status: "Pending",
    idNumber: "1234567890123456",
    phoneNumber: "0788000000"
  };

  await ExpenseRequest.create(expenseRequest);
  console.log("Expense request seeded");
};
