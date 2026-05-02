import mongoose from "mongoose";
import { IBorrowing } from "../../utils/types";

const borrowingSchema = new mongoose.Schema<IBorrowing>({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LibraryTable",
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["borrowed", "returned"],
    default: "borrowed",
  },
});

export const Borrowing = mongoose.model<IBorrowing>("Borrowing", borrowingSchema);
