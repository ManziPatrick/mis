"use client"
import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { FaUserPlus } from "react-icons/fa6";
import { PiUsersThree } from 'react-icons/pi';
import { RiAdminLine } from 'react-icons/ri';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import { BsFilterLeft } from 'react-icons/bs';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { userDisableUserMutation, useSelectAllUsers, useSelectRoles } from '@/utlis/hooks/user.hook';
import { OrbitProgress } from 'react-loading-indicators';
import { GiEmptyWoodBucket } from 'react-icons/gi';
import { Dialog } from 'primereact/dialog';
import { IoReturnUpBack } from 'react-icons/io5';
import NewUser from '@/components/reusable/NewUser';
import { confirmDialog } from 'primereact/confirmdialog';
import { toast } from 'sonner';
import { AxiosError } from 'axios';


const Users = () => {
    const { data: users, isLoading, isError, refetch } = useSelectAllUsers()
    const { mutate: disableUserMutate, isPending: deleting } = userDisableUserMutation()
    const { data: roles, isLoading: loadingRoles, isError: RolesError } = useSelectRoles()
    const [deleteingId, setDeletingId] = useState<string>("")
    const [isOpen, setIsOpen] = useState<boolean>(false)



    const actionTemplate = (rowData: any) => {
        return (
            <div className="flex items-center space-x-4">
                {/* <button className="text-primary flex flex-row items-center">View</button> */}
                <button onClick={() => confirmDelete(rowData._id)} className={`font-[500] flex flex-row items-center ${rowData.isActive ? "text-red-400" : "text-green-400"}`}>
                    {deleting && rowData._id == deleteingId ? (
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    ) : rowData.isActive ? "DISABLE" : "ENABLE"}
                </button>
            </div>

        );
    };

    const nameTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[10px] items-center'>
                <span>{rowData?.firstName}</span>
                <span>{rowData?.lastName}</span>
            </div>
        )
    }
    const confirmDelete = (rowData: any) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptLabel: 'Yes, Confirm',
            rejectLabel: 'Cancel',
            acceptClassName: ' bg-blue-600 text-white p-3 ',
            rejectClassName: ' inline-block mr-2 bg-red-400 text-white p-3 ',

            accept: () => deleteUserFun(rowData),
        });
    };


    const deleteUserFun = async (id: string) => {
        setDeletingId(id)
        disableUserMutate(id, {
            onSuccess: (data) => {
                toast.success("User deleted successfully")
                refetch()

            },
            onError: (error) => {
                const axError: any = error as AxiosError
                toast.error(axError?.response?.data?.message)
            }
        })
    }


    return (
        <>
            <div className='w-full flex flex-col gap-[20px] p-4'>
                <div className='w-full items-center justify-between flex flex-row'>
                    <div className='flex flex-row gap-[4px] items-center'>
                        <span className='text-[14px]'>Super Admin  /</span>
                        <span className='text-[14px] font-[600]'>Users</span>
                    </div>
                    <Button onClick={() => setIsOpen(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-6 py-3 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                        <FaUserPlus color='white' size={16} />
                        New User
                    </Button>
                </div>
                <div className='grid grid-cols-6 gap-[20px]'>
                    <div className='flex flex-col gap-[10px]  rounded-[6px] bg-white'>
                        <div className='w-full p-4 border-b flex flex-row gap-[10px] items-center justify-center'>
                            <PiUsersThree size={20} color='#2E3487' />
                            <h1 className='text-[14px] font-[400]'>Total Users</h1>
                        </div>
                        <div className='pb-2 flex flex-row gap-[10px] items-center justify-center'>
                            <h1 className='text-center font-[600] text-[24px]'>{users ? users?.users?.length : 0}</h1>
                            <span className='text-[12px] text-[gray]'>/ Total users</span>

                        </div>
                    </div>
                    <div className='flex flex-col gap-[10px]  rounded-[6px] bg-white'>
                        <div className='w-full p-4 border-b flex flex-row gap-[10px] items-center justify-center'>
                            <RiAdminLine size={20} color='brown' />
                            <h1 className='text-[14px] font-[400]'>Admin</h1>
                        </div>
                        <div className='pb-2 flex flex-row gap-[10px] items-center justify-center'>
                            <h1 className='text-center font-[600] text-[24px]'>{users ? users?.users?.filter((user: any) => user.role.roleName == "admin" || user.role.roleName == "superadmin").length : 0}</h1>
                            <span className='text-[12px] text-[gray]'>/ admins # superadmin</span>

                        </div>
                    </div>
                    <div className='flex flex-col gap-[10px]  rounded-[6px] bg-white'>
                        <div className='w-full p-4 border-b flex flex-row gap-[10px] items-center justify-center'>
                            <FaMoneyCheckAlt size={20} color='#2E3487' />
                            <h1 className='text-[14px] font-[400]'>Finance</h1>
                        </div>
                        <div className='pb-2 flex flex-row gap-[10px] items-center justify-center'>
                            <h1 className='text-center font-[600] text-[24px]'>{users ? users?.users?.filter((user: any) => user.role.roleName == "finance").length : 0}</h1>
                            <span className='text-[12px] text-[gray]'>/ finance</span>

                        </div>
                    </div>
                    <div className='flex flex-col gap-[10px]  rounded-[6px] bg-white'>
                        <div className='w-full p-4 border-b flex flex-row gap-[10px] items-center justify-center'>
                            <FaMoneyCheckAlt size={20} color='brown' />
                            <h1 className='text-[14px] font-[400]'>Stock Keeper</h1>
                        </div>
                        <div className='pb-2 flex flex-row gap-[10px] items-center justify-center'>
                            <h1 className='text-center font-[600] text-[24px]'>{users ? users?.users?.filter((user: any) => user.role.roleName == "stock").length : 0}</h1>
                            <span className='text-[12px] text-[gray]'>/ stock keeper</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-[10px]  rounded-[6px] bg-white'>
                        <div className='w-full p-4 border-b flex flex-row gap-[10px] items-center justify-center'>
                            <RiAdminLine size={20} color='brown' />
                            <h1 className='text-[14px] font-[400]'>Human Resource</h1>
                        </div>
                        <div className='pb-2 flex flex-row gap-[10px] items-center justify-center'>
                            <h1 className='text-center font-[600] text-[24px]'>{users ? users?.users?.filter((user: any) => user.role.roleName == "hr").length : 0}</h1>
                            <span className='text-[12px] text-[gray]'>/ HR</span>

                        </div>
                    </div>
                    <div className='flex flex-col gap-[10px]  rounded-[6px] bg-white'>
                        <div className='w-full p-4 border-b flex flex-row gap-[10px] items-center justify-center'>
                            <RiAdminLine size={20} color='brown' />
                            <h1 className='text-[14px] font-[400]'>Procu.. & Librar..</h1>
                        </div>
                        <div className='pb-2 flex flex-row gap-[10px] items-center justify-center'>
                            <h1 className='text-center font-[600] text-[24px]'>{users ? users?.users?.filter((user: any) => user.role.roleName == "procurement" || user.role.roleName == "librarian").length : 0}</h1>
                            <span className='text-[12px] text-[gray]'>/ procu. # librar..</span>

                        </div>
                    </div>
                </div>

                <div className='p-4 bg-white rounded-[6px] border flex flex-col gap-[10px]'>
                    <div className='flex flex-row gap-[10px]  items-center justify-between'>
                        <h1 className='text-[16px] font-[600]'>Users List</h1>
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
                    {isLoading ? (
                        <div className='w-full p-10 flex items-center justify-center'>
                            <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                        </div>
                    ) : (
                        <>
                            {!users || users?.users.filter((user: any) => user.role.roleName !== "superadmin").length == 0 ? (
                                <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                                    <GiEmptyWoodBucket size={60} color='lightgray' />
                                    <span className='text-[16px] font-[700]'>No User Available</span>
                                    <span className='text-[12px]'>There is no user yet but you can create new one </span>
                                    <Button onClick={() => setIsOpen(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                                        <FaUserPlus color='white' size={16} />
                                        New User
                                    </Button>

                                </div>
                            ) : (
                                <DataTable
                                    paginator
                                    rows={10}
                                    rowsPerPageOptions={[10, 20, 40]}
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                    value={users?.users.filter((user: any) => user.role.roleName !== "superadmin")} className='w-full mt-4'>
                                    <Column
                                        body={(rowData, options) =>
                                            (options.rowIndex + 1).toString().padStart(3, "0")
                                        }
                                        field="code"
                                        header="#"
                                        headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]"
                                        bodyClassName="h-[8vh] p-2 text-[13px] border-b"></Column>
                                    <Column header="Name" body={nameTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                    <Column field="email" header="Email Address" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                    <Column field="role.roleName" header="Role" headerClassName='h-[8vh] uppercase bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] uppercase p-2 text-[13px] border-b"}></Column>
                                    <Column field="Action" header="Action" body={actionTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                </DataTable>

                            )}
                        </>

                    )}
                </div>
            </div>
            <NewUser setIsOpen={setIsOpen} isOpen={isOpen} roles={roles?.roles} reFetch={refetch} />
        </>
    )
}

export default Users