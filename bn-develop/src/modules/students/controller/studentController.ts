import { Request, Response } from "express";
import { createStudent,getStudents } from "../repository/studentRepositories";

// Add a new student
export const addStudent = async (req:Request, res:Response) => {
  try {
    const { name, faculty, studentId } = req.body;
    if (!name ||!faculty) {
       res.status(400).json({
        message: "Name and faculty are required fields"
    });
    return;
}
    const student = await createStudent({name,faculty, studentId});
    res.status(201).json({mesage: "Student added successfully",student});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students
export const getAllStudent = async (req:Request, res:Response) => {
  try {
    const students = await getStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};