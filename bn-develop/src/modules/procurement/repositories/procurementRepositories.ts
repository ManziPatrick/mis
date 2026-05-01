// procurement controller
import { ISupplier } from "../../../utils/types";
import { Supplier } from "../../../database/model/supplier";

export const createSupplier = async (supplier: ISupplier) => {
    const newSupplier = await Supplier.create(supplier);
    return newSupplier.depopulate('__v');
};

export const getSupplier = async () => {
    return await Supplier.find().select("-__v");
};

export const getSupplierById = async (id: string) => {
    return await Supplier.findById({_id: id}).select("-__v");
};

export const updateSupplier = async (id: string, updateData: Partial<ISupplier>) => {
    const oldSupplier = await Supplier.findById(id).lean();
    const updatedSupplier = await Supplier.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
    ).select("-__v");
    
    const changes: Record<string, { from: any; to: any }> = {};
    for (const [key, value] of Object.entries(updateData)) {
        if (oldSupplier && oldSupplier[key as keyof ISupplier] !== value) {
            changes[key] = {
                from: oldSupplier[key as keyof ISupplier],
                to: value
            };
        }
    }
    
    return { supplier: updatedSupplier, changes };
};

export const deleteSupplier = async (id: string) => {
    return await Supplier.findByIdAndDelete(id).select("-__v");
};

export const requestDeleteSupplier = async (id: string, deleteReason: string,userId:string) => {
    return (await Supplier.findByIdAndUpdate(id, { deleteReason, status: "pending",deletedBy:userId }, { new: true }).select("-__v")).populate({
        path:"deletedBy",
        select:"firstName lastName email"
    });
};

export const handleDeleteRequest = async (id: string, status: 'approved' | 'rejected',adminId:string, rejectedReason: string) => {
    return await Supplier.findByIdAndUpdate(id, { status: status,approvedBy:adminId, rejected_reason: rejectedReason }, { new: true }).select("-__v -createdAt").populate({
        path:"approvedBy",
        select:"firstName lastName email"
    });
};