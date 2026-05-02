// src/modules/library/controller/libraryController.ts
import { Request, Response } from 'express';
import { createBook, getBooks, updateBook, getBookById, deleteBook, createDeletionRequest, getDeletionRequests, handleDeletionRequest, getDeletionRequestById } from '../repository/libraryRepository';
import { eventEmitter } from '../../notification/services/notificationService';
import { NotificationService } from '../../notification/services/notificationService';
import { UserService } from '../../user/services/userService';
interface ExtendedRequest extends Request {
    user: {
        id: string;
        role: string;
        firstName?: string;
        lastName?: string;
    };
}

export class LibraryController {
    private notificationService: NotificationService;
    private userService: UserService;
    private static isInitialized = false;

    constructor() {
        this.notificationService = new NotificationService();
        this.userService = new UserService();

        if (!LibraryController.isInitialized) {
            this.setupNotificationListeners();
            LibraryController.isInitialized = true;
        }
    }

    private async setupNotificationListeners() {
        // Listen for book deletion requests
        eventEmitter.on('book-deletion-requested', async (data: {
            bookId: string;
            bookTitle: string;
            requestedBy: string;
            reason: string;
        }) => {
            try {
                // Get admin users
                const adminUsers = await this.userService.getUsersByRole('admin');
                
                if (adminUsers.length === 0) {
                    console.log('No admin users found for notification');
                    return;
                }

                await this.notificationService.notifyBookDeletionRequest({
                    bookId: data.bookId,
                    bookTitle: data.bookTitle,
                    requestedBy: data.requestedBy,
                    reason: data.reason,
                    adminIds: adminUsers.map(user => user._id.toString())
                });

                // Send email notifications to admins
                const adminEmails = adminUsers.map(user => user.email).filter(Boolean);
                
                if (adminEmails.length > 0) {
                    await this.notificationService.sendBookDeletionRequestEmail({
                        bookTitle: data.bookTitle,
                        requestedBy: data.requestedBy,
                        reason: data.reason,
                        adminEmails
                    });
                }
            } catch (error) {
                console.error('Error in book-deletion-requested listener:', error);
            }
        });

        // Listen for book deletion approvals
        eventEmitter.on('book-deletion-approved', async (data: {
            bookId: string;
            bookTitle: string;
            approvedBy: string;
        }) => {
            try {
                // Get library users
                const libraryUsers = await this.userService.getUsersByRole('librarian');

                if (libraryUsers.length === 0) {
                    console.log('No librarian users found for notification');
                    return;
                }

                await this.notificationService.notifyBookDeletionApproval({
                    bookId: data.bookId,
                    bookTitle: data.bookTitle,
                    approvedBy: data.approvedBy,
                    libraryIds: libraryUsers.map(user => user._id.toString())
                });
                // Send email notifications to library users
                const libraryEmails = libraryUsers.map(user => user.email).filter(Boolean);
                
                if (libraryEmails.length > 0) {
                    await this.notificationService.sendBookDeletionApprovalEmail({
                        bookTitle: data.bookTitle,
                        approvedBy: data.approvedBy,
                        libraryEmails
                    });
                }

            } catch (error) {
                console.error('Error in book-deletion-approved listener:', error);
            }
        });

        // Listen for book deletion rejections
        eventEmitter.on('book-deletion-rejected', async (data: {
            bookId: string;
            bookTitle: string;
            rejectedBy: string;
        }) => {
            try {
                // Get library users
                const libraryUsers = await this.userService.getUsersByRole('librarian');

                if (libraryUsers.length === 0) {
                    console.log('No librarian users found for notification');
                    return;
                }

                await this.notificationService.notifyBookDeletionRejection({
                    bookId: data.bookId,
                    bookTitle: data.bookTitle,
                    rejectedBy: data.rejectedBy,
                    libraryIds: libraryUsers.map(user => user._id.toString())
                });

                // Send email notifications to library users
                const libraryEmails = libraryUsers.map(user => user.email).filter(Boolean);
                
                if (libraryEmails.length > 0) {
                    await this.notificationService.sendBookDeletionRejectionEmail({
                        bookTitle: data.bookTitle,
                        rejectedBy: data.rejectedBy,
                        libraryEmails
                    });
                }
            } catch (error) {
                console.error('Error in book-deletion-rejected listener:', error);
            }
        });
    }
}

// Create a single instance
const libraryController = new LibraryController();

