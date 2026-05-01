import mongoose from 'mongoose';
import { IStudent } from '../../utils/types';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
    },
    faculty: {
        type: String,
        required: true
    }
},{
    timestamps: true,
})

export const Student = mongoose.model<IStudent>("Student", studentSchema);