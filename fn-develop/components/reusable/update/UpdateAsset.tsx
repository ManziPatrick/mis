import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { NewUserModalType } from '@/utlis/types/type.types';
import { useUpdateAsset } from '@/utlis/hooks/stock.hook';
import { newAssetFormikSchema } from '@/utlis/validation/validation';

interface UpdateAssestType {
    isOpen: boolean
    setIsOpen: any
    reFetch: any
    categories: any[]
    assetToUpdate: any
}

const UpdateAsset = ({ isOpen, setIsOpen, reFetch, categories, assetToUpdate }: UpdateAssestType) => {
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: updateAssetMutate } = useUpdateAsset();

    const updateAssetFormik = useFormik({
        initialValues: {
            item: assetToUpdate?.item || "",
            purchaseDate: assetToUpdate?.purchaseDate || "",
            category: assetToUpdate?.category || "",
            description: assetToUpdate?.description || "",
            location: assetToUpdate?.location || "",
            totalNumber: assetToUpdate?.totalNumber || 0,
            totalNumberInGoodCondition: assetToUpdate?.totalNumberInGoodCondition || 0,
            totalNumberInCriticalCondition: assetToUpdate?.totalNumberInCriticalCondition || 0,
            values: assetToUpdate?.values || 0,
        },
        enableReinitialize: true,
        validationSchema: newAssetFormikSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                updateAssetMutate(
                    { ...values, id: assetToUpdate._id },
                    {
                        onSuccess: (data) => {
                            toast.success("Asset updated successfully");
                            reFetch();
                            setIsOpen(false);
                            updateAssetFormik.resetForm();
                            setIsLoading(false);
                        },
                        onError: (error) => {
                            setIsLoading(false);
                            toast.error(error.message);
                        },
                    }
                );
            } catch (error:any) {
                toast.error(error.message);
                setIsLoading(false);
            }
        },
    });


    return (
        <>
            <Toaster position='top-right' />
            <Dialog
                header="Update Asset"
                headerStyle={{ fontSize: 10, color: "black" }}
                className='w-1/2'
                visible={isOpen}
                onHide={() => setIsOpen(false)}
            >
                <form onSubmit={updateAssetFormik.handleSubmit} className='w-full p-3 flex flex-col gap-[10px]'>
                    <div className='grid grid-cols-2 gap-[5px]'>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Item</span>
                            <input
                                value={updateAssetFormik.values.item}
                                name='item'
                                onChange={updateAssetFormik.handleChange}
                                type="text"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Item Name'
                            />
                            {updateAssetFormik.touched.item && updateAssetFormik.errors.item && (
                                <div className="text-red-500 text-[12px]">{String(updateAssetFormik.errors.item)}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Purchase Date</span>
                            <input
                                value={updateAssetFormik.values.purchaseDate}
                                name='purchaseDate'
                                onChange={updateAssetFormik.handleChange}
                                type="date"
                                className='border p-3 text-[12px] rounded-[12px]'
                            />
                            {updateAssetFormik.touched.purchaseDate && updateAssetFormik.errors.purchaseDate && (
                                <div className="text-red-500 text-[12px]">{String(updateAssetFormik.errors.purchaseDate)}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Select Category</span>
                            <select
                                value={updateAssetFormik.values.category}
                                name='category'
                                onChange={updateAssetFormik.handleChange}
                                className='border p-3 text-[12px] rounded-[6px]'
                            >
                                <option value="disable" disabled>Select Category</option>
                                {categories?.map((category, index) => (
                                    <option key={index} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                            {updateAssetFormik.touched.category && updateAssetFormik.errors.category && (
                                <div className="text-red-500 text-[12px]">{String(updateAssetFormik.errors.category)}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Description</span>
                            <textarea
                                value={updateAssetFormik.values.description}
                                name='description'
                                onChange={updateAssetFormik.handleChange}
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Description'
                            />
                            {updateAssetFormik.touched.description && updateAssetFormik.errors.description && (
                                <div className="text-red-500 text-[12px]">{String(updateAssetFormik.errors.description)}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Location</span>
                            <input
                                value={updateAssetFormik.values.location}
                                name='location'
                                onChange={updateAssetFormik.handleChange}
                                type="text"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Location'
                            />
                            {updateAssetFormik.touched.location && updateAssetFormik.errors.location && (
                                <div className="text-red-500 text-[12px]">{String(updateAssetFormik.errors.location)}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Total Number</span>
                            <input
                                value={updateAssetFormik.values.totalNumber}
                                name='totalNumber'
                                onChange={updateAssetFormik.handleChange}
                                type="number"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Total Number'
                            />
                            {updateAssetFormik.touched.totalNumber && updateAssetFormik.errors.totalNumber && (
                                <div className="text-red-500 text-[12px]">{String(updateAssetFormik.errors.totalNumber)}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Total in Good Condition</span>
                            <input
                                value={updateAssetFormik.values.totalNumberInGoodCondition}
                                name='totalNumberInGoodCondition'
                                onChange={updateAssetFormik.handleChange}
                                type="number"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Total in Good Condition'
                            />
                            {updateAssetFormik.touched.totalNumberInGoodCondition && updateAssetFormik.errors.totalNumberInGoodCondition && (
                                <div className="text-red-500 text-[12px]">{String(updateAssetFormik.errors.totalNumberInGoodCondition)}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Total in Critical Condition</span>
                            <input
                                value={updateAssetFormik.values.totalNumberInCriticalCondition}
                                name='totalNumberInCriticalCondition'
                                onChange={updateAssetFormik.handleChange}
                                type="number"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Total in Critical Condition'
                            />
                            {updateAssetFormik.touched.totalNumberInCriticalCondition && updateAssetFormik.errors.totalNumberInCriticalCondition && (
                                <div className="text-red-500 text-[12px]">{String(updateAssetFormik.errors.totalNumberInCriticalCondition)}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Value</span>
                            <input
                                value={updateAssetFormik.values.values}
                                name='values'
                                onChange={updateAssetFormik.handleChange}
                                type="number"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Asset Value'
                            />
                            {updateAssetFormik.touched.values && updateAssetFormik.errors.values && (
                                <div className="text-red-500 text-[12px]">{String(updateAssetFormik.errors.values)}</div>
                            )}
                        </div>
                    </div>
                    <Button
                        loading={isLoading}
                        className='flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center'
                    >
                        Update
                    </Button>
                </form>
            </Dialog>
        </>
    );
};

export default UpdateAsset;
