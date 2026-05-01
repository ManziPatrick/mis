// hr repository
import { IEmployee } from "../../../utils/types";
import { Employee } from "../../../database/model/employee";

export const createEmployee = async (employee: IEmployee): Promise<IEmployee> => {
    return await Employee.create(employee);
}

export const getEmployees = async (): Promise<IEmployee[]> => {
    return await Employee.find();
}

export const getEmployeeById = async (id: string): Promise<IEmployee | null> => {
    return await Employee.findById(id);
}

export const updateEmployee = async (id: string, employee: Partial<IEmployee>): Promise<IEmployee | null> => {
    return await Employee.findByIdAndUpdate(id, employee, { new: true });
}

export const deleteEmployee = async (id: string): Promise<IEmployee | null> => {
    return await Employee.findByIdAndDelete(id);
}

export const getEmployeeByEmail = async (email: string): Promise<IEmployee | null> => {
    return await Employee.findOne({ email });
}

export const sendEmployeeDeleteRequest = async (id: string, delete_reason: string): Promise<IEmployee | null> => {
    return await Employee.findByIdAndUpdate(id, { delete_reason: delete_reason, delete_status: 'pending' }, { new: true });
}

export const handleDeleteRequest = async (id: string, delete_status: 'approved' | 'rejected', rejectedReason: string): Promise<IEmployee | null> => {
    return await Employee.findByIdAndUpdate(id, { delete_status, rejected_reason: rejectedReason }, { new: true });
}

export const getEmployeeDeleteRequests = async (): Promise<IEmployee[]> => {
    return await Employee.find({ delete_status: 'pending' });
}

export const getEmployeeDeleteRequestById = async (id: string): Promise<IEmployee | null> => {
    return await Employee.findOne({ _id: id, delete_status: 'pending' });
}
