import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { IoIosNotifications } from "react-icons/io";
import { useNotificationQuery } from '@/utlis/hooks/notification.hook';
import NotificationModal from '../reusable/modal/NotificationModal';
import { useSession } from 'next-auth/react';

const AdminNavbar = () => {
    const { data: notifications, isLoading, refetch } = useNotificationQuery()
    const [openNotif, setOpenNotif] = useState<boolean>(false)
    const { data: session } = useSession()
    const notifRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setOpenNotif(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    return (
        <div className='flex relative flex-row p-4 bg-white border-b items-center justify-between'>
            <div className='flex flex-row items-center gap-[10px]'>
                <div className='flex flex-row border items-center gap-[10px] rounded-[12px] p-2'>
                    <BiSearch />
                    <input type="text" placeholder='Search something' className=' outline-none' />
                </div>
            </div>
            <div ref={notifRef} className='flex flex-row gap-[10px]'>
                <div onClick={(e) => {
                    e.stopPropagation();
                    setOpenNotif((prev) => !prev);
                }} className='bg-gray-50 rounded-[12px] cursor-pointer p-2 flex items-center justify-center relative'>
                    <IoIosNotifications size={20} />
                    {isLoading ? "" : notifications?.filter((notif: any) => !notif.isRead).length > 0 ? (
                        <div className='w-[20px] absolute h-[20px] top-[-4px] right-0 bg-red-500 flex rounded-full items-end justify-center'>
                            <span className='text-white text-[12px] text-center'>{isLoading ? 0 : notifications?.filter((notif: any) => !notif.isRead).length}</span>
                        </div>
                    ) : ""}
                </div>
                {/* <div className='flex flex-row gap-[4px] items-center'>
                    <MdKeyboardArrowDown />
                </div> */}
            </div>
            {/* Notofications */}
            <div ref={notifRef} className={`w-[40%] absolute z-[1000]  rounded-[6px]  right-10 top-20 overflow-hidden ${openNotif ? "" : "h-0"} duration-300 transition-all`}>
                <NotificationModal notification={notifications} refetch={refetch} />
            </div>
        </div>
    )
}

export default AdminNavbar