"use client"
import { ExpenseChart } from '@/components/reusable/ExpenseChart'
import { RequestChart } from '@/components/reusable/RequestChart'
import { useGetPettyChash } from '@/utlis/hooks/expense.hook'
import { useGetAllApprovedRequest, useGetAllPendingApprovals, useGetAllRejectedRequest, useGetPettyCashReport } from '@/utlis/hooks/report.hook'
import React, { useEffect, useState } from 'react'
import { parse, format } from "date-fns";

const Dashbaord = () => {
    const [petty_cash_sum, set_petty_cash_sum] = useState<number>(0)
    const [year, setYear] = useState<string>("")
    const [type, setType] = useState<string>("monthly")
    const newDate = new Date().toLocaleDateString()
    const formattedDate = format(parse(newDate, "M/d/yyyy", new Date()), "yyyy-MM-dd");
    const [pettchashDate, setPettyChashDate] = useState<string | null>(formattedDate)
    const [totalPending, setTotalPending] = useState<number>(0)
    const [totalRejected, setTotalRejected] = useState<number>(0)
    const [totalApproved, setTotalApproved] = useState<number>(0)

    const { data: pettyCashReport, isLoading: pettyChashLoading } = useGetPettyCashReport()
    const { data: pendingApprovals, isLoading: pendingLoading } = useGetAllPendingApprovals()
    const { data: approvedRequest, isLoading: approvedLoading } = useGetAllApprovedRequest()
    const { data: rejectedRequest, isLoading: rejectedLoading } = useGetAllRejectedRequest()
    const { data: petty_cash, isLoading: pettyIsLoading, isPending: pettyIsPending, isError: pettyIsError, error: pettyError, refetch: pettyRefetch } = useGetPettyChash()

    useEffect(() => {
        if (petty_cash) {
            const length = petty_cash.length - 1
            set_petty_cash_sum(petty_cash[length].amount_balance)
        }
    }, [petty_cash]);

    useEffect(() => {
        if (pendingApprovals && approvedRequest && rejectedRequest) {
            setTotalPending(pendingApprovals?.overall.employee + pendingApprovals?.overall.finance + pendingApprovals?.overall.library + pendingApprovals?.overall.supplier)
            setTotalRejected(rejectedRequest?.overall.employee + rejectedRequest?.overall.finance + rejectedRequest?.overall.library + rejectedRequest?.overall.supplier)
            setTotalApproved(approvedRequest?.overall.employee + approvedRequest?.overall.finance + approvedRequest?.overall.library + approvedRequest?.overall.supplier)
        }

    }, [pendingApprovals, rejectedRequest, approvedRequest])

    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Finance  /</span>
                    <span className='text-[14px] font-[600]'>Dashboard</span>
                </div>
            </div>
            <div className=' grid grid-cols-4 gap-[20px]'>
                <div className='flex p-4 items-center bg-white flex-col gap-[4px] border rounded-[6px]'>
                    <div className='flex flex-row items-end gap-[2px]'>
                        <span className='text-[28px] font-[600]'>{petty_cash_sum}</span>
                        <span className='text-[14px]'>/ Frw</span>
                    </div>
                    <span className='text-[14px] font-[500]'>Petty Cash</span>
                </div>
                <div className='flex p-4 items-center bg-white flex-col gap-[4px] border rounded-[6px]'>
                    <span className='text-[28px] font-[600]'>10</span>
                    <span className='text-[14px] font-[500]'>Requested Expense</span>
                </div>
            </div>
            <div className='w-full flex flex-row gap-[20px]'>
                <div className='w-[60%]  overflow-hidden border rounded-[6px] bg-white'>
                    <div className='w-full flex flex-row items-center justify-between p-4'>
                        <span className='font-[700]'>Income & Expense</span>
                        <div className='flex flex-row items-center gap-[20px]'>
                            <div className='flex flex-col gap-[2px]'>
                                <h1 className='text-[14px] font-[600]'>Total Income</h1>
                                <div className='flex flex-row items-center gap-[10px]'>
                                    <span className=' italic text-[13px]'>Max</span>
                                    <span className='text-[13px]'>20 000 000 frw</span>
                                </div>
                            </div>
                            <div className='flex flex-col gap-[2px]'>
                                <h1 className='text-[14px] font-[600]'>Total Expense</h1>
                                <div className='flex flex-row items-center gap-[10px]'>
                                    <span className=' italic text-[13px]'>Max</span>
                                    <span className='text-[13px]'>13 000 000 frw</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-end py-2'>
                        <select name="" onChange={(e: any) => setYear(e.target.value)} id="" className='p-3  border mr-4 bg-gray-50'>
                            <option value="curentYear">Current Year</option>
                            <option value="lastYear">Previous Year</option>
                        </select>
                        <select onChange={(e:any)=> setType(e.target.value)} name="" id="" className='p-3  border mr-4 bg-gray-50'>
                            <option value="monthly">Monthly Report</option>
                            <option value="daily">Daily Report</option>
                        </select>
                        {type == "daily" && (
                            <input type='date' name='date' onChange={(e:any)=> setPettyChashDate(e.target.value)} />
                        )}
                    </div>
                    <div className='w-full h-[46vh]  overflow-hidden border rounded-[6px]'>
                        <ExpenseChart data={pettyCashReport} year={year} type={type} date={pettchashDate!} />
                    </div>
                </div>
                <div className='w-[40%] border p-4 bg-white rounded-[6px]'>
                    <RequestChart pending={totalPending} rejected={totalRejected} approved={totalApproved} />
                </div>
            </div>
        </div>
    )
}

export default Dashbaord