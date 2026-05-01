"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilterSquareFill } from "react-icons/bs";
import { Dialog } from 'primereact/dialog';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from 'primereact/button';
import { userDisableUserMutation, useSelectAllUsers, useSelectRoles } from '@/utlis/hooks/user.hook';
import { OrbitProgress } from 'react-loading-indicators';
import { GiEmptyWoodBucket } from 'react-icons/gi';
import { FaUserPlus } from 'react-icons/fa6';
import NewUser from '@/components/reusable/NewUser';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { toast } from 'sonner';
import { useGetPettyChash } from '@/utlis/hooks/expense.hook';
import { AxiosError } from 'axios';



const Users = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const { data: users, isLoading, isError, refetch } = useSelectAllUsers()
    const { mutate: disableUserMutate, isPending: deleting } = userDisableUserMutation()
    const { data: roles, isLoading: loadingRoles, isError: RolesError } = useSelectRoles()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [deleteingId, setDeletingId] = useState<string>("")
    const [petty_cash_sum, set_petty_cash_sum] = useState<number>(0)
    const { data: petty_cash, isLoading: pettyIsLoading, isPending: pettyIsPending, isError: pettyIsError, error: pettyError } = useGetPettyChash()


    useEffect(() => {
        if (petty_cash) {
            const length = petty_cash.length - 1
            set_petty_cash_sum(petty_cash[length].amount_balance)
        }
    }, [petty_cash, refetch]);


    const actionTemplate = (rowData: any) => {
        return (
            <div className="flex items-center space-x-4">
                {/* <button className="text-primary flex flex-row items-center">View</button> */}
                <button onClick={() => confirmDelete(rowData)} className={`font-[500] flex flex-row items-center ${rowData.isActive ? "text-red-400" : "text-green-400"}`}>
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

    const deleteUserFun = async (id: string) => {
        setDeletingId(id)
        disableUserMutate(id, {
            onSuccess: (data) => {
                toast.success("User updated successfully")
                refetch()

            },
            onError: (error) => {
                const axiosError: any = error as AxiosError
                toast.error(axiosError.response?.data.message || "You can't update this user")
            }
        })
    }

    const confirmDelete = (rowData: any) => {
        confirmDialog({
            message: 'Do you want to update this record?',
            header: 'Update Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptLabel: 'Yes, Confirm',
            rejectLabel: 'Cancel',
            acceptClassName: ' bg-blue-600 text-white p-3 ',
            rejectClassName: ' inline-block mr-2 bg-red-400 text-white p-3 ',
            accept: () => {
                deleteUserFun(rowData._id);
                // The dialog closes automatically on accept/reject
            },
        });
    };


    return (
        <div className='p-4 flex flex-col gap-[20px]'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Admin  /</span>
                    <span className='text-[14px] font-[600]'>Users</span>
                </div>
            </div>
            <div className='w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between'>
                <div className='flex flex-row gap-[10px]'>
                    <span className='text-[18px] font-[400]'>Users</span>
                    <div className='p-1 px-2 rounded-[4px] bg-gray-50 '>
                        <span className='font-[500]'>{!isLoading && users?.users && users.users.filter((user: any) => user.role.roleName !== "superadmin" && user.role.roleName !== "admin").length}</span>
                    </div>
                </div>
                <div className='flex flex-row items-center gap-[10px]'>
                    <div className='flex flex-row border items-center gap-[10px] rounded-[12px] p-2'>
                        <BiSearch />
                        <input type="text" placeholder='Search something' className=' outline-none' />
                    </div>
                    <div className='p-2 cursor-pointer'>
                        <BsFilterSquareFill color='black' size={20} />
                    </div>
                </div>
            </div>
            <div className='py-2 bg-white'>
                <div className='w-full flex'>
                    <Button onClick={() => setIsOpen(true)} className='text-[14px] mr-3 ml-auto text-white rounded-[6px] hover:opacity-80 px-4 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                        <FaUserPlus color='white' size={16} />
                        New User
                    </Button>

                </div>
                {isLoading ? (
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (
                    <>
                        {users?.users.filter((user: any) => user.role.roleName !== "superadmin" && user.role.roleName !== "admin").length == 0 ? (
                            <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                                <GiEmptyWoodBucket size={60} color='lightgray' />
                                <span className='text-[16px] font-[700]'>No User Avaliable</span>
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
                                value={users?.users.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).filter((user: any) => user.role.roleName !== "superadmin" && user.role.roleName !== "admin")} className='w-full mt-4'>
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
                                <Column field="role.roleName" header="Role" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400] uppercase' bodyClassName={"h-[8vh] uppercase p-2 text-[13px] border-b"}></Column>
                                <Column field="Action" header="Action" body={actionTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            </DataTable>

                        )}
                    </>

                )}
            </div>
            <NewUser setIsOpen={setIsOpen} isOpen={isOpen} roles={roles?.roles} reFetch={refetch} />
        </div>
    )
}

export default Users