export const createBookController = async (req: ExtendedRequest, res: Response) => {
    try {
        const { isbn, book_name, quantity, author, shelf_number } = req.body;
        if (!isbn || !book_name || !quantity || !author || !shelf_number) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        // Check if book with ISBN already exists
        const existingBooks = await getBooks();
        const existingBook = existingBooks.find(book => book.isbn === isbn);
        if (existingBook) {
            res.status(400).json({ message: 'A book with this ISBN already exists' });
            return;
        }
        const newBook = await createBook({ isbn, book_name, quantity, author, shelf_number });
        res.status(201).json(newBook);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

export const getBooksController = async (req: Request, res: Response) => {
    try {
        const books = await getBooks();
        if (!books || books.length === 0) {
            res.status(404).json({ message: 'No books found' });
            return;
        }
        res.status(200).json(books);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

export const getBookByIdController = async (req: Request, res: Response) => {
    try {
        const book = await getBookById(req.params.id as string);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json(book);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

export const updateBookController = async (req: Request, res: Response) => {
    try {
        const book = await updateBook(req.params.id as string, req.body);
        res.status(200).json(book);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

export const requestBookDeletion = async (req: ExtendedRequest, res: Response) => {
    try {
        const bookId = req.params.id;
        const book = await getBookById(bookId as string);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }

        if(book.request_status === 'Pending'){
            res.status(400).json({ message: 'Deletion request is already pending' });
            return;
        }

        const userId = req.user.id; // Assuming you have user info in request
        const { reason } = req.body;
        if (!reason) {
            res.status(400).json({ message: 'Deletion reason is required' });
            return;
        }

        const deletionRequest = await createDeletionRequest(bookId as string, reason, userId);
        // Emit book deletion request event
        eventEmitter.emit('book-deletion-requested', {
            bookId: bookId,
            bookTitle: book.book_name,
            requestedBy: `${req.user.firstName} ${req.user.lastName}`,
            reason: reason
        });
        res.status(201).json(deletionRequest);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

export const getDeletionRequestsController = async (req: Request, res: Response) => {
    try {
        const requests = await getDeletionRequests();
        if (!requests || requests.length === 0) {
            res.status(404).json({ message: 'No pending deletion requests found' });
            return;
        }
        res.status(200).json(requests);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

export const getDeletionRequestByIdController = async (req: Request, res: Response) => {
    try {
        const request = await getDeletionRequestById(req.params.id as string);
        if (!request) {
            res.status(404).json({ message: 'No pending deletion requests found' });
            return;
        }
        res.status(200).json(request);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
}

export const handleDeletionRequestController = async (req: ExtendedRequest, res: Response) => {
    try {
        const { status, rejectionReason } = req.body;
        const bookId = req.params.id;
        const adminId = req.user.id;

        // Get the deletion request first
        const deletionRequest = await getDeletionRequestById(bookId as string);
        if (!deletionRequest) {
            res.status(404).json({ message: 'Deletion request not found' });
            return;
        }
        if (!status || !['Approved', 'Rejected'].includes(status)) {
            res.status(400).json({ message: 'Invalid status' });
            return
        }
        if (status === 'Rejected' && !rejectionReason) {
            res.status(400).json({ message: 'Rejection reason is required' });
            return;
        }

        const updatedBook = await handleDeletionRequest(bookId as string, status, adminId, rejectionReason);
        const approverName = req.user.firstName && req.user.lastName ? 
            `${req.user.firstName} ${req.user.lastName}` : 
            req.user.id;

        if (status === 'Approved') {
            eventEmitter.emit('book-deletion-approved', {
                bookId: bookId,
                bookTitle: updatedBook.book_name,
                approvedBy: approverName,
                libraryIds: [deletionRequest.deleted_by]
            });
        } else if (status === 'Rejected') {
            eventEmitter.emit('book-deletion-rejected', {
                bookId: bookId,
                bookTitle: updatedBook.book_name,
                rejectedBy: approverName,
                libraryIds: [deletionRequest.deleted_by]
            });
        }
        res.status(200).json(updatedBook);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

export const deleteBookController = async (req: Request, res: Response) => {
    try {
        const book = await getBookById(req.params.id as string);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        if(book.request_status !== 'Approved'){
            res.status(400).json({ message: 'Book deletion is not approved' });
            return;
        }
        await deleteBook(req.params.id as string)
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getBorrowingsController = async (req: Request, res: Response) => {
    try {
        const borrowings = await getBorrowings();
        res.status(200).json(borrowings);
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const borrowBookController = async (req: ExtendedRequest, res: Response) => {
    try {
        const { id } = req.params; // bookId
        const { studentId, dueDate } = req.body;

        const book = await getBookById(id as string);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }

        if (book.quantity <= 0) {
            res.status(400).json({ message: 'Book is out of stock' });
            return;
        }

        const borrowing = await Borrowing.create({
            bookId: id,
            studentId,
            borrowDate: new Date(),
            dueDate: new Date(dueDate),
            status: 'borrowed'
        });

        // Update book quantity
        book.quantity -= 1;
        await book.save();

        // Log transaction
        const transaction = new Transaction({
            bookId: id,
            transactionType: "OUT",
            quantity: 1,
            previousQuantity: book.quantity + 1,
            newQuantity: book.quantity,
            takenBy: studentId,
            transactionSource: "library borrowing",
        });
        await transaction.save();

        res.status(201).json({ message: 'Book borrowed successfully', borrowing, transaction });
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const returnBookController = async (req: ExtendedRequest, res: Response) => {
    try {
        const { id } = req.params; // borrowingId
        const borrowing = await Borrowing.findById(id as string);
        if (!borrowing) {
            res.status(404).json({ message: 'Borrowing record not found' });
            return;
        }

        if (borrowing.status === 'returned') {
            res.status(400).json({ message: 'Book already returned' });
            return;
        }

        const book = await getBookById(borrowing.bookId.toString());
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }

        borrowing.status = 'returned';
        borrowing.returnDate = new Date();
        await borrowing.save();

        // Update book quantity
        book.quantity += 1;
        await book.save();

        // Log transaction
        const transaction = new Transaction({
            bookId: book._id,
            transactionType: "IN",
            quantity: 1,
            previousQuantity: book.quantity - 1,
            newQuantity: book.quantity,
            takenBy: borrowing.studentId,
            transactionSource: "library borrowing",
        });
        await transaction.save();

        res.status(200).json({ message: 'Book returned successfully', borrowing, transaction });
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

import { Borrowing } from '../../../database/model/borrowing';
import { Transaction } from '../../../database/model/transaction';
import { getBorrowings } from '../repository/libraryRepository';
