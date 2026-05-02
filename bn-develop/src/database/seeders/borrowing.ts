import { Borrowing } from "../model/borrowing";
import { LibraryTable } from "../model/libraryTable";
import { Transaction } from "../model/transaction";

export const seedBorrowing = async () => {
  const books = await LibraryTable.find();
  if (books.length === 0) {
    console.log("No books found for borrowing seeding.");
    return;
  }

  const students = ["STU001", "STU002", "STU003", "STU004", "STU005"];

  for (let i = 0; i < 20; i++) {
    const book = books[Math.floor(Math.random() * books.length)];
    const studentId = students[Math.floor(Math.random() * students.length)];
    const isReturned = Math.random() > 0.3;

    const borrowDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const borrowing = await Borrowing.create({
      bookId: book._id,
      studentId,
      borrowDate,
      dueDate,
      status: isReturned ? "returned" : "borrowed",
      returnDate: isReturned ? new Date(borrowDate.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined
    });

    // Log OUT transaction
    await Transaction.create({
      bookId: book._id,
      transactionType: "OUT",
      quantity: 1,
      previousQuantity: book.quantity,
      newQuantity: book.quantity - 1,
      takenBy: studentId,
      transactionSource: "library borrowing",
      date: borrowDate
    });

    if (isReturned) {
      // Log IN transaction
      await Transaction.create({
        bookId: book._id,
        transactionType: "IN",
        quantity: 1,
        previousQuantity: book.quantity - 1,
        newQuantity: book.quantity,
        takenBy: studentId,
        transactionSource: "library borrowing",
        date: borrowing.returnDate
      });
    } else {
        // Only update quantity if NOT returned
        book.quantity -= 1;
        await book.save();
    }
  }
  console.log("Library borrowing seeded");
};
