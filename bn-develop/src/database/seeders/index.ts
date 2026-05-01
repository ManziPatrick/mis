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
    console.log("Seeding stock...");
    await seedStock();
    console.log("Seeding expense requests...");
    await seedExpenseRequest();
    console.log("Seeding completed successfully!");
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
});
