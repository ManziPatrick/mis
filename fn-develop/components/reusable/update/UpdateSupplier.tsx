import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { newSupplierFormikSchema, UpdateSupplierFormikSchema } from '@/utlis/validation/validation';
import { IoMdDocument } from 'react-icons/io';
import { userCreaSupplierMutation, useUpdateSupplier } from '@/utlis/hooks/suppliers.hook';

interface NewSupplierType {
    isOpen: boolean;
    setIsOpen: any;
    reFetch: any;
    updateData:any
}

const UpdateSupplier = ({ isOpen, setIsOpen, reFetch,updateData }: NewSupplierType) => {
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: updateSupplier,isPending } = useUpdateSupplier();

    const UpdateSupplierFormik = useFormik({
        initialValues: {
            name: "",
            tin: "",
            phone: "",
            email: "",
            commodity: "",
            address: "",
            contract: null,
        },
        validationSchema: UpdateSupplierFormikSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            const data = {
                ...values,
                id: updateData._id
            }
            try {
                updateSupplier(data, {
                    onSuccess: () => {
                        toast.success("Supplier updated successfully");
                        reFetch();
                        setIsOpen(false);
                        UpdateSupplierFormik.resetForm();
                        setIsLoading(false);
                    },
                    onError: (error: any) => {
                        const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
                        toast.error(errorMessage);
                        setIsLoading(false);
                    },
                });
            } catch (error: any) {
                toast.error(error.message);
                setIsLoading(false);
            }
        },
    });

    useEffect(()=>{
        if(updateData){
            UpdateSupplierFormik.setValues(updateData)
            UpdateSupplierFormik.setFieldValue("contract", null)
        }
    },[updateData])

    return (
        <>
            <Toaster position="top-right" />
            <Dialog
                header="Update Supplier"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/2"
                visible={isOpen}
                onHide={() => setIsOpen(false)}
            >
                <form
                    onSubmit={UpdateSupplierFormik.handleSubmit}
                    className="w-full p-3 flex flex-col gap-[10px]"
                >
                    <div className="grid grid-cols-2 gap-[5px]">
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Name</span>
                            <input
                                value={UpdateSupplierFormik.values.name}
                                name="name"
                                onChange={UpdateSupplierFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter Supplier Name"
                            />
                            {UpdateSupplierFormik.touched.name && UpdateSupplierFormik.errors.name && (
                                <div className="text-red-500 text-[12px]">{UpdateSupplierFormik.errors.name}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">TIN</span>
                            <input
                                value={UpdateSupplierFormik.values.tin}
                                name="tin"
                                onChange={UpdateSupplierFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter TIN"
                            />
                            {UpdateSupplierFormik.touched.tin && UpdateSupplierFormik.errors.tin && (
                                <div className="text-red-500 text-[12px]">{UpdateSupplierFormik.errors.tin}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Phone</span>
                            <input
                                value={UpdateSupplierFormik.values.phone}
                                name="phone"
                                onChange={UpdateSupplierFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter Phone Number"
                            />
                            {UpdateSupplierFormik.touched.phone && UpdateSupplierFormik.errors.phone && (
                                <div className="text-red-500 text-[12px]">{UpdateSupplierFormik.errors.phone}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Email</span>
                            <input
                                value={UpdateSupplierFormik.values.email}
                                name="email"
                                onChange={UpdateSupplierFormik.handleChange}
                                type="email"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter Email"
                            />
                            {UpdateSupplierFormik.touched.email && UpdateSupplierFormik.errors.email && (
                                <div className="text-red-500 text-[12px]">{UpdateSupplierFormik.errors.email}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Commodity</span>
                            <input
                                value={UpdateSupplierFormik.values.commodity}
                                name="commodity"
                                onChange={UpdateSupplierFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter Commodity"
                            />
                            {UpdateSupplierFormik.touched.commodity && UpdateSupplierFormik.errors.commodity && (
                                <div className="text-red-500 text-[12px]">{UpdateSupplierFormik.errors.commodity}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Address</span>
                            <input
                                value={UpdateSupplierFormik.values.address}
                                name="address"
                                onChange={UpdateSupplierFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter Address"
                            />
                            {UpdateSupplierFormik.touched.address && UpdateSupplierFormik.errors.address && (
                                <div className="text-red-500 text-[12px]">{UpdateSupplierFormik.errors.address}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Contract (PDF)</span>
                            <label
                                htmlFor="contract"
                                className={`cursor-pointer border flex flex-row gap-[4px] p-3 rounded-[12px] ${UpdateSupplierFormik.values.contract !== null ? "text-white bg-[#2E3487]" : ""} items-center justify-center`}
                            >
                                <IoMdDocument size={20} />
                                <span className="text-[13px] font-[500]">Assign document (PDF)</span>
                            </label>
                            <input
                                type="file"
                                name="contract"
                                id="contract"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(event: any) => {
                                    const file = event.currentTarget.files[0];
                                    UpdateSupplierFormik.setFieldValue("contract", file);
                                }}
                            />
                            {UpdateSupplierFormik.touched.contract && UpdateSupplierFormik.errors.contract && (
                                <div className="text-red-500 text-[12px]">{UpdateSupplierFormik.errors.contract}</div>
                            )}
                        </div>
                    </div>
                    <Button
                        loading={isLoading}
                        className="flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center"
                    >
                        Save
                    </Button>
                </form>
            </Dialog>
        </>
    );
};

export default UpdateSupplier;
