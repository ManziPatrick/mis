"use client"
import { useGetPettyChash } from '@/utlis/hooks/expense.hook'
import React from 'react'

const Transactions = () => {
    const {data: petty_chash,isLoading: petty_loading,isPending: petty_pending} = useGetPettyChash()
    console.log("petty_cash", petty_chash)
    
    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
        <div className='w-full items-center justify-between flex flex-row'>
            <div className='flex flex-row gap-[4px] items-center'>
                <span className='text-[12px]'>Finance  /</span>
                <span className='text-[12px] font-[600]'>Expenses</span>
            </div>
        </div>
            <div className='w-full grid grid-cols-4 gap-[20px] items-center'>
                <div className='p-4 rounded-[6px] gap-[18px] w-full bg-white flex flex-col'>
                    <div className='flex flex-row items-end gap-[4px]'>
                        <span className='text-[18px] font-[400]'>My Balance</span>
                        <span className='text-[10px] text-[gray]'>/Petty Cash</span>
                    </div>
                    <div className='flex flex-row gap-[4px] items-center'>
                        <h1 className='text-[20px] font-[600]'>200 0000 000</h1>
                        <span className='text-[14px] text-[gray]'>/frw</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transactions