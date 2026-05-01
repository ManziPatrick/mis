"use client"
import { useGetAllTransaction } from '@/utlis/hooks/stock.hook'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { OrbitProgress } from 'react-loading-indicators'
import { Toaster } from 'sonner'

const Transaction = () => {
    const { data: transactions, isLoading, isError, error } = useGetAllTransaction()

    const actionTempelate = (rowData: any)=>{
        return(
            <div className='flex flex-row gap-[10px] items-center'>
                <span className='px-[5px] py-[2px] text-[12px] border cursor-pointer hover:bg-green-300'>View</span>
            </div>
        )
    }

    const dateTemplate = (rowData: any)=>{
        const date = new Date(rowData.date);
        const datePart = date.toISOString().split('T')[0]; 
        const timePart = date.toISOString().split('T')[1].split('Z')[0];
        return(
            <div className='flex flex-row gap-[10px] items-center'>
                <span>{datePart}</span>
                <span>{timePart}</span>
            </div>
        )
    }
    return (
        <div className='flex flex-col gap-[20px] p-4'>
            <Toaster position="top-right" />
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Superadmin  /</span>
                    <span className='text-[14px] font-[600]'>Transactions</span>
                </div>
            </div>
            <div className='flex flex-row gap-[10px] bg-white  items-center justify-between p-4 rounded-[6px]'>
                <div className='flex flex-row gap-[10px] items-center'>

                    <div className='flex flex-row gap-[4px] items-center'>
                        <h1 className='text-[16px] font-[600]'>Transactions</h1>
                        <span className='p-2 bg-gray-100 rounded-[4px]'>{!isLoading && transactions?.length}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center'></div>
                </div>
                <div className='flex flex-row items-center gap-[10px]'>
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
            <div className='flex flex-col bg-white w-full'>
                {isLoading ? (
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (<>
                    {transactions?.length === 0 ? (
                        <div className='w-full flex items-center text-center justify-center p-10 flex-col gap-[3px]'>
                            <GiEmptyWoodBucket size={60} color='lightgray' />
                            <span className='text-[16px] font-[700]'>No Transaction Avaliable</span>
                            <span className='text-[12px]'>There is no transation yet Get back soon when you made any transtion </span>

                        </div>

                    ) : (

                        <DataTable value={transactions} className='w-full mt-4'>
                            <Column body={(rowData, options) => (options.rowIndex + 1).toString().padStart(3, '0')} field="code" header="#" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2  text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field='' header="Date" body={dateTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            <Column field='stockId.item' header="Item Name" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            <Column field="quantity" header="Quantity" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            <Column field="stockId.amountPaid" header="Amount Paid" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            <Column field="transactionType" header="Type" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            <Column header="Action" body={actionTempelate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                        </DataTable>
                    )}
                </>)}
            </div>


        </div>
    )
}

export default Transaction