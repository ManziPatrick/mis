"use client"
import { useGetSingleStockTransaction } from '@/utlis/hooks/stock.hook'
import { useParams } from 'next/navigation'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { OrbitProgress } from 'react-loading-indicators'
import { Toaster } from 'sonner'

const StockTransaction = () => {
    const params = useParams();
    const id = params?.id as string;
    const { data: transactions, isLoading, isError, error,isPending } = useGetSingleStockTransaction(id)


    const dateTemplate = (rowData: any) => {
        const formattedDate = new Date(rowData.date).toLocaleDateString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedDate}</span>
            </div>
        )
    }
    const timeTemplate = (rowData: any) => {
        const formattedTime = new Date(rowData.date).toLocaleTimeString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedTime}</span>
            </div>
        )
    }


    return (
        <div className='flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Stock  /</span>
                    <span className='text-[14px] font-[600]'>Transactions</span>
                </div>
            </div>

            <div className='w-full bg-white rounded-[6px] p-4 flex flex-row items-center justify-between'>
                <div className='flex flex-row gap-[10px] items-center'>
                    <span className='text-[14px] font-[600]'>Transactions</span>
                    <div className='px-2 bg-gray-100 py-[2px] text-[14px] font-[600]'>{!isLoading && transactions?.length}</div>
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
            {isLoading || isPending ? (
                <div className='w-full py-4'>
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                </div>

            ) : (
                isError || error ? (
                    <div className="w-full p-10 rounded-[6px] bg-white flex items-center justify-center">
                        <div className="w-full flex  items-center text-center justify-center p-2 flex-col gap-[3px]">
                            <GiEmptyWoodBucket size={60} color="lightgray" />
                            <span className="text-[16px] font-[700]">No Transaction Found</span>
                            <span className="text-[12px]">There is no transaction yet on this stock.</span>
                        </div>
                    </div>
                ) : (
                    <DataTable value={transactions} className='w-full mt-4'>
                        <Column body={(rowData, options) => (options.rowIndex + 1).toString().padStart(3, '0')} field="code" header="#" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2  text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                        <Column field='stockId.item' header="Item Name" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                        <Column field="quantity" header="Quantity" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                        <Column field="" header="Date" body={dateTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                        <Column field="" header="Time" body={timeTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                        <Column field="takenBy" header="Taken By" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                        <Column field="transactionType" header="Transaction Type" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                    </DataTable>
                )
            )}

        </div>
    )
}

export default StockTransaction