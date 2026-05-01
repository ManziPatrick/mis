"use client"
import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilterLeft, BsFilterSquareFill } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { FaUserPlus } from 'react-icons/fa6'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useGetAllUniformPaymentQuery, userCreateUniformPaymentMutation } from '@/utlis/hooks/payment.hook'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { OrbitProgress } from 'react-loading-indicators'
import FinanceNewUniformPayment from '@/components/reusable/FinanceUniformPayment '
import { useFinanceUniformStock } from '@/utlis/hooks/stock.hook'


const Uniform = () => {

    const [isNewOpen, setIsNewOpen] = useState<boolean>(false)

    const { data: uniformPayment, isLoading: uniformLoading, refetch: uniformRefetch } = useGetAllUniformPaymentQuery()
    const { mutate: uniformMutate, isPending } = userCreateUniformPaymentMutation()
    const item = "full uniform"
    const { data: uniformStock, isLoading: uniformStockLoading } = useFinanceUniformStock(item)

    const actionTemplate = () => {
        return (
            <div className=' flex flex-row'>
                <span className='px-[5px] py-[3px] border hover:bg-green-200 font-[500] cursor-pointer'>View</span>
            </div>
        )
    }
    const amountTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[10px] items-center'>
                <span className='text-[13px] font-[500]'>{rowData.amountPaid}</span>
                <span className='text-[13px] font-[300]'>frw</span>

            </div>
        )
    }
    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Finance  /</span>
                    <span className='text-[14px] font-[600]'>Uniform</span>
                </div>
                <Button onClick={() => setIsNewOpen(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-6 py-3 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                    +
                    Add Uniform Payment
                </Button>
            </div>
            <div className='flex flex-row gap-[10px]  items-center justify-between bg-white p-4 rounded-[6px]'>
                <h1 className='text-[16px] font-[600]'>uniform payments</h1>
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
            <div className=' bg-white flex flex-col gap-[10px]'>
                {uniformLoading || uniformStockLoading ? (
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (<>
                    {uniformPayment.length == 0 ? (
                        <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                            <GiEmptyWoodBucket size={60} color='lightgray' />
                            <span className='text-[16px] font-[700]'>No Uniform Payment Available</span>
                            <span className='text-[12px]'>There is no payment yet but you can create new one </span>
                            <Button onClick={() => setIsNewOpen(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                                +
                                Add Uniform Payment
                            </Button>

                        </div>
                    ) : (
                        <DataTable value={uniformPayment} className='w-full'>
                            <Column body={(rowData, options) => (options.rowIndex + 1).toString().padStart(3, '0')} field="code" header="#" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2  text-[14px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column header="Name" field='name' headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field="faculty" header="Faculty" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field="level" header="Level" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field="amountPaid" header="Amount Paid" body={amountTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field="status" header="status" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field="Action" header="Action" body={actionTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                        </DataTable>
                    )}
                </>)}


            </div>
            <FinanceNewUniformPayment isOpen={isNewOpen} setIsOpen={setIsNewOpen} reFetch={uniformRefetch} uniforms={uniformStock || []} />
        </div>
    )
}

export default Uniform