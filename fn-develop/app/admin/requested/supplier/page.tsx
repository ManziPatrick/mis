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
import { useApproveRequestedExpense, useGetRequestedExpenseQuery } from '@/utlis/hooks/expense.hook';
import { useApproveSupplier, useGetAllSuppiers } from '@/utlis/hooks/suppliers.hook';



const Supplier = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const { data: requestedExpenses, isLoading, isError, isPending: selectLoading, refetch } = useGetRequestedExpenseQuery()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [deleteingId, setDeletingId] = useState<string>("")
    const [approvingId, setApprovingId] = useState<number>()

    const { data: suppliers, isLoading: supplierLoading, refetch: supplierRefetch } = useGetAllSuppiers()
    const { mutate: approveMutate, isPending } = useApproveSupplier()

    console.log("suppliers", suppliers)



    const actionTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[20px] items-center'>
                <span className=' cursor-pointer text-[12px] hover:bg-red-200 font-[500] px-[10px] py-[3px] border'>Reject</span>
                <span onClick={() => { setApprovingId(rowData._id), ApproveRequestFun(rowData._id) }} className=' cursor-pointer text-[12px] hover:bg-green-200 font-[500] px-[5px] py-[3px] border'>
                    {isPending && approvingId === rowData._id ? "Loading..." : "Approve"}
                </span>
            </div>
        )
    }

    const ApproveRequestFun = (id: string) => {
        const data = {
            id: id,
            status: "approved"
        }
        approveMutate(data, {
            onSuccess: (data) => {
                console.log(data)
                supplierRefetch()
                toast.success(data.message)

            },
            onError: (error:any) => {
                const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
                toast.error(errorMessage);
            }
        })
    }




    return (
        <div className='p-4 flex flex-col gap-[20px]'>
            <div className='w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between'>
                <div className='flex flex-row gap-[10px] items-center'>
                    <span className='text-[16px] font-[400]'>Suppliers</span>
                    <div className='p-1 px-2 rounded-[4px] bg-gray-50 '>
                        <span className='font-[500]'>{!isLoading && suppliers?.supplier.filter((data: any) => data.status !== "approved").length}</span>
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
                {supplierLoading ? (
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (
                    <>
                        {suppliers?.supplier?.filter((data: any) => data.status !== "approved").length == 0 ? (
                            <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                                <GiEmptyWoodBucket size={60} color='lightgray' />
                                <span className='text-[16px] font-[700]'>No Request Avaliable</span>
                                <span className='text-[12px]'>There is no any request yet</span>
                            </div>
                        ) : (
                            <DataTable value={suppliers.supplier.filter((data: any) => data.status !== "approved")} className='w-full mt-4'>
                                <Column field="code" header="Code" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2  text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="name" header="Name" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="email" header="Email" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="phone" header="Phone" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                {/* <Column field="address" header="Address" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400] ' bodyClassName={"h-[8vh] p-2 text-[12px] border-b line"}></Column> */}
                                <Column field="commodity" header="Commodity" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="status" header="Status" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="Action" header="Action" body={actionTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="View" header="View" body={<div>View</div>} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            </DataTable>

                        )}
                    </>

                )}
            </div>
        </div>
    )
}

export default Supplier