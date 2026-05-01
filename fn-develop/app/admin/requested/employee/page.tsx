"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilterSquareFill } from "react-icons/bs";
import { Dialog } from 'primereact/dialog';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from 'primereact/button';
import { userDisableUserMutation, useSelectAllUsers, useSelectRoles } from '@/utlis/hooks/user.hook';
import { OrbitProgress } from 'react-loading-indicators';
import { GiEmptyWoodBucket } from 'react-icons/gi';
import { FaRegPenToSquare, FaUserPlus } from 'react-icons/fa6';
import NewUser from '@/components/reusable/NewUser';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { toast, Toaster } from 'sonner';
import { useApproveRequestedExpense, useGetRequestedExpenseQuery } from '@/utlis/hooks/expense.hook';
import { useApproveSupplier, useGetAllSuppiers } from '@/utlis/hooks/suppliers.hook';
import { useApproveEmployee, useGetAllEmployees } from '@/utlis/hooks/empoyees.hook';
import { GoEye } from 'react-icons/go';
import { AxiosError } from 'axios';



const EmployeeRequest = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [deleteingId, setDeletingId] = useState<string>("")
    const [approvingId, setApprovingId] = useState<number>()
    const [isView, setIsView] = useState<boolean>(false)
    const [viewedData, setViewedData] = useState<any>({})

    const { data: employees, isLoading: employeeLoading, refetch: employeeRefetch } = useGetAllEmployees()
    const { mutate: approveMutate, isPending } = useApproveEmployee()




    const actionTemplate = (rowData: any) => {
        return (
            <div className="flex flex-row gap-[20px] items-center">
                <div onClick={() => { setViewedData(rowData); setIsView(true) }} className="text-green-700 cursor-pointer"><GoEye size={20} /></div>
            </div>
        )
    }

    const ApproveRequestFun = (id: string) => {
        const data = {
            id: `${id}`,
            status: "approved"
        }
        approveMutate(data, {
            onSuccess: (data) => {
                console.log(data)
                employeeRefetch()
                setIsView(false)
                toast.success(data.message)
            },
            onError: (fail) => {
                const erorr:any = fail as AxiosError
                const errorMessage = erorr?.response?.data?.message || "An unexpected error occurred";
                toast.error(errorMessage);
            }
        })
    }

    const dateTemplate = (rowData: any) => {
        return (
            <div className="flex flex-row gap-[10px] items-center">
                <span>{new Date(rowData.dateOfJoining).toISOString().split('T')[0]}</span>
            </div>
        )
    }
    const salaryTemplate = (rowData: any) => {
        return (
            <div className="flex flex-row gap-[10px] items-center">
                <span>{rowData.netSalary} Frw</span>
            </div>
        )
    }

 





    return (
        <div className='p-4 flex flex-col gap-[20px]'>
            <div className='w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between'>
                <div className='flex flex-row gap-[10px] items-center'>
                    <span className='text-[16px] font-[400]'>Employees</span>
                    <div className='p-1 px-2 rounded-[4px] bg-gray-50 '>
                        <span className='font-[500]'>{!employeeLoading && employees?.filter((data: any) => data.status !== "approved").length}</span>
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
                {employeeLoading ? (
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (
                    <>
                        {employees?.filter((data: any) => data.status !== "approved").length == 0 ? (
                            <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                                <GiEmptyWoodBucket size={60} color='lightgray' />
                                <span className='text-[16px] font-[700]'>No Request Avaliable</span>
                                <span className='text-[12px]'>There is no any request yet</span>
                            </div>
                        ) : (
                            <DataTable
                                paginator
                                rows={10}
                                rowsPerPageOptions={[10, 20, 40]}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                value={(employees || []).filter((data: any) => data.status !== "approved").sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                                className="w-full mt-4"
                            >
                                <Column
                                    body={(rowData, options) =>
                                        (options.rowIndex + 1).toString().padStart(3, "0")
                                    }
                                    field="code"
                                    header="#"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[13px] border-b"
                                ></Column>
                                <Column
                                    field="name"
                                    header="Name"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="phone"
                                    header="Phone"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="nationality"
                                    header="Nationality"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field=""
                                    header="Net Salary"
                                    body={salaryTemplate}
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="type"
                                    header="Type"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field=""
                                    header="Joined On"
                                    body={dateTemplate}
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="status"
                                    header="status"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="action"
                                    header="Action"
                                    body={actionTemplate}
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                            </DataTable>

                        )}
                    </>

                )}
            </div>
            <Dialog
                header="Employee"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/2"
                visible={isView}
                onHide={() => setIsView(false)}
            >
                <div className="w-full flex flex-col gap-[20px]">
                    <div className="w-full p-4 bg-gray-100 rounded-[6px] flex flex-row gap-[20px] justify-between">
                        <div className="flex flex-row gap-[10px] items-center">
                            <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
                                <span className="text-[20px] text-center justify-center font-[400] text-black">
                                    {viewedData?.name?.split(" ")[0]?.split("")[0]}
                                    {viewedData?.name?.split(" ")[1]?.split("")[0]}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[16px] text-black font-[600]">{viewedData?.name}</span>
                                <span className="text-[13px] font-[500]">{viewedData?.phone}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] text-black font-[600]">Email</span>
                            <span className="text-[13px] font-[500]">{viewedData?.email}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] text-black font-[600]">Joined on</span>
                            <span className="text-[13px] font-[500]">
                                {viewedData?.dateOfJoining
                                    ? new Date(viewedData.dateOfJoining).toISOString().split('T')[0]
                                    : "N/A"}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-[20px]">
                        <div className="flex flex-col">
                            <span className="text-[16px] text-black font-[500]">Department</span>
                            <span className="text-[13px] font-[500]">{viewedData?.department}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] text-black font-[500]">Net Salary</span>
                            <span className="text-[13px] font-[500]">{viewedData?.netSalary} frw</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] text-black font-[500]">Occupation</span>
                            <span className="text-[13px] font-[500]">{viewedData?.occupation}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] text-black font-[500]">Type</span>
                            <span className="text-[13px] font-[500]">{viewedData?.type}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] text-black font-[500]">Status</span>
                            <span className="text-[13px] font-[500]">{viewedData?.status}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] text-black font-[500]">Nationality</span>
                            <span className="text-[13px] font-[500] uppercase">{viewedData?.nationality}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] text-black font-[500]">Contract</span>
                            <a href={viewedData?.contractPdf} target="_blank" className="text-[14px] text-blue-500 font-[500]">VIEW</a>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] text-black font-[500]">National ID</span>
                            <a href={viewedData?.nationalIdPdf} target="_blank" className="text-[14px] text-blue-500 font-[500]">VIEW</a>
                        </div>
                        {viewedData.nationality !== "rwandan" && (
                            <>
                                <div className="flex flex-col">
                                    <span className="text-[16px] text-black font-[500]">Passport</span>
                                    <a href={viewedData?.passportPdf} target="_blank" className="text-[14px] text-blue-500 font-[500]">VIEW</a>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[16px] text-black font-[500]">Visa</span>
                                    <a href={viewedData?.visaPdf} target="_blank" className="text-[14px] text-blue-500 font-[500]">VIEW</a>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col items-end justify-end">
                        <div className="flex flex-row gap-[20px] ">
                            <Button onClick={()=> ApproveRequestFun(viewedData._id)} disabled={isPending} className=" text-white px-10 py-3  text-center flex items-center justify-center bg-blue-900 rounded-[6px]">{isPending ? "Loading." : "Approve" }</Button>
                            <Button className=" text-white px-10 py-3  text-center flex items-center justify-center bg-red-500 rounded-[6px]">Reject </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default EmployeeRequest