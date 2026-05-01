import mongoose, { Schema, Document } from "mongoose";

// Interface for Payroll
interface IPayroll extends Document {
  employeeId: mongoose.Types.ObjectId; // Reference to the payee (employee, staff, or non-staff)
  name: string; // Name of the payee
  netSalary: number; // Fixed salary for the payee
  date: Date; // Month for which payroll is generated
  advance: number; // Advance retrieved from payment table
  remainingAmount: number; // Net salary minus advance
  status: string; // Status of payment (Paid or Pending)
}

// Define Payroll Schema
const PayrollSchema: Schema = new Schema(
  {
    employeeId: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    name: { type: String, required: true },
    netSalary: { type: Number, required: true },
    date: { type: Date, required: true },
    advance: { type: Number, default: 0 },
    remainingAmount: { type: Number, required: true },
    month: { type: Number, required: true }, // New field for month
    year: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Overpaid"],
      default: "Pending",
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export Payroll Model
export const Payroll = mongoose.model<IPayroll>("Payroll", PayrollSchema);
