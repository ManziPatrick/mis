"use client"
import Cards from '@/components/reusable/Cards'
import { useGetLowStock } from '@/utlis/hooks/report.hook'
import { useGetAllAssets, useGetAllStock, useGetAllTransaction } from '@/utlis/hooks/stock.hook'
import { Button } from 'primereact/button'
import { Icon } from "@iconify/react"
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { RiStockLine } from "react-icons/ri";
import { OrbitProgress } from 'react-loading-indicators'

const StockHome = () => {
    const [totalStockIn, setTotalStockIn] = useState<number>(0)
    const [totalStockOut, setTotalStockOut] = useState<number>(0)
    const [totalStock, setTotalStock] = useState<number>(0)
    const [totalAsset, setTotalAsset] = useState<number>(0)

    const { data: lowStocks, isLoading: lowLoading, isError: lowError } = useGetLowStock()
    const { data: transactions, isLoading: transactionLoading, isError: transactionIsError } = useGetAllTransaction()
    const { data: assets } = useGetAllAssets()
    const { data: stocks } = useGetAllStock()

    useEffect(() => {
        if (transactions) {
            const stockIn: any[] = transactions?.filter((trans: any) => trans?.transactionType == "IN")
            setTotalStockIn(stockIn.length)
            const stockOut: any[] = transactions?.filter((trans: any) => trans?.transactionType == "OUT")
            setTotalStockOut(stockOut.length)
        }
        if (assets) {
            const assetTotal = assets?.assets?.length
            setTotalAsset(assetTotal)
        }
        if (stocks) {
            const stockTotal = stocks?.length
            setTotalStock(stockTotal)
        }
    }, [transactions, transactionLoading, assets, stocks])
    return (
        <div className='flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[12px]'>Stock  /</span>
                    <span className='text-[12px] font-[600]'>Dashbaord</span>
                </div>
            </div>
            <div className=' grid grid-cols-4 gap-[20px]'>
                <Cards value={totalStock} icon={<RiStockLine size={32} className='text-blue-600' />} title={"Total stock"} color={"bg-blue-200"} />
                <Cards value={totalAsset} icon={<Icon icon="material-symbols:event-available" width="24" height="24" className='text-sky-600' />} title={"Total assets"} color={"bg-sky-200"} />
                <Cards value={totalStockIn} icon={<Icon icon="hugeicons:package-out-of-stock" width="24" height="24" className='text-purple-600' />} title={"Stock In"} color={"bg-purple-200"} />
                <Cards value={totalStockOut} icon={<Icon icon="ph:box-arrow-down-thin" width="24" height="24" className='text-red-600' />} title={"Stock Out"} color={"bg-red-200"} />

            </div>
            <div className='w-full flex flex-col gap-[10px] bg-white rounded-[12px] p-6'>
                {lowLoading ? (
                    <div className='w-full p-20 flex items-center justify-center '>
                        <div className='w-full p-10 flex items-center justify-center'>
                            <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                        </div>
                    </div>
                ) : (<>
                    {!lowStocks || lowError ? (
                        <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                            <GiEmptyWoodBucket size={60} color='lightgray' />
                            <span className='text-[16px] font-[700]'>No Low stocks found</span>
                            <span className='text-[12px]'>There is no low stock yet </span>
                        </div>
                    ) : (
                        <>
                            <div className='w-full flex flex-row gap-[10px] items-center justify-between'>
                                <span className='text-[16px] font-[600] text-black'>Low Stocks</span>
                                <a href="" className='text-[12px] font-[600] text-blue-500 uppercase'>View All</a>
                            </div>
                            <DataTable
                                paginator
                                rows={10}
                                rowsPerPageOptions={[10, 20, 40]}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                value={lowStocks} className='w-full mt-4'>
                                <Column body={(rowData, options) => (options.rowIndex + 1).toString().padStart(3, '0')} field="code" header="#" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2  text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column field='itemName' header="Item Name" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column field="category" header="Category" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column field="quantity" header="Quantity" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            </DataTable>
                        </>
                    )}
                </>)}
            </div>
        </div>
    )
}

export default StockHome