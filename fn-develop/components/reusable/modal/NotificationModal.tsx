import { useReadNotification } from '@/utlis/hooks/notification.hook';
import Link from 'next/link';
import React from 'react';
import { TbMoodEmpty } from "react-icons/tb";

interface Notification {
    message: string;
    createdAt: string; 
    _id: string;
    isRead: boolean
}

interface NotType {
    notification: Notification[];
    refetch?: any
}

const getRelativeTime = (date: string): string => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const weeks = Math.floor(diffInSeconds / 604800);
    const months = Math.floor(diffInSeconds / 2628000); 
    const years = Math.floor(diffInSeconds / 31536000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} sec${diffInSeconds === 1 ? '' : 's'} ago`;
    } else if (minutes < 60) {
        return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (days < 7) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (weeks < 4) {
        return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    } else if (months < 12) {
        return `${months} month${months === 1 ? '' : 's'} ago`;
    } else {
        return `${years} year${years === 1 ? '' : 's'} ago`;
    }
};

const NotificationModal = ({ notification,refetch }: NotType) => {
    const sortedNotifications = notification?.filter((notif) => !!notif.createdAt).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); 
    const {mutate: readSingleMutate,isPending} = useReadNotification()

    const readSingleNotification = (id:string)=>{
        console.log("called",id)
        readSingleMutate(id,{
            onSuccess:()=>{
                refetch()
            },
            onError: ()=>{
                console.log("error")
            }
        })


    }

    return (
        <div className='w-full shadow-md flex flex-col gap-[0px] p-4 bg-white rounded-[6px]'>
            <div className='flex flex-row gap-[20px] items-center justify-between border-b pb-3'>
                <span className='text-[16px] font-[700]'>Notifications</span>
                <div className='flex flex-row items-center gap-[10px]'>
                    <span className='text-black text-[12px]'>Mark all as read</span>
                </div>
            </div>
            <div className='flex w-full'>
                {sortedNotifications?.length === 0 ? (
                    <div className='flex flex-col gap-[10px] text-center w-full items-center justify-center'>
                        <TbMoodEmpty size={30} color='gray' />
                        <span className='font-[700] text-[16px]'>Notification is empty</span>
                    </div>
                ) : (
                    <div className='flex flex-col'>
                        {sortedNotifications?.slice(0, 4).map((notif, index) => (
                            <div onClick={()=> readSingleNotification(notif._id)} key={index} className={`p-4 border-b ${notif.isRead  ? "bg-white" : "bg-gray-100"}  cursor-pointer hover:bg-white flex flex-row gap-[10px] key={index}`}>
                                <div>
                                    <div className='w-[50px] h-[50px] rounded-full bg-gray-200'></div>
                                </div>
                                <div className='flex flex-col gap-[4px]'>
                                    <span className='text-[13px] font-[500]'>{notif.message}</span>
                                    <div className='text-orange-500 flex flex-row gap-[6px] items-center justify-end text-end'>
                                        <span className='text-[11px]'>{getRelativeTime(notif.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='w-full flex justify-end items-end'>
                <Link href="#" className='text-[13px] text-blue-500 text-end'>View All ({notification?.length})</Link>
            </div>
        </div>
    );
};

export default NotificationModal;
