"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilterSquareFill } from "react-icons/bs";
import { Dialog } from 'primereact/dialog';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from 'primereact/button';
import { OrbitProgress } from 'react-loading-indicators';
import { GiEmptyWoodBucket } from 'react-icons/gi';
import { FaRegEye } from 'react-icons/fa6';
import { toast } from 'sonner';
import { useApproveEmployee } from '@/utlis/hooks/empoyees.hook';
import { AxiosError } from 'axios';
import { useApproveBookRequest, useGetAllBookDeleteRequest } from '@/utlis/hooks/library.hook';



const BookRequest = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [rejectingId, setRejectingId] = useState<string>("")
    const [approvingId, setApprovingId] = useState<string>()
    const [isView, setIsView] = useState<boolean>(false)
    const [viewedData, setViewedData] = useState<any>({})

    const { data: bookRequest, isLoading: bookLoading, refetch: bookRefetch,isError } = useGetAllBookDeleteRequest()
    const { mutate: approveMutate, isPending } = useApproveBookRequest()




    const actionTemplate = (rowData: any) => {
        return (
            <div className="flex flex-row gap-[20px] items-center">
                <span className='cursor-pointer px-2 border p-2 rounded-[4px] hover:bg-gray-100' onClick={() => { setViewedData(rowData); setIsView(true) }}><FaRegEye size={20} /></span>
            </div>
        )
    }

    const ApproveRequestFun = (id: string) => {
        setApprovingId(id)
        const data = {
            id: `${id}`, 
            status: "Approved"
        }
        approveMutate(data, {
            onSuccess: (data) => {
                console.log(data)
                bookRefetch()
                setIsView(false)
                toast.success(data.message || "Request Approved")
            },
            onError: (fail) => {
                const erorr: any = fail as AxiosError
                const errorMessage = erorr?.response?.data?.message || "An unexpected error occurred";
                toast.error(errorMessage);
            }
        })
    }
    const RejectRequestFun = (id: string) => {
        setRejectingId(id)
        const data = {
            id: `${id}`,
            status: "Rejected"
        }
        approveMutate(data, {
            onSuccess: (data) => {
                console.log(data)
                bookRefetch()
                setIsView(false)
                toast.success(data.message || "Request Rejected")
            },
            onError: (fail) => {
                const erorr: any = fail as AxiosError
                const errorMessage = erorr?.response?.data?.message || "An unexpected error occurred";
                toast.error(errorMessage);
            }
        })
    }



    const dateTemplate = (rowData: any) => {
        return (
            <div className="flex flex-row gap-[10px] items-center">

            </div>
        )
    }
    const requestedByTemplate = (rowData: any) => {
        return (
            <div className="flex flex-row gap-[10px] items-center">
                <span>{rowData?.deleted_by?.firstName}</span>
                <span>{rowData?.deleted_by?.lastName}</span>
            </div>
        )
    }
    const statusTemplate = (rowData: any) => {
        return (
            <div className={` py-2 text-center justify-center items-center flex border ${rowData?.request_status === "Approved" ? " text-green-500 border-green-500" : "text-red-500 border-red-500 "} px-2 py-1 rounded-[12px]`}>
                <span>{rowData?.request_status}</span>
            </div>
        )
    }

    console.log("bookRequest", bookRequest)





    return (
        <div className='p-4 flex flex-col gap-[20px]'>
            <div className='w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between'>
                <div className='flex flex-row gap-[10px] items-center'>
                    <span className='text-[16px] font-[400]'>Books Request</span>
                    <div className='p-1 px-2 rounded-[4px] bg-gray-50 '>
                        <span className='font-[500]'>{!bookLoading && bookRequest?.filter((data: any) => data.request_status !== "Approved").length}</span>
                    </div>
                </div>
                <div className='flex flex-row items-center gap-[10px]'>
                    <div className='flex flex-row border items-center gap-[10px] rounded-[12px] p-2'>
                        <BiSearch />
                        <input type="text" placeholder='Search something' className=' outline-none' />
                    </div>
                    <div className='p-2 cursor-pointer'>
                        <BsFilterSquareFill color='black' size={20} />
                    </div>
                </div>
            </div>
            <div className='py-2 bg-white'>
                {bookLoading ? (
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (
                    <>
                        { isError || bookRequest?.filter((data: any) => data.request_status !== "Approved").length == 0 ? (
                            <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                                <GiEmptyWoodBucket size={60} color='lightgray' />
                                <span className='text-[16px] font-[700]'>No Request Avaliable</span>
                                <span className='text-[12px]'>There is no any request yet</span>
                            </div>
                        ) : (
                            <DataTable
                                paginator
                                rows={10}
                                rowsPerPageOptions={[10, 20, 40]}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} bookRequest"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                value={bookRequest?.filter((data: any) => data.request_status !== "Approved").sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                                className="w-full mt-4"
                            >
                                <Column
                                    body={(rowData, options) =>
                                        (options.rowIndex + 1).toString().padStart(3, "0")
                                    }
                                    field="code"
                                    header="#"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[13px] border-b"
                                ></Column>
                                <Column
                                    field="book_name"
                                    header="Book Name"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="isbn"
                                    header="ISBN"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="deleted_reason"
                                    header="Reason"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="requested_by"
                                    header="Requested By"
                                    body={requestedByTemplate}
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="request_status"
                                    header="Requested Status"
                                    body={statusTemplate}
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="action"
                                    header="Action"
                                    body={actionTemplate}
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                            </DataTable>

                        )}
                    </>

                )}
            </div>
            <Dialog
                header="View Request"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/3"
                visible={isView}
                onHide={() => setIsView(false)}
            >
                <div className="w-full flex flex-col gap-[20px]">


                    <div className="flex flex-col w-full items-end justify-end">
                        <div className="flex flex-row gap-[20px] w-full ">
                            <Button onClick={() => ApproveRequestFun(viewedData._id)} disabled={isPending && approvingId === viewedData._id} className=" text-white px-10 py-3 w-full  text-center flex items-center justify-center bg-blue-900 rounded-[6px]">{isPending && approvingId === viewedData._id ? "Loading..." : "Approve"}</Button>
                            <Button onClick={() => RejectRequestFun(viewedData._id)} className={` text-white px-10 py-3 w-full  text-center flex items-center justify-center ${rejectingId === viewedData._id ? "bg-red-500" : "bg-gray-500"} rounded-[6px]`}>{isPending && rejectingId === viewedData._id ? "Loading..." : "Reject"}</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default BookRequest