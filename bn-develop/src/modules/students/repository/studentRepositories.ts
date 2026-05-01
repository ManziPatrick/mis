import { Student } from "../../../database/model/students";
import { IStudent } from "../../../utils/types";

export const createStudent = (student: Partial<IStudent>) =>{
    return Student.create(student);
}

export const getStudents = async () => {
    return Student.find();
}

export const getStudentById = async (id: string) => {
    return Student.findById(id);
}