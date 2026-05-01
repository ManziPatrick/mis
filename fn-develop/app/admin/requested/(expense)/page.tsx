"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilterSquareFill } from "react-icons/bs";
import { Dialog } from 'primereact/dialog';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from 'primereact/button';
import { userDisableUserMutation, useSelectAllUsers, useSelectRoles } from '@/utlis/hooks/user.hook';
import { OrbitProgress } from 'react-loading-indicators';
import { GiEmptyWoodBucket } from 'react-icons/gi';
import { FaUserPlus } from 'react-icons/fa6';
import NewUser from '@/components/reusable/NewUser';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { toast, Toaster } from 'sonner';
import { useApproveRequestedExpense, useGetRequestedExpenseQuery, useRejectRequestedExpense } from '@/utlis/hooks/expense.hook';



const Expense = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const { data: requestedExpenses, isLoading, isError, isPending: selectLoading, refetch } = useGetRequestedExpenseQuery()
    const { mutate: approveRequest, isPending } = useApproveRequestedExpense()
    const { mutate: rejectRequest, isPending: rejectLoading } = useRejectRequestedExpense()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [deleteingId, setDeletingId] = useState<string>("")
    const [approvingId, setApprovingId] = useState<string>()
    const [rejectingId, setRejectingId] = useState<string>()


    const filteredExpenses = requestedExpenses?.filter((data: any) => 
        data?.status !== "Approved" && data?.status !== "Rejected"
    ) || []

    const actionTempelate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[20px] items-center'>
                <span onClick={() => { setRejectingId(rowData?._id), RejectRequestFun(rowData?._id) }} className='text-red-400 cursor-pointer'>
                    {rejectLoading && rejectingId === rowData?._id ? "Loading..." : "Reject"}
                </span>
                <span onClick={() => { setApprovingId(rowData?._id), ApproveRequestFun(rowData?._id) }} className='text-green-400 cursor-pointer'>
                    {isPending && approvingId === rowData?._id ? "Loading..." : "Approve"}
                </span>
            </div>
        )
    }

    const ApproveRequestFun = (id: string) => {
        const data = {
            id: id,
            status: "Approved"
        }
        approveRequest(data, {
            onSuccess: (data) => {
                console.log(data)
                refetch()
                toast.success('Expense approved successfully')

            },
            onError: (error) => {
                console.log(error)
                toast.error(error.message)
            }
        })
    }

    const RejectRequestFun = (id: string) => {
        const data = {
            id: id,
            status: "Rejected"
        }
        rejectRequest(data, {
            onSuccess: (data) => {
                console.log(data)
                refetch()
                toast.success('Expense rejected successfully')
            },
            onError: (error) => {
                console.log(error)
                toast.error(error.message)
            }
        })
    }

    const dateTemplate = (rowData: any) => {
        const formattedDate = new Date(rowData?.date).toLocaleDateString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedDate}</span>
            </div>
        )
    }
    const timeTemplate = (rowData: any) => {
        const formattedTime = new Date(rowData?.date).toLocaleTimeString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedTime}</span>
            </div>
        )
    }



    return (
        <div className='p-4 flex flex-col gap-[20px]'>
            <div className='w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between'>
                <div className='flex flex-row gap-[10px]'>
                    <span className='text-[18px] font-[400]'>Expenses</span>
                    <div className='p-1 px-2 rounded-[4px] bg-gray-50 '>
                        <span className='font-[500]'>{!isLoading && filteredExpenses.length}</span>
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
                {isLoading ? (
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (
                    <>
                        {filteredExpenses.length === 0 || isError ? (
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
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} suppliers"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                value={filteredExpenses.sort((a: any, b: any) => 
                                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                                )} className='w-full mt-4'>
                                <Column body={(rowData, options) => (options.rowIndex + 1).toString().padStart(3, '0')} field="code" header="#" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2  text-[14px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column field="date" header="Date" body={dateTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="date" header="Time" body={timeTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="beneficiary" header="Beneficiary" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="requested_for" header="Requested For" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="reason" header="Reason" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="total_amount_paid" header="Amount Paid" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="total_amount_to_be_paid" header="Total Amount" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="action" header="Action" body={actionTempelate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            </DataTable>

                        )}
                    </>

                )}
            </div>
        </div>
    )
}

export default Expense