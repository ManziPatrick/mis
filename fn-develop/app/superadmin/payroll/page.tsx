"use client"
import { useGetAllPayments, useGetAllPayroll } from '@/utlis/hooks/expense.hook'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilterSquareFill } from 'react-icons/bs'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { OrbitProgress } from 'react-loading-indicators'

const Payroll = () => {
    const {data: payrolls,isLoading: payrollLoading,isError, error} = useGetAllPayroll()


    const dateTemplate = (rowData: any) => {
        const formattedDate = new Date(rowData.date).toLocaleDateString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedDate}</span>
            </div>
        )
    }

    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[12px]'>Superadmin  /</span>
                    <span className='text-[12px] font-[600]'>Payroll</span>
                </div>
            </div>

            <div className="w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between">
                <div className="flex flex-row gap-[10px]">
                    <span className="text-[18px] font-[400]">Payrolls</span>
                    <div className="p-1 px-2 rounded-[4px] bg-gray-50">
                        <span className="font-[500]">{payrolls?.length || 0}</span>
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
            {payrollLoading ? (
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
                                <span className="text-[16px] font-[700]">No Payroll Found</span>
                                <span className="text-[12px]">There is no payroll yet.</span>
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            paginator
                            rows={10}
                            rowsPerPageOptions={[10, 20, 40]}
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            value={payrolls?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
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
                                field="name"
                                header="Name"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                              <Column
                                field="date"
                                header="Date"
                                body={dateTemplate}
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="netSalary"
                                header="Net Salary"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="advance"
                                header="Advance"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="remainingAmount"
                                header="Remaining Amount"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="status"
                                header="Status"
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

export default Payroll