"use client"
import { useGetAllTransaction } from '@/utlis/hooks/stock.hook'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Sidebar } from 'primereact/sidebar'
import React, { useState } from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { FaRegEye, FaRegPenToSquare } from 'react-icons/fa6'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { OrbitProgress } from 'react-loading-indicators'
import { FcMoneyTransfer } from "react-icons/fc";

const Transaction = () => {
    const { data: transactions, isLoading, isError, error } = useGetAllTransaction()
    const [visibleRight, setVisibleRight] = useState<boolean>(false)
    const [transactionDetails, setTransactionDetails] = useState<any>(null)
    const [search, setSearch] = useState<string>("")

    const filteredTransactions = React.useMemo(() => {
        if (!transactions) return [];
        if (search) {
            return transactions.filter((t: any) => 
                t.stockId?.item?.toLowerCase().includes(search.toLowerCase()) ||
                t.transactionSource?.toLowerCase().includes(search.toLowerCase()) ||
                (t.itemPrices?.some((p: any) => p.itemName?.toLowerCase().includes(search.toLowerCase())))
            );
        }
        return transactions;
    }, [transactions, search]);

    const actionTempelate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[10px] items-center'>
                <span className=' cursor-pointer px-2 border p-2 rounded-[4px] hover:bg-gray-100' onClick={() => { setTransactionDetails(rowData); setVisibleRight(true) }}><FaRegEye size={20} /></span>
            </div>
        )
    }


    const dateTemplate = (rowData: any) => {
        const date = new Date(rowData.date);
        const datePart = date.toISOString().split('T')[0];
        const timePart = date.toISOString().split('T')[1].split('Z')[0];
        return (
            <div className='flex flex-row gap-[10px] items-center'>
                <span>{datePart}</span>
                <span>{timePart}</span>
            </div>
        )
    }
    const itemNameTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[10px]'>
                {rowData.stockId && <span>{rowData.stockId.item}</span>}

                {rowData?.itemPrices?.length > 0 && <span>Uniforms</span>}
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
            <div className='flex flex-row gap-[10px] bg-white  items-center justify-between p-4 rounded-[6px]'>
                <div className='flex flex-row gap-[10px] items-center'>

                    <div className='flex flex-row gap-[4px] items-center'>
                        <h1 className='text-[16px] font-[600]'>Transactions</h1>
                        <span className='p-2 bg-gray-100 rounded-[4px]'>{!isLoading && filteredTransactions?.length}</span>
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
                        <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" className='text-[13px] rounded-[6px] outline-none' placeholder='Search' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col bg-white w-full'>
                {isLoading ? (
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (<>
                    {filteredTransactions?.length === 0 ? (
                        <div className='w-full flex items-center text-center justify-center p-10 flex-col gap-[3px]'>
                            <GiEmptyWoodBucket size={60} color='lightgray' />
                            <span className='text-[16px] font-[700]'>No Transaction Avaliable</span>
                            <span className='text-[12px]'>There is no transation yet Get back soon when you made any transtion </span>

                        </div>

                    ) : (

                        <DataTable
                            paginator
                            rows={10}
                            rowsPerPageOptions={[10, 20, 40]}
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            value={filteredTransactions} className='w-full mt-4'>
                            <Column body={(rowData, options) => (options.rowIndex + 1).toString().padStart(3, '0')} field="code" header="#" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2  text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field='' header="Date" body={dateTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            <Column field='stockId.item' header="Item Name" body={itemNameTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            <Column field="quantity" header="Quantity" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            <Column field="newQuantity" header="New Quantity" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            <Column field="totalPrice" header="Total Price" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                            <Column field="transactionSource" header="Source" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] uppercase p-2 text-[12px] border-b"}></Column>
                            <Column field="transactionType" header="Type" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] uppercase p-2 text-[12px] border-b"}></Column>
                            <Column header="Action" body={actionTempelate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                        </DataTable>
                    )}
                </>)}
            </div>
            <Sidebar className='w-1/3' visible={visibleRight} position="right" header='Transaction Details' onHide={() => setVisibleRight(false)}>
                <div className='flex flex-col gap-[10px] py-4'>
                    <div className='w-full border p-4 flex flex-row gap-[20px] items-center justify-between rounded-[12px]'>
                        <div className='flex flex-row gap-[10px] items-center'>
                            <FcMoneyTransfer size={30} />
                            <span className='text-[18px] font-[600]'>Total Price</span>
                        </div>
                        <div className='flex felx-row gap-[10px] items-center'>
                            <span className='text-[18px] font-[600]'>{transactionDetails?.totalPrice}</span>
                            <span className='text-[14px] font-[400]'>Frw</span>
                        </div>
                    </div>
                    <div className='flex flex-row pt-4'>
                        <h1 className='text-[16px] font-[600]'>Transaction Information</h1>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-[14px] font-[400]'>Transaction Type: </span>
                        <span className='text-[14px] font-[400]'>{transactionDetails?.transactionType}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-[14px] font-[400]'>Delivered Quantity: </span>
                        <span className='text-[14px] font-[400]'>{transactionDetails?.quantity}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-[14px] font-[400]'>New Quantity: </span>
                        <span className='text-[14px] font-[400]'>{transactionDetails?.newQuantity}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-[14px] font-[400]'>Source: </span>
                        <span className='text-[14px] font-[400]'>{transactionDetails?.transactionSource}</span>
                    </div>

                    {transactionDetails?.itemPrices?.length > 0 &&
                        <div className='flex flex-col gap-[10px]  justify-between'>
                            <h1 className='text-[16px] font-[600]'>Uniforms</h1>
                            {transactionDetails?.itemPrices?.map((item: any, index: number) => (
                                <div className='flex flex-col gap-[10px]  justify-between px-4'>
                                    <h1 className='text-[14px] font-[600]'>Uniform {index + 1}</h1>
                                    <div className='flex flex-col gap-[10px] items-center justify-between w-full px-3'>
                                            <div className='flex flex-row gap-[10px] items-center justify-between w-full'>
                                                <span className='text-[14px] font-[400]'>{`Uniform Name`}</span>
                                                <span className='text-[14px] font-[400]'>{item?.itemName}</span>
                                            </div>
                                            <div className='flex flex-row gap-[10px] items-center justify-between w-full'>
                                                <span className='text-[14px] font-[400]'>{`Quantity`}</span>
                                                <span className='text-[14px] font-[400]'>{item?.quantity}</span>
                                            </div>
                                            <div className='flex flex-row gap-[10px] items-center justify-between w-full'>
                                                <span className='text-[14px] font-[400]'>{`Price`}</span>
                                                <span className='text-[14px] font-[400]'>{item?.price} Rwf</span>
                                            </div>
                                            <div className='flex flex-row gap-[10px] items-center justify-between w-full'>
                                                <span className='text-[14px] font-[400]'>{`Total Price`}</span>
                                                <span className='text-[14px] font-[400]'>{item?.price * item?.quantity} Rwf</span>
                                            </div>

                                    </div>
                                </div>
                            ))}
                        </div>}
                </div>


            </Sidebar>
        </div>
    )
}

export default Transaction