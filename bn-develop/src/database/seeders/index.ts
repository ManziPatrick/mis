// src/database/seeders/index.ts
import { seedUsers } from "./user";
import { seedRoles } from "./roles";
import { seedCategory } from "./category";
import { seedStock } from "./stock";
import { seedExpenseRequest } from "./expenseRequest";
import { seedFaculty } from "./faculty";
import { seedStudents } from "./student";
import { seedSuppliers } from "./supplier";
import { seedEmployees } from "./employee";
import { seedLibrary } from "./library";
import { seedTransactions } from "./transaction";
import { seedPayroll } from "./payroll";
import { seedPettyCash } from "./pettyCash";
import { seedUniform } from "./uniform";
import { seedBorrowing } from "./borrowing";
import { seedAssetAssignment } from "./assetAssignment";
import { connectDB } from "../config";

connectDB()
  .then(async () => {
    console.log("Seeding roles...");
    await seedRoles();

    console.log("Seeding categories...");
    await seedCategory();

    console.log("Seeding faculties...");
    await seedFaculty();

    console.log("Seeding suppliers...");
    await seedSuppliers();

    console.log("Seeding employees...");
    await seedEmployees();

    console.log("Seeding users...");
    await seedUsers();

    console.log("Seeding students...");
    await seedStudents();

    console.log("Seeding library...");
    await seedLibrary();

    console.log("Seeding uniform stock...");
    await seedUniform();

    console.log("Seeding borrowing...");
    await seedBorrowing();

    console.log("Seeding stock and assets...");
    await seedStock();

    console.log("Seeding asset assignments...");
    await seedAssetAssignment();

    console.log("Seeding transactions...");
    await seedTransactions();

    console.log("Seeding expense requests...");
    await seedExpenseRequest();

    console.log("Seeding payroll...");
    await seedPayroll();

    console.log("Seeding petty cash...");
    await seedPettyCash();

    console.log("Seeding completed successfully!");
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
});
