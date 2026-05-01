import { Payroll } from "../model/payroll";
import { Employee } from "../model/employee";

export const seedPayroll = async () => {
  const employees = await Employee.find();

  if (employees.length === 0) {
    console.log("No employees found. Please seed employees first.");
    return;
  }

  const payrolls = employees.map((employee) => {
    const netSalary = 500000 + Math.floor(Math.random() * 500000);
    const advance = Math.floor(Math.random() * 50000);
    return {
      employeeId: employee._id,
      name: employee.name,
      netSalary: netSalary,
      date: new Date(),
      advance: advance,
      remainingAmount: netSalary - advance,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      status: "Pending",
    };
  });

  for (const payrollData of payrolls) {
    const existing = await Payroll.findOne({
      employeeId: payrollData.employeeId,
      month: payrollData.month,
      year: payrollData.year,
    });
    if (!existing) {
      await Payroll.create(payrollData);
      console.log(`Payroll for ${payrollData.name} seeded`);
    }
  }
};
