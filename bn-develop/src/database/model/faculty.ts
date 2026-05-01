import mongoose from "mongoose";
import { IFaculty } from "../../utils/types";

const facultyScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
});

export const Faculty = mongoose.model<IFaculty>("Faculty", facultyScheme);