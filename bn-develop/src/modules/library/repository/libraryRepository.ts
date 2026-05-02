// src/modules/library/repository/libraryRepository.ts
import { LibraryTable } from "../../../database/model/libraryTable";

interface IBook {
    isbn: string;
    book_name: string;
    quantity: number;
    author: string;
    shelf_number: string;
}

export const createBook = async (book: IBook) => {
    return await LibraryTable.create(book);
};

export const getBooks = async () => {
    return await LibraryTable.find().populate([
        {
            path: 'approved_by',
            select: 'firstName lastName email'
        },
        {
            path: 'deleted_by',
            select: 'firstName lastName email'
        }
    ]);
};

export const updateBook = async (id: string, book: IBook) => {
    return await LibraryTable.findByIdAndUpdate(id, book, { new: true });
};

export const getBookById = async (id: string) => {
    return ((await LibraryTable.findById(id).populate([
        {
            path: 'approved_by',
            select: 'firstName lastName email'
        },
        {
            path: 'deleted_by',
            select: 'firstName lastName email'
        }
    ])));
};

export const createDeletionRequest = async (bookId: string, reason: string, userId: string) => {
    return await LibraryTable.findByIdAndUpdate(
        bookId,
        {
            deleted_reason: reason,
            request_status: 'Pending',
            deleted_by: userId
        },
        { new: true }
    );
};

export const getDeletionRequests = async () => {
    return await LibraryTable.find({ 
        request_status: 'Pending'
    }).populate([
        {
            path: 'deleted_by',
            select: 'firstName lastName email'
        }
    ]);
};

export const getDeletionRequestById = async (id: string) => {
    return await LibraryTable.findOne({
        _id: id,
        request_status: 'Pending'
    }).populate([
        {
            path: 'deleted_by',
            select: 'firstName lastName email'
        }
    ]);
}

export const handleDeletionRequest = async (bookId: string, status: 'Approved' | 'Rejected', adminId: string, rejectionReason: string) => {
    const update: any = {
        request_status: status,
        rejection_reason: rejectionReason
    };

    if (status === 'Approved' || status === 'Rejected') {
        update.approved_by = adminId;
        update.approved_at = new Date();
    }

    return await LibraryTable.findByIdAndUpdate(
        bookId,
        update,
        { new: true }
    );
};

export const deleteBook = async (id: string) => {
    return await LibraryTable.findByIdAndDelete(id);
};

export const getBorrowings = async () => {
    return await Borrowing.find().populate('bookId');
};

import { Borrowing } from "../../../database/model/borrowing";
