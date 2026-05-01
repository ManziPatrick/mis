"use client"
import NewSupplier from '@/components/reusable/NewSupplier'
import UpdateSupplier from '@/components/reusable/update/UpdateSupplier'
import { useDeleteSupplier, useGetAllSuppiers, useGetAllSupplies, useSendDeleteSupplierRequest } from '@/utlis/hooks/suppliers.hook'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import Link from 'next/link'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { FaRegPenToSquare, FaUserPlus } from 'react-icons/fa6'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { GoEye } from 'react-icons/go'
import { OrbitProgress } from 'react-loading-indicators'
import { toast } from 'sonner'
import * as Yup from "yup"

const Supplies = () => {
    const [isNewOpen, setIsNewOpen] = useState<boolean>(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)
    const { data: suppliers, isLoading, refetch } = useGetAllSuppiers()
    const [isView, setIsView] = useState<boolean>(false)
    const [viewedData, setViewedData] = useState<any>({})
    const [isSendRequest, setIsSendRequest] = useState<boolean>(false)
    const { mutate: deleteSupplier, isPending: deletePending } = useDeleteSupplier()
    const { mutate: requestDelete, isPending: requestPending } = useSendDeleteSupplierRequest()
    const {data: supplies, isLoading: suppliesLoading} = useGetAllSupplies()

    console.log("supplies",supplies)


    const actionTemplate = (rowData: any) => {
        return (
            <div className="flex flex-row gap-[20px] items-center">
                <div onClick={() => {setViewedData(rowData); setIsView(rowData) }} className="text-green-700 cursor-pointer"><GoEye size={20} /></div>
                <div onClick={()=> openUpdateFunc(rowData)} className="text-orange-700 cursor-pointer"><FaRegPenToSquare size={16} /></div>
            </div>
        )
    }



    const deleteBookFunc = () => {
        deleteSupplier(viewedData._id, {
            onSuccess: (response) => {
                setIsView(false)
                setViewedData(null)
                toast.success(response.message)
            },
            onError: (error) => {
                setIsSendRequest(true)
                const errorF: any = error as AxiosError
                toast.error(errorF?.response?.data?.message)
            }
        })
    }

    const requestFormik = useFormik({
        initialValues: {
            reason: ''
        },
        validationSchema: Yup.object().shape({
            reason: Yup.string().required('Reason is required   ')
        }),
        onSubmit: (values) => {
            const data = {
                reason: values.reason,
                id: viewedData._id
            }
            requestDelete(data, {
                onSuccess: (response) => {
                    toast.success("Request sent successfully")
                    setIsView(false)
                    setViewedData(null)
                    setIsSendRequest(false)
                },
                onError: (errorr) => {
                    const error: any = errorr as AxiosError
                    toast.success(error?.response?.data?.message)
                }
            })
        }
    })

    const openUpdateFunc = (data:any)=>{
        setViewedData(data)
        setIsUpdateOpen(true)
    }


    return (
        <>
            <div className='flex flex-col gap-[20px] p-4'>
                <div className='w-full items-center justify-between flex flex-row'>
                    <div className='flex flex-row gap-[4px] items-center'>
                        <span className='text-[14px]'>Procurement  /</span>
                        <span className='text-[14px] font-[600]'>Supplies</span>
                    </div>
                </div>
                <div className='w-full bg-white rounded-[6px] p-4 flex flex-row items-center justify-between'>
                    <div className='flex flex-row gap-[10px] items-center'>
                        <span className='text-[14px] font-[600]'>Supplies</span>
                        <div className='px-2 bg-gray-100 py-[2px] text-[14px] font-[600]'>{!suppliesLoading ? supplies?.length : 0}</div>
                    </div>
                    <div className='flex flex-row items-center gap-[10px]'>
                        <div className='flex flex-row gap-[4px] items-center cursor-pointer p-2 border rounded-[6px]'>
                            <span className='text-[12px]'>More Filter</span>
                            <BsFilterLeft size={18} />
                        </div>
                        <div className='flex flex-row items-center gap-[3px] p-2 border rounded-[6px]'>
                            <CiSearch size={18} />
                            <input type="text" className='text-[12px] rounded-[6px] outline-none' placeholder='Search' />
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <div className='w-full p-10 flex items-center  justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (
                    <>
                        {supplies?.length == 0 ? (
                            <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                                <GiEmptyWoodBucket size={60} color='lightgray' />
                                <span className='text-[16px] font-[700]'>No Supplies Avaliable</span>
                                <span className='text-[12px]'>There is no supplies yet</span>

                            </div>
                        ) : (
                            <DataTable
                                paginator
                                rows={10}
                                rowsPerPageOptions={[10, 20, 40]}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} supplies"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                value={supplies} className='w-full mt-4'>
                                <Column
                                    body={(rowData, options) =>
                                        (options.rowIndex + 1).toString().padStart(3, "0")
                                    }
                                    field="code"
                                    header="#"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[13px] border-b"
                                ></Column>
                                <Column field="supplierId.name" header="Supplier Name" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="item" header="Item" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="quantity" header="Quantity" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="unitPrice" header="Unit Price" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="totalCost" header="Total Cost" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="deliveryDate" header="Delivery Date" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="status" header="Status" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="Action" header="Action" body={actionTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            </DataTable>
                        )}
                    </>
                )}
            </div>
            <NewSupplier isOpen={isNewOpen} setIsOpen={setIsNewOpen} reFetch={refetch} />
            <UpdateSupplier isOpen={isUpdateOpen} setIsOpen={setIsUpdateOpen} reFetch={refetch} updateData={viewedData} />

            <Dialog visible={isView} className='w-1/2' header="Supplier Info" onHide={() => { setIsView(false);setIsSendRequest(false) ,setViewedData(null) }}>
                <div className='flex flex-col gap-[10px] w-full'>
                    <div className=' w-full grid grid-cols-3 gap-[20px]'>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>Name</span>
                            <span className='text-[14px]'>{viewedData?.name}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>Email</span>
                            <span className='text-[14px]'>{viewedData?.email}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>Phone</span>
                            <span className='text-[14px]'>{viewedData?.phone}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>address</span>
                            <span className='text-[14px]'>{viewedData?.address}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>commodity</span>
                            <span className='text-[13px]'>{viewedData?.commodity}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>CONTRACT</span>
                            <a href={`${viewedData?.contract}`} target='_blank' className='text-blue-600 font-[400]'>Download</a>
                        </div>
                    </div>
                    {!isSendRequest && (
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[16px] font-[500] text-red-500'>Danger zone</span>
                            <Button onClick={deleteBookFunc} className='px-4 w-[150px] items-center justify-center flex py-2 hover:bg-red-100 border  border-red-500 rounded-[6px] text-red-500'>
                                {deletePending ? "Loading.." : "Delete"}
                            </Button>
                        </div>
                    )}
                    {isSendRequest && (
                        <form onSubmit={requestFormik.handleSubmit} className='flex flex-col gap-[10px] py-4'>
                            <span className='text-[16px] font-[600]'>Send Delete Request</span>
                            <div className='flex flex-row gap-[10px] items-center '>
                                <input name='reason' onChange={requestFormik.handleChange} type="text" className='p-3 border rounded-[6px]' placeholder='Enter Reason ' />
                                <Button type='submit' className='px-8 p-3 bg-blue-500 text-white'>Send Request</Button>
                            </div>
                            {requestFormik.touched.reason && requestFormik.errors.reason ?
                                <span className='text-[14px] text-red-500'>{requestFormik.errors.reason}</span> : ''}
                        </form>
                    )}
                </div>

            </Dialog>
        </>
    )
}

export default Supplies