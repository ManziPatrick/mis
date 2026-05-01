"use client"
import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilterLeft, BsFilterSquareFill } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { FaUserPlus } from 'react-icons/fa6'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useGetAllUniform, useGetAllUniformPaymentQuery, userCreateUniformPaymentMutation } from '@/utlis/hooks/payment.hook'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { OrbitProgress } from 'react-loading-indicators'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { toast, Toaster } from 'sonner'
import { useApproveUniformPayment, useGetAllStockCategory, userCreateStockCategoryMutation } from '@/utlis/hooks/stock.hook'
import NewUniformPayment from '@/components/reusable/UniformPayment'
import { Dialog } from 'primereact/dialog'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { useGetAllSuppiers } from '@/utlis/hooks/suppliers.hook'

const Uniform = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [refetch, setRefetch] = useState<boolean>(false)
    const [isCreateCategory, setIsCreateCategory] = useState<boolean>(false)
    const { data: categories, isLoading: categoryLoading, isError: categoryIsError, error: categoryError, refetch: categoryFetch } = useGetAllStockCategory()
    const { mutate: createCategory, isPending: categoryPending } = userCreateStockCategoryMutation()
    const { data: suppliers, isLoading: supplierLoading } = useGetAllSuppiers()
    const { data: uniforms, isLoading: uniformStockLoading, isError } = useGetAllUniform()


    const [isNewOpen, setIsNewOpen] = useState<boolean>(false)
    const [approveId, setApprovedId] = useState<string>("")
    const { data: uniformPayment, isLoading: uniformLoading, refetch: uniformRefetch } = useGetAllUniformPaymentQuery()
    const { mutate: uniformApproveMutate, isPending } = useApproveUniformPayment()

    const actionTemplate = (rowData: any) => {
        return (
            <div className=' flex flex-row items-center gap-[8px]'>
                <span className='px-[5px] py-[3px] border hover:bg-green-200 font-[500] cursor-pointer'>View</span>
                <span onClick={() => confirmDelete(rowData)} className='px-[5px] py-[3px] border hover:bg-orange-300 font-[500] cursor-pointer '>
                    {isPending && approveId == rowData._id ? (
                        "Wait.."
                    ) : (
                        "Approve"
                    )}
                </span>
            </div>
        )
    }
    const amountTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[10px] items-center'>
                <span className='text-[13px] font-[500]'>{rowData.amountPaid}</span>
                <span className='text-[13px] font-[300]'>frw</span>

            </div>
        )
    }


    const confirmDelete = (rowData: any) => {
        confirmDialog({
            message: 'Do you want to approve this uniform?',
            header: 'Approve Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptLabel: 'Yes, Approve',
            rejectLabel: 'Cancel',
            acceptClassName: ' bg-green-400 text-white p-3 ',
            rejectClassName: ' inline-block mr-2 bg-blue-400 text-white p-3 ',

            accept: () => ApproveUniformFun(rowData._id),
        });
    };

    const ApproveUniformFun = async (id: string) => {
        setApprovedId(id)
        uniformApproveMutate({ id, approval: true }, {
            onSuccess: (data) => {
                toast.success("Approve Uniform successfully")
                uniformRefetch()
            },
            onError: (error: any) => {
                toast.error("errorororor")
            }
        })
    }


    const newCategoryFormik = useFormik({
        initialValues: {
            description: "",
            name: ""
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Name is required"),
            description: Yup.string().required("Description is required"),

        }),
        onSubmit: (values) => {
            createCategory({ name: values.name, description: values.description }, ({
                onSuccess: (data) => {
                    toast.success("Category created successfully")
                    categoryFetch()
                    setIsCreateCategory(false)

                }, onError: (error) => {
                    toast.error(error.message)
                }
            }))

        }
    })

    console.log(uniforms)


    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Stock  /</span>
                    <span className='text-[14px] font-[600]'>Uniform</span>
                </div>
                <Button onClick={() => setIsOpen(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-6 py-3 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                    +
                    Create Uniform
                </Button>
            </div>
            <div className='flex flex-row gap-[10px]  items-center justify-between bg-white p-4 rounded-[6px]'>
                <h1 className='text-[16px] font-[600]'>Uniform stocks</h1>
                <div className='flex flex-row items-center gap-[10px]'>
                    <Button onClick={() => setIsCreateCategory(true)} className='text-[12px] text-white rounded-[6px] hover:opacity-80 px-3 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                        <span>+</span>
                        New Category
                    </Button>
                    <div className='flex flex-row gap-[4px] items-center cursor-pointer p-2 border rounded-[6px]'>
                        <span className='text-[13px]'>More Filter</span>
                        <BsFilterLeft size={18} />
                    </div>
                    <div className='flex flex-row items-center gap-[3px] p-2 border rounded-[6px]'>
                        <CiSearch size={18} />
                        <input type="text" className='text-[13px] rounded-[6px] outline-none' placeholder='Search' />
                    </div>
                </div>
            </div>
            <div className='  flex flex-col gap-[10px]'>
                {uniformStockLoading ? (
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (<>
                    {!uniforms || uniforms?.length == 0 || isError ? (
                        <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                            <GiEmptyWoodBucket size={60} color='lightgray' />
                            <span className='text-[16px] font-[700]'>No Uniform Available</span>
                            <span className='text-[12px]'>There is no uniform yet but you can create new one </span>
                            <Button onClick={() => setIsNewOpen(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                                +
                                Create Uniform
                            </Button>

                        </div>
                    ) : (
                        <div className=' bg-white p-4  rounded-[6px] grid grid-cols-2 gap-[10px]'>
                            {uniforms?.map((unif: any, index: number) => {
                                return (
                                    <div key={index} className='w-full border p-4 flex flex-col gap-[20px] rounded-[6px]'>
                                        <div className='flex flex-col gap-[5px]'>
                                            <span className='text-[14px] font-[400x] text-gray-300'>Unifrom type:</span>
                                            <h1 className='tetxt-[20px] font-[700] text-black uppercase'>{unif.item}</h1>
                                        </div>
                                        <div className='text--[13px] text-black font-[300] border-b pb-4'>
                                            <span>{unif.description}</span>
                                        </div>
                                        <div className=' grid grid-cols-1 gap-[20px] items-center'>
                                            {unif.itemPrices.map((piece: any, indexPiece: number) => {
                                                return (
                                                    <div key={indexPiece} className='flex flex-col gap-[4px] border-b pb-2'>
                                                        <div className='grid grid-cols-2 gap-[4px] w-full'>
                                                            <div className='flex flex-row gap-[5px]'>
                                                                <span className='text-[14px] text-gray-500'>Item</span>
                                                                <span className='text-[16px] text-black'>{piece?.itemName}</span>
                                                            </div>

                                                            <div className='flex flex-row gap-[5px]'>
                                                                <span className='text-[14px] text-gray-500'>Quantity</span>
                                                                <span className='text-black text-[14px] font-[600]'>{piece?.quantity}</span>
                                                            </div>
                                                            <div className='flex flex-row gap-[5px]'>
                                                                <span className='text-[14px] text-gray-500'>Price</span>
                                                                <span className='text-black text-[14px] font-[600]'>{piece?.price} Frw</span>
                                                            </div>
                                                            <div className='flex flex-row gap-[5px]'>
                                                                <span className='text-[14px] text-gray-500'>Total</span>
                                                                <span className='text-black text-[14px] font-[600]'>{piece?.price * piece?.quantity} Frw</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                )
                            })}
                        </div>
                    )}
                </>)}


            </div>
            <Dialog header="New Category" className='w-1/3' onHide={() => setIsCreateCategory(false)} visible={isCreateCategory}>
                <form onSubmit={newCategoryFormik.handleSubmit} className='w-full flex flex-col gap-[10px]'>
                    <div className='flex flex-col gap-[4px] w-full'>
                        <span className='text-[14px] text-black'>Name</span>
                        <input
                            value={newCategoryFormik.values.name}
                            name='name'
                            onChange={newCategoryFormik.handleChange}
                            type="text"
                            className='border p-3 text-[13px] rounded-[12px]'
                            placeholder='Enter Item Name'
                        />
                        {newCategoryFormik.touched.name && newCategoryFormik.errors.name && (
                            <div className="text-red-500 text-[12px]">{newCategoryFormik.errors.name}</div>
                        )}
                    </div>
                    <div className='flex flex-col gap-[4px] w-full'>
                        <span className='text-[14px] text-black'>Description</span>
                        <textarea
                            value={newCategoryFormik.values.description}
                            name='description'
                            onChange={newCategoryFormik.handleChange}

                            className='border p-3 text-[13px] rounded-[12px]'
                            placeholder='Enter Description'
                        />
                        {newCategoryFormik.touched.description && newCategoryFormik.errors.description && (
                            <div className="text-red-500 text-[12px]">{newCategoryFormik.errors.description}</div>
                        )}
                    </div>
                    <Button loading={categoryPending} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-3 bg-[#2E3487] flex flex-row gap-[10px] justify-center items-center'>
                        Create
                    </Button>

                </form>

            </Dialog>
            <NewUniformPayment isOpen={isOpen} reFetch={refetch} setIsOpen={setIsOpen} categories={categories} suppliers={suppliers?.supplier} />

        </div>
    )
}

export default Uniform