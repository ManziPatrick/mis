"use client"
import Cards from '@/components/reusable/Cards'
import { ExpenseChart } from '@/components/reusable/ExpenseChart'
import { RequestChart } from '@/components/reusable/RequestChart'
import { useGetAllEmployees } from '@/utlis/hooks/empoyees.hook'
import { useGetPettyChash } from '@/utlis/hooks/expense.hook'
import { useGetAllApprovedRequest, useGetAllPendingApprovals, useGetAllRejectedRequest, useGetPettyCashReport } from '@/utlis/hooks/report.hook'
import { useGetAllSuppiers } from '@/utlis/hooks/suppliers.hook'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { parse, format } from "date-fns";

const SuperAdmin = () => {
    const [petty_cash_sum, set_petty_cash_sum] = useState<number>(0)
    const [year, setYear] = useState<string>("")
    const [allRequest, setAllRequest] = useState<number>(0)
    const [totalReject, setTotalReject] = useState<number>(0)
    const [totalApprove, setTotalApprove] = useState<number>(0)
    const { data: employees, isLoading: empLoading } = useGetAllEmployees()
    const { data: suppliers, isLoading: suppLoading } = useGetAllSuppiers()
    const { data: pettyCashReport, isLoading: pettyChashLoading } = useGetPettyCashReport()
    const { data: pendingApprovals, isLoading: pendingLoading } = useGetAllPendingApprovals()
    const { data: approvedRequest, isLoading: approvedLoading } = useGetAllApprovedRequest()
    const { data: rejectedRequest, isLoading: rejectedLoading } = useGetAllRejectedRequest()
    const { data: petty_cash, isLoading: pettyIsLoading, isPending: pettyIsPending, isError: pettyIsError, error: pettyError, refetch } = useGetPettyChash()
    const [type, setType] = useState<string>("monthly")
    const newDate = new Date().toLocaleDateString()
    const formattedDate = format(parse(newDate, "M/d/yyyy", new Date()), "yyyy-MM-dd");
    const [pettchashDate, setPettyChashDate] = useState<string | null>(formattedDate)

    


    useEffect(() => {
        if (petty_cash) {
            const length = petty_cash.length - 1
            set_petty_cash_sum(petty_cash[length].amount_balance)
        }
    }, [petty_cash, refetch]);


    useEffect(() => {
        if (pendingApprovals && !pendingLoading) {
            const totalRequest = pendingApprovals.overall.employee + pendingApprovals.overall.finance +
                pendingApprovals.overall.library + pendingApprovals.overall.supplier
            setAllRequest(totalRequest)
        }
        if (rejectedRequest && !rejectedLoading) {
            const totalReject = rejectedRequest.overall.employee + rejectedRequest.overall.finance +
                rejectedRequest.overall.library + rejectedRequest.overall.supplier
            setTotalReject(totalReject)
        }
        if (approvedRequest && !approvedLoading) {
            const totalApprove = approvedRequest.overall.employee + approvedRequest.overall.finance +
                approvedRequest.overall.librarye + approvedRequest.overall.supplier
            setTotalApprove(totalApprove)
        }
    }, [pendingApprovals, approvedRequest, rejectedRequest])

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };


    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Super Admin  /</span>
                    <span className='text-[14px] font-[600]'>Dashboard</span>
                </div>
            </div>
            <div className=' grid grid-cols-3 gap-[20px]'>
            <Cards color={"bg-[#ff5a60]"} icon={<Icon icon="tdesign:money" className='text-white' width="24" height="24" />} title={"Petty Cash"} value={pettyIsLoading ? "..." : (formatNumber(pettyCashReport?.summaryReport?.overall.balance))} />
            <Cards color={"bg-blue-400"} icon={<Icon icon="clarity:employee-group-line" className='text-white' width="24" height="24" />} title={"Employees"} value={employees ? (formatNumber(employees.length)) : 0} />
            <Cards color={"bg-[#ff5a60]"} icon={<Icon icon="carbon:scis-transparent-supply" className='text-white' width="24" height="24" />} title={"Suppliers"} value={employees ? (formatNumber(suppliers?.supplier.length)) : 0} />

            </div>

            <div className='w-full flex flex-row gap-[20px]'>
                <div className='w-full  overflow-hidden border rounded-[6px] bg-white'>
                    <div className='w-full flex flex-row items-center justify-between p-4'>
                        <span className='font-[700]'>Income & Expense</span>
                        <div className='flex flex-row items-center gap-[20px]'>
                            <div className='flex flex-col gap-[2px]'>
                                <h1 className='text-[14px] font-[600]'>Total Income</h1>
                                <div className='flex flex-row items-center gap-[10px]'>
                                    <span className=' italic text-[13px]'>Max</span>
                                    <span className='text-[13px]'>{!pettyChashLoading && pettyCashReport?.summaryReport?.overall.totalIncome} frw</span>
                                </div>
                            </div>
                            <div className='flex flex-col gap-[2px]'>
                                <h1 className='text-[14px] font-[600]'>Total Expense</h1>
                                <div className='flex flex-row items-center gap-[10px]'>
                                    <span className=' italic text-[13px]'>Max</span>
                                    <span className='text-[13px]'>{!pettyChashLoading && pettyCashReport?.summaryReport?.overall.totalExpense} frw</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-end'>
                    <div className='flex flex-row items-center justify-end py-2'>
                            <select name="" onChange={(e: any) => setYear(e.target.value)} id="" className='p-3  border mr-4 bg-gray-50'>
                                <option value="curentYear">Current Year</option>
                                <option value="lastYear">Previous Year</option>
                            </select>
                            <select onChange={(e: any) => setType(e.target.value)} name="" id="" className='p-3  border mr-4 bg-gray-50'>
                                <option value="monthly">Monthly Report</option>
                                <option value="daily">Daily Report</option>
                            </select>
                            {type == "daily" && (
                                <input type='date' name='date' onChange={(e: any) => setPettyChashDate(e.target.value)} />
                            )}
                        </div>
                    </div>
                    <div className='w-full h-[46vh]  overflow-hidden border rounded-[6px] mt-2'>
                        <ExpenseChart year={year} data={pettyCashReport} date={pettchashDate!} type={type} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuperAdmin