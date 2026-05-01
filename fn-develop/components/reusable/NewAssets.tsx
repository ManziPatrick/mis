import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { NewUserModalType } from '@/utlis/types/type.types';
import { userCreateAssetMutation } from '@/utlis/hooks/stock.hook';
import { newAssetFormikSchema } from '@/utlis/validation/validation';
import { AxiosError } from 'axios';

interface NewAssestType {
    isOpen: boolean
    setIsOpen: any
    reFetch: any
    categories: any[]
}

const NewAsset = ({ isOpen, setIsOpen, reFetch, categories}: NewAssestType) => {
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: createAssetMutate } = userCreateAssetMutation();

    const newAssetFormik = useFormik({
        initialValues: {
            item: "",
            purchaseDate: "",
            category: "",
            description: "",
            location: "",
            totalNumber: 0,
            totalNumberInGoodCondition: 0,
            totalNumberInCriticalCondition: 0,
            values: 0,
            criticalCondition: ""
        },
        validationSchema: newAssetFormikSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                createAssetMutate(values, {
                    onSuccess: (data) => {
                        toast.success("New asset created successfully");
                        reFetch();
                        setIsOpen(false);
                        newAssetFormik.resetForm();
                        setIsLoading(false);
                    },
                    onError: (error) => {
                        setIsLoading(false);
                        const axError:any = error as AxiosError
                        toast.error(axError.response?.data.message || "Something went wrong");
                        
                    },
                });
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
                header="New Asset"
                headerStyle={{ fontSize: 10, color: "black" }}
                className='w-1/2'
                visible={isOpen}
                onHide={() =>{newAssetFormik.resetForm();setIsOpen(false)}}
            >
                <form onSubmit={newAssetFormik.handleSubmit} className='w-full p-3 flex flex-col gap-[10px]'>
                    <div className='grid grid-cols-2 gap-[5px]'>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Item</span>
                            <input
                                value={newAssetFormik.values.item}
                                name='item'
                                onChange={newAssetFormik.handleChange}
                                type="text"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Item Name'
                            />
                            {newAssetFormik.touched.item && newAssetFormik.errors.item && (
                                <div className="text-red-500 text-[12px]">{newAssetFormik.errors.item}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Purchase Date</span>
                            <input
                                value={newAssetFormik.values.purchaseDate}
                                name='purchaseDate'
                                onChange={newAssetFormik.handleChange}
                                type="date"
                                className='border p-3 text-[12px] rounded-[12px]'
                            />
                            {newAssetFormik.touched.purchaseDate && newAssetFormik.errors.purchaseDate && (
                                <div className="text-red-500 text-[12px]">{newAssetFormik.errors.purchaseDate}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Select Category</span>
                            <select
                                value={newAssetFormik.values.category}
                                name='category'
                                onChange={newAssetFormik.handleChange}
                                className='border p-3 text-[12px] rounded-[6px]'
                            >
                                <option value="">Select Category</option>
                                {categories?.map((category, index) => (
                                    <option key={index} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                            {newAssetFormik.touched.category && newAssetFormik.errors.category && (
                                <div className="text-red-500 text-[12px]">{newAssetFormik.errors.category}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Description</span>
                            <textarea
                                value={newAssetFormik.values.description}
                                name='description'
                                onChange={newAssetFormik.handleChange}
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Description'
                            />
                            {newAssetFormik.touched.description && newAssetFormik.errors.description && (
                                <div className="text-red-500 text-[12px]">{newAssetFormik.errors.description}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Location</span>
                            <input
                                value={newAssetFormik.values.location}
                                name='location'
                                onChange={newAssetFormik.handleChange}
                                type="text"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Location'
                            />
                            {newAssetFormik.touched.location && newAssetFormik.errors.location && (
                                <div className="text-red-500 text-[12px]">{newAssetFormik.errors.location}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Total Number</span>
                            <input
                                value={newAssetFormik.values.totalNumber}
                                name='totalNumber'
                                onChange={newAssetFormik.handleChange}
                                type="number"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Total Number'
                            />
                            {newAssetFormik.touched.totalNumber && newAssetFormik.errors.totalNumber && (
                                <div className="text-red-500 text-[12px]">{newAssetFormik.errors.totalNumber}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Total in Good Condition</span>
                            <input
                                value={newAssetFormik.values.totalNumberInGoodCondition}
                                name='totalNumberInGoodCondition'
                                onChange={newAssetFormik.handleChange}
                                type="number"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Total in Good Condition'
                            />
                            {newAssetFormik.touched.totalNumberInGoodCondition && newAssetFormik.errors.totalNumberInGoodCondition && (
                                <div className="text-red-500 text-[12px]">{newAssetFormik.errors.totalNumberInGoodCondition}</div>
                            )}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Total in Critical Condition</span>
                            <input
                                value={newAssetFormik.values.totalNumberInCriticalCondition}
                                name='totalNumberInCriticalCondition'
                                onChange={newAssetFormik.handleChange}
                                type="number"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Total in Critical Condition'
                            />
                            {newAssetFormik.touched.totalNumberInCriticalCondition && newAssetFormik.errors.totalNumberInCriticalCondition && (
                                <div className="text-red-500 text-[12px]">{newAssetFormik.errors.totalNumberInCriticalCondition}</div>
                            )}
                        </div>
                        {newAssetFormik.values.totalNumberInCriticalCondition > 0 && (
                            <div className='flex flex-col gap-[4px] w-full'>
                                <span className='text-[12px] text-black'>Critical Condition Description</span>
                                <textarea
                                    value={newAssetFormik.values.criticalCondition}
                                    name='criticalCondition'
                                    onChange={newAssetFormik.handleChange}
                                    className='border p-3 text-[12px] rounded-[12px]'
                                    placeholder='Enter Critical Condition Details'
                                />
                                {newAssetFormik.touched.criticalCondition && newAssetFormik.errors.criticalCondition && (
                                    <div className="text-red-500 text-[12px]">{newAssetFormik.errors.criticalCondition}</div>
                                )}
                            </div>
                        )}
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Value</span>
                            <input
                                value={newAssetFormik.values.values}
                                name='values'
                                onChange={newAssetFormik.handleChange}
                                type="number"
                                className='border p-3 text-[12px] rounded-[12px]'
                                placeholder='Enter Asset Value'
                            />
                            {newAssetFormik.touched.values && newAssetFormik.errors.values && (
                                <div className="text-red-500 text-[12px]">{newAssetFormik.errors.values}</div>
                            )}
                        </div>
                    </div>
                    <Button
                        loading={isLoading}
                        className='flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center'
                    >
                        Save
                    </Button>
                </form>
            </Dialog>
        </>
    );
};

export default NewAsset;
