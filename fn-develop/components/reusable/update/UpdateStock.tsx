import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import {  useUpdateStock  } from '@/utlis/hooks/stock.hook';
import { updateStockFormikSchema } from '@/utlis/validation/validation';
import { IoMdDocument } from 'react-icons/io';
import { AxiosError } from 'axios';

interface NewStockType {
    isOpen: boolean;
    setIsOpen: any;
    reFetch: any;
    categories: any[];
    suppliers: any[];
    stockData: any;
}

const UpdateStock = ({ isOpen, setIsOpen, reFetch, categories, suppliers, stockData }: NewStockType) => {
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: updateStockMutate } = useUpdateStock();

    const updateStockFormik = useFormik({
        initialValues: {
            item: stockData?.item || "",
            category: stockData?.category || "",
            description: stockData?.description || "",
            quantity: stockData?.quantity || 0,
            totalPrice: stockData?.totalPrice || 0,
            unityPrice: stockData?.unityPrice || 0,
            unity: stockData?.unity || "",
        },
        enableReinitialize: true,
        validationSchema: updateStockFormikSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                updateStockMutate({ 
                    id: stockData._id, 
                    ...values,
                }, {
                    onSuccess: () => {
                        toast.success("Stock updated successfully");
                        reFetch();
                        setIsOpen(false);
                        updateStockFormik.resetForm();
                        setIsLoading(false);
                    },
                    onError: (error: any) => {
                        const axiosError = error as AxiosError<{message: string}>;
                        toast.error(axiosError?.response?.data?.message || "Error updating stock");
                        setIsLoading(false);
                    },
                });
            } catch (error: any) {
                const axiosError = error as AxiosError<{message: string}>;
                toast.error(axiosError?.response?.data?.message || "An error occurred");
                setIsLoading(false);
            }
        },
    });

    useEffect(() => {
        if (updateStockFormik.values.unityPrice && updateStockFormik.values.quantity) {
            updateStockFormik.setFieldValue("totalPrice", updateStockFormik.values.quantity * updateStockFormik.values.unityPrice)
        }

    }, [updateStockFormik.values.unityPrice, updateStockFormik.values.quantity])

    return (
        <>
            <Toaster position="top-right" />
            <Dialog
                header="Update Stock"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/2"
                visible={isOpen}
                onHide={() => {updateStockFormik.resetForm();setIsOpen(false)}}
            >
                <form
                    onSubmit={updateStockFormik.handleSubmit}
                    className="w-full p-3 flex flex-col gap-[10px]"
                >
                    <div className="grid grid-cols-2 gap-[5px]">
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">item</span>
                            <input
                                value={updateStockFormik.values.item}
                                name="item"
                                onChange={updateStockFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter item Name"
                            />
                            {updateStockFormik.touched.item && updateStockFormik.errors.item && (
                                <div className="text-red-500 text-[12px]">{String(updateStockFormik.errors.item)}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">category</span>
                            <select
                                value={updateStockFormik.values.category}
                                name="category"
                                onChange={updateStockFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[6px]"
                            >
                                <option value="" className='text-gray-200'>Select Category</option>
                                {categories?.map((category, index) => (
                                    <option key={index} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {updateStockFormik.touched.category && updateStockFormik.errors.category && (
                                <div className="text-red-500 text-[12px]">{String(updateStockFormik.errors.category)}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">description</span>
                            <textarea
                                value={updateStockFormik.values.description}
                                name="description"
                                onChange={updateStockFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter description"
                            />
                            {updateStockFormik.touched.description && updateStockFormik.errors.description && (
                                <div className="text-red-500 text-[12px]">{String(updateStockFormik.errors.description)}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">quantity</span>
                            <input
                                value={updateStockFormik.values.quantity}
                                name="quantity"
                                onChange={updateStockFormik.handleChange}
                                type="number"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter quantity"
                            />
                            {updateStockFormik.touched.quantity && updateStockFormik.errors.quantity && (
                                <div className="text-red-500 text-[12px]">{String(updateStockFormik.errors.quantity)}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Unity</span>
                            <input
                                value={updateStockFormik.values.unity}
                                name="unity"
                                onChange={updateStockFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter unit measurement"
                            />
                            {updateStockFormik.touched.unity && updateStockFormik.errors.unity && (
                                <div className="text-red-500 text-[12px]">{String(updateStockFormik.errors.unity)}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Unity Price</span>
                            <input
                                value={updateStockFormik.values.unityPrice}
                                name="unityPrice"
                                onChange={updateStockFormik.handleChange}
                                type="number"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter total price"
                            />
                            {updateStockFormik.touched.unityPrice && updateStockFormik.errors.unityPrice && (
                                <div className="text-red-500 text-[12px]">{String(updateStockFormik.errors.unityPrice)}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Total price</span>
                            <input
                                value={updateStockFormik.values.totalPrice}
                                name="totalPrice"
                                onChange={updateStockFormik.handleChange}
                                type="number"
                                disabled
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter total price"
                            />
                            {updateStockFormik.touched.totalPrice && updateStockFormik.errors.totalPrice && (
                                <div className="text-red-500 text-[12px]">{String(updateStockFormik.errors.totalPrice)}</div>
                            )}
                        </div>
                    </div>
                    <Button
                        loading={isLoading}
                        className="flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center"
                    >
                        Update
                    </Button>
                </form>
            </Dialog>
        </>
    );
};

export default UpdateStock;
