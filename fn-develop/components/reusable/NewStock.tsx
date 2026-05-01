import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { userCreateAssetMutation, userCreateStockMutation } from '@/utlis/hooks/stock.hook';
import { newAssetFormikSchema, newStockFormikSchema } from '@/utlis/validation/validation';
import { IoMdDocument } from 'react-icons/io';

interface NewStockType {
    isOpen: boolean;
    setIsOpen: any;
    reFetch: any;
    categories: any[];
    suppliers: any[]
}

const NewStock = ({ isOpen, setIsOpen, reFetch, categories, suppliers }: NewStockType) => {
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: createStockMutate } = userCreateStockMutation();
    console.log("suppliers modal", suppliers)

    const newStockFormik = useFormik({
        initialValues: {
            item: "",
            category: "",
            description: "",
            quantity: 0,
            supplierId: "",
            proofOfDelivery: null,
            date: "",
            totalPrice: 0,
            unityPrice: 0,
            unity: "",
        },
        validationSchema: newStockFormikSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                createStockMutate(values, {
                    onSuccess: () => {
                        toast.success("New Stock created successfully");
                        reFetch();
                        setIsOpen(false);
                        newStockFormik.resetForm();
                        setIsLoading(false);
                    },
                    onError: (error) => {
                        toast.error(error.message);
                        setIsLoading(false);
                    },
                });
            } catch (error: any) {
                toast.error(error.message);
                setIsLoading(false);
            }
        },
    });

    useEffect(() => {
        if (newStockFormik.values.unityPrice && newStockFormik.values.quantity) {
            newStockFormik.setFieldValue("totalPrice", newStockFormik.values.quantity * newStockFormik.values.unityPrice)
        }

    }, [newStockFormik.values.unityPrice, newStockFormik.values.quantity])

    return (
        <>
            <Toaster position="top-right" />
            <Dialog
                header="New Stock"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/2"
                visible={isOpen}
                onHide={() =>{newStockFormik.resetForm();setIsOpen(false)}}
            >
                <form
                    onSubmit={newStockFormik.handleSubmit}
                    className="w-full p-3 flex flex-col gap-[10px]"
                >
                    <div className="grid grid-cols-2 gap-[5px]">
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">item</span>
                            <input
                                value={newStockFormik.values.item}
                                name="item"
                                onChange={newStockFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter item Name"
                            />
                            {newStockFormik.touched.item && newStockFormik.errors.item && (
                                <div className="text-red-500 text-[12px]">{newStockFormik.errors.item}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">category</span>
                            <select
                                value={newStockFormik.values.category}
                                name="category"
                                onChange={newStockFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[6px]"
                            >
                                <option value="" className='text-gray-200'>Select Category</option>
                                {categories?.map((category, index) => (
                                    <option key={index} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {newStockFormik.touched.category && newStockFormik.errors.category && (
                                <div className="text-red-500 text-[12px]">{newStockFormik.errors.category}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">description</span>
                            <textarea
                                value={newStockFormik.values.description}
                                name="description"
                                onChange={newStockFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter description"
                            />
                            {newStockFormik.touched.description && newStockFormik.errors.description && (
                                <div className="text-red-500 text-[12px]">{newStockFormik.errors.description}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">quantity</span>
                            <input
                                value={newStockFormik.values.quantity}
                                name="quantity"
                                onChange={newStockFormik.handleChange}
                                type="number"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter quantity"
                            />
                            {newStockFormik.touched.quantity && newStockFormik.errors.quantity && (
                                <div className="text-red-500 text-[12px]">{newStockFormik.errors.quantity}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Unity</span>
                            <input
                                value={newStockFormik.values.unity}
                                name="unity"
                                onChange={newStockFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter unit measurement"
                            />
                            {newStockFormik.touched.unity && newStockFormik.errors.unity && (
                                <div className="text-red-500 text-[12px]">{newStockFormik.errors.unity}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Unity Price</span>
                            <input
                                value={newStockFormik.values.unityPrice}
                                name="unityPrice"
                                onChange={newStockFormik.handleChange}
                                type="number"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter total price"
                            />
                            {newStockFormik.touched.unityPrice && newStockFormik.errors.unityPrice && (
                                <div className="text-red-500 text-[12px]">{newStockFormik.errors.unityPrice}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Total price</span>
                            <input
                                value={newStockFormik.values.totalPrice}
                                name="totalPrice"
                                onChange={newStockFormik.handleChange}
                                type="number"
                                disabled
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter total price"
                            />
                            {newStockFormik.touched.totalPrice && newStockFormik.errors.totalPrice && (
                                <div className="text-red-500 text-[12px]">{newStockFormik.errors.totalPrice}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Select Supplier</span>
                            <select
                                value={newStockFormik.values.supplierId}
                                name="supplierId"
                                onChange={newStockFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"

                            >

                                <option value="" disabled>Select supplier</option>
                                {suppliers?.map((supply: any, index: number) => {
                                    return (
                                        <option value={supply._id} key={index}>{supply.name}</option>
                                    )
                                })}
                            </select>
                            {newStockFormik.touched.supplierId && newStockFormik.errors.supplierId && (
                                <div className="text-red-500 text-[12px]">{newStockFormik.errors.supplierId}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Proof of Delivery (PDF)</span>
                            <label
                                htmlFor="proofOfDelivery"
                                className={`cursor-pointer border flex flex-row gap-[4px] p-3 rounded-[12px] ${newStockFormik.values.proofOfDelivery !== null ? "text-white bg-[#2E3487]" : ""} items-center justify-center`}
                            >
                                <IoMdDocument size={20} />
                                <span className="text-[13px] font-[500]">Assign document (PDF)</span>
                            </label>
                            <input
                                type="file"
                                name="proofOfDelivery"
                                id="proofOfDelivery"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(event: any) => {
                                    const file = event.currentTarget.files[0];
                                    newStockFormik.setFieldValue("proofOfDelivery", file);
                                }}
                            />
                            {newStockFormik.touched.proofOfDelivery && newStockFormik.errors.proofOfDelivery && (
                                <div className="text-red-500 text-[12px]">{newStockFormik.errors.proofOfDelivery}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Arrival date</span>
                            <input
                                value={newStockFormik.values.date}
                                name="date"
                                onChange={newStockFormik.handleChange}
                                type="date"
                                className="border p-3 text-[12px] rounded-[12px]"
                                min={new Date().toISOString().split("T")[0]} 
                                max={new Date().toISOString().split("T")[0]} 
                            />
                            {newStockFormik.touched.date && newStockFormik.errors.date && (
                                <div className="text-red-500 text-[12px]">{newStockFormik.errors.date}</div>
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

export default NewStock;
