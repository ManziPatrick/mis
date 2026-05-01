import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { newSupplierFormikSchema } from '@/utlis/validation/validation';
import { IoMdDocument } from 'react-icons/io';
import { userCreaSupplierMutation } from '@/utlis/hooks/suppliers.hook';

interface NewSupplierType {
    isOpen: boolean;
    setIsOpen: any;
    reFetch: any;
}

const NewSupplier = ({ isOpen, setIsOpen, reFetch }: NewSupplierType) => {
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: createSupplierMutate } = userCreaSupplierMutation();

    const newSupplierFormik = useFormik({
        initialValues: {
            name: "",
            tin: "",
            phone: "",
            email: "",
            commodity: "",
            address: "",
            contract: null,
        },
        validationSchema: newSupplierFormikSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                createSupplierMutate(values, {
                    onSuccess: () => {
                        toast.success("New Supplier created successfully");
                        reFetch();
                        setIsOpen(false);
                        newSupplierFormik.resetForm();
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

    return (
        <>
            <Toaster position="top-right" />
            <Dialog
                header="New Supplier"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/2"
                visible={isOpen}
                onHide={() => setIsOpen(false)}
            >
                <form
                    onSubmit={newSupplierFormik.handleSubmit}
                    className="w-full p-3 flex flex-col gap-[10px]"
                >
                    <div className="grid grid-cols-2 gap-[5px]">
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Name</span>
                            <input
                                value={newSupplierFormik.values.name}
                                name="name"
                                onChange={newSupplierFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter Supplier Name"
                            />
                            {newSupplierFormik.touched.name && newSupplierFormik.errors.name && (
                                <div className="text-red-500 text-[12px]">{newSupplierFormik.errors.name}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">TIN</span>
                            <input
                                value={newSupplierFormik.values.tin}
                                name="tin"
                                onChange={newSupplierFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter TIN"
                            />
                            {newSupplierFormik.touched.tin && newSupplierFormik.errors.tin && (
                                <div className="text-red-500 text-[12px]">{newSupplierFormik.errors.tin}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Phone</span>
                            <input
                                value={newSupplierFormik.values.phone}
                                name="phone"
                                onChange={newSupplierFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter Phone Number"
                            />
                            {newSupplierFormik.touched.phone && newSupplierFormik.errors.phone && (
                                <div className="text-red-500 text-[12px]">{newSupplierFormik.errors.phone}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Email</span>
                            <input
                                value={newSupplierFormik.values.email}
                                name="email"
                                onChange={newSupplierFormik.handleChange}
                                type="email"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter Email"
                            />
                            {newSupplierFormik.touched.email && newSupplierFormik.errors.email && (
                                <div className="text-red-500 text-[12px]">{newSupplierFormik.errors.email}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Commodity</span>
                            <input
                                value={newSupplierFormik.values.commodity}
                                name="commodity"
                                onChange={newSupplierFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter Commodity"
                            />
                            {newSupplierFormik.touched.commodity && newSupplierFormik.errors.commodity && (
                                <div className="text-red-500 text-[12px]">{newSupplierFormik.errors.commodity}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Address</span>
                            <input
                                value={newSupplierFormik.values.address}
                                name="address"
                                onChange={newSupplierFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter Address"
                            />
                            {newSupplierFormik.touched.address && newSupplierFormik.errors.address && (
                                <div className="text-red-500 text-[12px]">{newSupplierFormik.errors.address}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Contract (PDF)</span>
                            <label
                                htmlFor="contract"
                                className={`cursor-pointer border flex flex-row gap-[4px] p-3 rounded-[12px] ${newSupplierFormik.values.contract !== null ? "text-white bg-[#2E3487]" : ""} items-center justify-center`}
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
                                    newSupplierFormik.setFieldValue("contract", file);
                                }}
                            />
                            {newSupplierFormik.touched.contract && newSupplierFormik.errors.contract && (
                                <div className="text-red-500 text-[12px]">{newSupplierFormik.errors.contract}</div>
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

export default NewSupplier;
