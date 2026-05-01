"use client"
import { useGetAllPayments } from '@/utlis/hooks/expense.hook'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilterSquareFill } from 'react-icons/bs'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { OrbitProgress } from 'react-loading-indicators'

const Payments = () => {
    const { data: payments, isLoading, isError, error } = useGetAllPayments()

    const dateTemplate = (rowData: any) => {
        const formattedDate = new Date(rowData.paymentDate).toLocaleDateString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedDate}</span>
            </div>
        )
    }
    const timeTemplate = (rowData: any) => {
        const formattedTime = new Date(rowData.paymentDate).toLocaleTimeString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedTime}</span>
            </div>
        )
    }

    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[12px]'>Super Admin  /</span>
                    <span className='text-[12px] font-[600]'>Payments</span>
                </div>
            </div>

            <div className="w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between">
                <div className="flex flex-row gap-[10px]">
                    <span className="text-[18px] font-[400]">Payments</span>
                    <div className="p-1 px-2 rounded-[4px] bg-gray-50">
                        <span className="font-[500]">{payments?.length || 0}</span>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-[10px]">
                    <div className="flex flex-row border items-center gap-[10px] rounded-[12px] p-2">
                        <BiSearch />
                        <input
                            type="text"
                            placeholder="Search something"
                            className="outline-none"
                        />
                    </div>
                    <div className="p-2 cursor-pointer">
                        <BsFilterSquareFill color="black" size={20} />
                    </div>
                </div>
            </div>
            {isLoading ? (
                <div className="w-full p-10 rounded-[6px] bg-white flex items-center justify-center">

                    <div className="w-full p-10 flex items-center justify-center">
                        <OrbitProgress color="#2E3487" size="small" />
                    </div>
                </div>
            ) : (
                <>
                    {isError || error ? (
                        <div className="w-full p-10 rounded-[6px] bg-white flex items-center justify-center">
                            <div className="w-full flex  items-center text-center justify-center p-2 flex-col gap-[3px]">
                                <GiEmptyWoodBucket size={60} color="lightgray" />
                                <span className="text-[16px] font-[700]">No Payments Found</span>
                                <span className="text-[12px]">There is no payments yet.</span>
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            paginator
                            rows={10}
                            rowsPerPageOptions={[10, 20, 40]}
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            value={payments?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
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
                                field="payeeName"
                                header="Payee Name"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="payeeType"
                                header="Payee Type"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="reason"
                                header="Reason"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="paymentDate"
                                header="Payment Date"
                                body={dateTemplate}
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="paymentDate"
                                header="Payment Time"
                                body={timeTemplate}
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="amountPaid"
                                header="Amount Paid"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="totalAmount"
                                header="Total Amount"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="remainingBalance"
                                header="Remaining Amount"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                        </DataTable>
                    )}
                </>
            )}

        </div>
    )
}

export default Payments