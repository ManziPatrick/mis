"use client"
import React from 'react'
import Image from 'next/image'
import { MdDashboardCustomize } from "react-icons/md";
import { FaMoneyCheckDollar, FaUsers } from "react-icons/fa6";
import { RiLogoutBoxFill, RiSecurePaymentLine } from 'react-icons/ri';
import { MdOutlinePassword } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { GrTransaction } from 'react-icons/gr';
import { GiClothes } from 'react-icons/gi';
import Link from "next/link"
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Logout from '@/utlis/action/Logout';


const FinanceSidebar = () => {
    const pathname = usePathname()
    const confirmLogout = () => {
        confirmDialog({
            message: 'Are you sure you want to logout',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptLabel: 'Yes, Logout',
            rejectLabel: 'Cancel',
            acceptClassName: ' bg-red-400 text-white p-3 text-[13px] ',
            rejectClassName: ' inline-block mr-2 text-[13px] bg-blue-400 text-white p-3 ',

            accept: () => ApproveLogout(),
        });
    };

    const ApproveLogout = async () => {
        Logout()
    }
    return (
        <div className='flex flex-col gap-[20px] bg-[#2E3487] w-full min-h-[100vh] justify-between pb-4'>
            <div className='flex flex-col gap-[10px]'>

                <div className='w-full p-4  bg-white'>
                    <Link href="">
                        <Image src={`/image/logo.png`} loading={'lazy'} width={1000} height={1000} className='w-[150px]' alt='log' />
                    </Link>
                </div>
                <div className='flex flex-col gap-[20px] px-4'>
                    <Link href='/finance' className={`${pathname == "/finance" ? "p-4 rounded-[12px] bg-white text-black" : " text-white px-4"} flex flex-row items-center gap-[10px] `}>
                        <MdDashboardCustomize size={18} />
                        <span className='text-[14px] font-[400]'>Dashbaord</span>
                    </Link>
                    <Link href='/finance/expenses' className={`${pathname == "/finance/expenses" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                        <FaUsers size={20} />
                        <span className='text-[16px] font-[400]'>Expenses</span>
                    </Link>
                    <Link href='/finance/received-money' className={`${pathname == "/finance/received-money" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                        <FaMoneyCheckDollar size={20} />
                        <span className='text-[16px] font-[400]'>Received Money</span>
                    </Link>
                    <Link href='/finance/payroll' className={`${pathname == "/finance/payroll" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                        <FaMoneyCheckDollar size={20} />
                        <span className='text-[16px] font-[400]'>Payroll</span>
                    </Link>
                    {/* <Link href='/finance/uniform' className={`${pathname == "/finance/uniform" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                        <GiClothes size={20} />
                        <span className='text-[16px] font-[400]'>Uniform</span>
                    </Link> */}
                    <Link href='/finance/payments' className={`${pathname == "/finance/payments" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                        <RiSecurePaymentLine size={20} />
                        <span className='text-[16px] font-[400]'>Payments</span>
                    </Link>
                    <Link href='/finance/vouchers' className={`${pathname == "/finance/vouchers" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                        <RiSecurePaymentLine size={20} />
                        <span className='text-[16px] font-[400]'>Transactions</span>
                    </Link>
                </div>
            </div>

            <div className='flex flex-col gap-[10px] px-5'>
                {/* <Link href='' className='flex flex-row p-2 px-4 items-center gap-[10px]'>
                    <div>
                        <MdOutlinePassword size={20} color='white' />
                    </div>
                    <span className='text-[14px] text-white'>Security</span>
                </Link> */}
                <div onClick={confirmLogout} className='flex flex-row items-center gap-[10px] bg-white rounded-[6px]  p-3 cursor-pointer'>
                    <RiLogoutBoxFill size={20} />
                    <span className='text-[14px] font-[600]'>Sign Out</span>
                </div>
            </div>
            <ConfirmDialog />

        </div>
    )
}

export default FinanceSidebar