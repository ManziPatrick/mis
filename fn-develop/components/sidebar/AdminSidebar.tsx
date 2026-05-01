"use client"
import React from 'react'
import Image from 'next/image'
import { MdDashboardCustomize } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";
import { CiLogout } from 'react-icons/ci';
import { RiLogoutBoxFill, RiSecurePaymentLine } from 'react-icons/ri';
import { MdOutlinePassword } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { LuGitPullRequestArrow } from 'react-icons/lu';
import Link from "next/link"
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Logout from '@/utlis/action/Logout';
import { BiCableCar } from 'react-icons/bi';
import { GrUserWorker } from 'react-icons/gr';
import { useNotificationQuery } from '@/utlis/hooks/notification.hook';
import { TbSwitchHorizontal } from 'react-icons/tb';


const adminSidebar = () => {
    const pathname = usePathname()
    const { data: notifications, isLoading, refetch } = useNotificationQuery()

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
        <>
            <div className='flex flex-col gap-[20px] bg-[#2E3487] w-full min-h-[100vh] justify-between pb-4'>
                <div className='flex flex-col gap-[10px]'>

                    <div className='w-full p-4  bg-white'>
                        <Link href="">
                            <Image src={`/image/logo.png`} loading={'lazy'} width={1000} height={1000} className='w-[150px]' alt='log' />
                        </Link>
                    </div>
                    <div className='flex flex-col gap-[20px] px-4'>
                        <Link href='/admin' className={`${pathname == "/admin" ? "p-4 rounded-[12px] bg-white text-black" : " text-white px-4"} flex flex-row items-center gap-[10px] `}>
                            <MdDashboardCustomize size={18} />
                            <span className='text-[14px] font-[400]'>Dashbaord</span>
                        </Link>
                        <Link href='/admin/users' className={`${pathname == "/admin/users" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                            <FaUsers size={20} />
                            <span className='text-[16px] font-[400]'>Users</span>
                        </Link>
                        <Link href='/admin/requested' className={`${pathname == "/admin/requested" || pathname == "/admin/requested/supplier" || pathname == "/admin/requested/employee" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                            <LuGitPullRequestArrow size={20} />
                            <span className='text-[16px] font-[400]'>Request</span>
                        </Link>

                        <Link href='/admin/payments' className={`${pathname == "/admin/payments" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                            <RiSecurePaymentLine size={20} />
                            <span className='text-[16px] font-[400]'>Payments</span>
                        </Link>
                        <Link href='/admin/vouchers' className={`${pathname == "/admin/vouchers" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                            <RiSecurePaymentLine size={20} />
                            <span className='text-[16px] font-[400]'>Transactions</span>
                        </Link>
                        <Link href='/admin/suppliers' className={`${pathname == "/admin/suppliers" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                            <BiCableCar size={20} />
                            <span className='text-[16px] font-[400]'>Suppliers</span>
                        </Link>
                        <Link href='/admin/employees' className={`${pathname == "/admin/employees" ? "p-4 rounded-[12px] bg-white text-black" : "px-4 text-white"} flex flex-row items-center gap-[10px] `}>
                            <GrUserWorker size={20} />
                            <span className='text-[16px] font-[400]'>Employees</span>
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
                    <Link href={`/procurement`} className='flex flex-row items-center font-[600] text-[14px] gap-[10px] bg-white rounded-[6px]  p-3 cursor-pointer'>
                        <TbSwitchHorizontal size={20} />  Switch To Procurement
                    </Link>
                    <Link href={`/hr`} className='flex flex-row items-center font-[600] text-[14px] gap-[10px] bg-white rounded-[6px]  p-3 cursor-pointer'>
                    <TbSwitchHorizontal size={20} />  Switch To HR
                </Link>
                    <div onClick={confirmLogout} className='flex flex-row items-center gap-[10px] bg-white rounded-[6px]  p-3 cursor-pointer'>
                        <RiLogoutBoxFill size={20} />
                        <span className='text-[14px] font-[600]'>Sign Out</span>
                    </div>
                </div>

            </div>
            <ConfirmDialog />
        </>
    )
}

export default adminSidebar