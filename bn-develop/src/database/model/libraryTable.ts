// src/database/model/libraryTable.ts
import mongoose from 'mongoose';

const libraryTableSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    book_name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    shelf_number: {
        type: String,
        required: true
    },
    deleted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    deleted_at: {
        type: Date,
        required: false
    },
    deleted_reason: {
        type: String,
        required: false
    },
    request_status: {
        type: String,
        required: false,
        enum: ['Pending', 'Approved', 'Rejected']
    },
    rejection_reason: {
        type: String
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    approved_at: {
        type: Date,
        required: false
    }

    
});

export const LibraryTable = mongoose.model('LibraryTable', libraryTableSchema);
