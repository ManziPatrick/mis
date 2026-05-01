import Image from 'next/image';
import React from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { IoIosNotifications } from "react-icons/io";
import { useNotificationQuery } from '@/utlis/hooks/notification.hook';

const SuperAdminNavbar = () => {
    const {data:notifications,isLoading} = useNotificationQuery()
    return (
        <div className='flex flex-row p-4 bg-white border-b items-center justify-between'>
            <div className='flex flex-row items-center gap-[10px]'>
                <div className='flex flex-row border items-center gap-[10px] rounded-[12px] p-2'>
                    <BiSearch />
                    <input type="text" placeholder='Search something' className=' outline-none' />
                </div>
            </div>
            <div className='flex flex-row gap-[10px]'>
                <div className='bg-gray-50 rounded-[12px] p-2 flex items-center justify-center'>
                <IoIosNotifications size={20} />
                </div>
            <div className='flex flex-row gap-[4px] items-center'>
                <div className='w-[40px] h-[40px] rounded-full bg-gray-100'>
                    <Image src={`/image/profile.jpg`} width={1000} height={1000} alt='' className='w-full h-full object-cover rounded-full' />
                </div>
                <MdKeyboardArrowDown />
            </div>
            </div>
        </div>
    )
}

export default SuperAdminNavbar