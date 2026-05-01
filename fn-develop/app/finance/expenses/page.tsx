"use client"
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilterSquareFill } from 'react-icons/bs'
import { FaUserPlus } from 'react-icons/fa6'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { LuGitPullRequestArrow } from 'react-icons/lu'
import { useFormik } from 'formik'
import { toast, Toaster } from 'sonner'
import { Dialog } from 'primereact/dialog'
import { useGetRequestedExpenseQuery, useGetSingleVouchersByRequest, userRequestExpenseMutation } from '@/utlis/hooks/expense.hook'
import { requestExpenseFormikSchema } from '@/utlis/validation/validation'
import { OrbitProgress } from 'react-loading-indicators'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { GoDotFill } from 'react-icons/go'
import VoucherModal from '@/components/reusable/VoucherModal'
import { useGetAllEmployees } from '@/utlis/hooks/empoyees.hook'
import { useGetAllSuppiers, useGetAllSuppliesToPay, useGetSingleSuppliesSupplier, useGetSingleSuppliesToPay, useGetSingleUnpaidSuppliesSupplier } from '@/utlis/hooks/suppliers.hook'
import { Sidebar } from 'primereact/sidebar'

// Add proper type definitions
interface ExpenseFormValues {
    requested_for: string;
    beneficiary: string;
    total_amount_paid: number;
    total_amount_to_be_paid: number;
    expected_payment_date: string;
    payment_mode: string;
    payment_account: string;
    reason: string;
    employeeId: string;
    supplierId: string;
    description: string;
    selectedSupplies: string[];
    employeeType?: string

}


const Expenses = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { mutate: requestExpense, isPending, isPaused } = userRequestExpenseMutation()
    const { data: requestedExpenses, isLoading, isError, isPending: selectLoading, refetch } = useGetRequestedExpenseQuery()
    const { data: employees, isLoading: employeeLoading, refetch: employeeRefetch } = useGetAllEmployees()
    const { data: suppliers, isLoading: supplierLoading, refetch: supplierRefetch } = useGetAllSuppiers()
    const [requestId, setRequestId] = useState<string>('')
    const [visible, setIsVisble] = useState<boolean>(false)
    const [viewExpense, setViewExpense] = useState<boolean>(false)
    const [viewData, setViewData] = useState<any>()
    const [supplieId, setSupplieId] = useState<string>('')
    const { data: voucher, isLoading: voucherLoading, isPending: voucherPending, refetch: voucherRefetch } = useGetSingleVouchersByRequest(requestId)
    const { data: supplies, isLoading: suppliesLoading, isPending: suppliesPending, refetch: suppliesRefetch } = useGetAllSuppliesToPay()
    const { data: singleSupplies, isLoading: singleSuppliesLoading, isPending: singleSuppliesPending, refetch: singleSuppliesRefetch } = useGetSingleSuppliesToPay(supplieId!)
    const expenseFormik = useFormik<ExpenseFormValues>({
        initialValues: {
            requested_for: '',
            beneficiary: '',
            total_amount_paid: 0,
            total_amount_to_be_paid: 0,
            expected_payment_date: '',
            payment_mode: '',
            payment_account: '',
            reason: '',
            employeeId: '',
            supplierId: '',
            description: '',
            selectedSupplies: [] as string[],
            employeeType: ''
        },
        // validationSchema: requestExpenseFormikSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values) => {
            const data = {
                ...values,
                employeeId: values.requested_for === "employee" ? values.employeeId : null,
                supplierId: values.requested_for === "supplier" ? values.supplierId : null,
            }

            requestExpense(data, {
                onSuccess: () => {
                    toast.success("Request Sent")
                    expenseFormik.resetForm()
                    setIsOpen(false)
                    refetch()
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "An error occurred")
                }
            })
        }
    })

    const { data: supplierSupplies, isLoading: supplierSuppliesLoading } = useGetSingleUnpaidSuppliesSupplier(expenseFormik.values.supplierId!)
    useEffect(() => {
        if (requestId !== "") {
            voucherRefetch()
        }
    }, [requestId])

    useEffect(() => {
        if ((expenseFormik.values.reason === "transportation" || expenseFormik.values.reason == "salary" || expenseFormik.values.reason === "advance-payment") && expenseFormik.values.employeeId && employees) {
            const employee = employees.find((item: any) => item._id === expenseFormik.values.employeeId);
            expenseFormik.setFieldValue("total_amount_to_be_paid", employee?.netSalary || 0);
        } else if (expenseFormik.values.requested_for === "supplier" && expenseFormik.values.supplierId) {
            const selectedSuppliesTotal = supplierSupplies
                ?.filter((supply: any) => expenseFormik.values.selectedSupplies.includes(supply._id))
                ?.reduce((acc: number, curr: any) => acc + (curr?.remainingBalance && curr?.remainingBalance !== 0 ? curr?.remainingBalance : curr.totalCost || 0), 0);
            expenseFormik.setFieldValue("total_amount_to_be_paid", selectedSuppliesTotal || 0);
        } else {
            expenseFormik.setFieldValue("total_amount_to_be_paid", 0);
        }
    }, [expenseFormik.values.reason, expenseFormik.values.employeeId, expenseFormik.values.supplierId, expenseFormik.values.selectedSupplies, employees, supplierSupplies]);

    const handleSuppliesSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const supplyId = e.target.value;
        if (supplyId && !expenseFormik.values.selectedSupplies.includes(supplyId)) {
            expenseFormik.setFieldValue("selectedSupplies", [...expenseFormik.values.selectedSupplies, supplyId]);
        }
    };

    const actionTempelate = (rowData: any) => {
        return (
            <div className=' cursor-pointer flex flex-row gap-[10px] items-center'>
                <p onClick={() => { setViewData(rowData); setViewExpense(true) }} className=''>View</p>
                {rowData?.status === "Approved" && (
                    <p onClick={() => { setRequestId(rowData._id); setIsVisble(true) }} className='text-[12px] font-[500] text-yellow-500'>Voucher</p>
                )}
            </div>
        )
    }

    const statusTemplate = (rowData: any) => {
        return (
            <div className={`flex flex-row ${rowData.status === "Pending" ? "text-yellow-400 border-yellow-400" : ""} gap-[10px] text-[12px]  p-1 rounded-[12px] items-center`}>
                <GoDotFill />
                <span>{rowData.status}</span>
            </div>

        )


    }

    const paidTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[10px] items-center'>
                <span>{rowData.total_amount_to_be_paid}</span>
                <span>Frw</span>
            </div>
        )
    }

    const dateTemplate = (rowData: any) => {
        const formattedDate = new Date(rowData?.date).toLocaleDateString();
        const formattedTime = new Date(rowData?.date).toLocaleTimeString();
        return (
            <div className=' flex flex-row gap-[20px] items-center'>
                <span>{formattedDate}</span>
                <span>{formattedTime}</span>
            </div>
        )
    }

    const beneficiaryTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[10px] items-center'>
                {rowData.employeeId ? (
                    <span className='text-[12px]'>Employee</span>

                ) : (

                    <span className='text-[12px]'>{rowData?.beneficiary}</span>
                )}
            </div>
        )
    }



    return (
        <>
            <Toaster position='top-right' />
            <div className='w-full flex flex-col gap-[20px] p-4'>
                <div className='w-full items-center justify-between flex flex-row'>
                    <div className='flex flex-row gap-[4px] items-center'>
                        <span className='text-[12px]'>Finance  /</span>
                        <span className='text-[12px] font-[600]'>Expenses</span>
                    </div>
                    <Button onClick={() => setIsOpen(true)} className='text-[12px] text-white rounded-[6px] hover:opacity-80 px-6 py-3 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                        <LuGitPullRequestArrow color='white' size={16} />
                        Request
                    </Button>
                </div>
                <div className='w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between'>
                    <div className='flex flex-row gap-[10px]'>
                        <span className='text-[18px] font-[600]'>Expenses</span>
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
                {isLoading ? (
                    <div className='w-full p-20 flex items-center justify-center '>
                        <div className='w-full p-10 flex items-center justify-center'>
                            <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='w-full py-2 bg-white rounded-[6px]'>
                            {requestedExpenses?.length == 0 ? (
                                <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                                    <GiEmptyWoodBucket size={60} color='lightgray' />
                                    <span className='text-[16px] font-[700]'>No Request found</span>
                                    <span className='text-[12px]'>There is no request yet but you can request new one </span>
                                    <Button onClick={() => setIsOpen(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                                        <FaUserPlus color='white' size={16} />
                                        Request
                                    </Button>

                                </div>
                            ) : (
                                <DataTable
                                    paginator
                                    rows={10}
                                    rowsPerPageOptions={[10, 20, 40]}
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                    value={requestedExpenses?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} className='w-full mt-4'>
                                    <Column
                                        body={(rowData, options) =>
                                            (options.rowIndex + 1).toString().padStart(3, "0")
                                        }
                                        field="code"
                                        header="#"
                                        headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]"
                                        bodyClassName="h-[8vh] p-2 text-[13px] border-b"></Column>
                                    <Column field="date" header="Date" body={dateTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                    <Column field="beneficiary" header="Beneficiary" body={beneficiaryTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                    <Column field="description" header="Description" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                    <Column field="total_amount_to_be_paid" body={paidTemplate} header="To Be Paid" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                    <Column field="status" header="Status" body={statusTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                    <Column field="Action" header="Action" body={actionTempelate} headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                </DataTable>
                            )}
                        </div>
                    </>
                )}
                {voucher && !voucherLoading && !voucherPending && (
                    <VoucherModal isLoading={voucherLoading} voucher={voucher} requestId={requestId} visible={visible} setIsVisble={setIsVisble} />
                )}
            </div>
            <Dialog header="Request" headerStyle={{ fontSize: 10, color: "black" }} className='w-1/2' visible={isOpen} onHide={() => { expenseFormik.resetForm(); setIsOpen(false) }}>
                <form onSubmit={expenseFormik.handleSubmit} className='w-full p-3 flex flex-col gap-[10px]'>
                    <div className='grid grid-cols-2 gap-[10px]'>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Requested For</span>
                            <select value={expenseFormik.values.requested_for} name='requested_for' onChange={expenseFormik.handleChange} className=' border p-3 text-[12px] rounded-[12px]'>
                                <option value="">Select requested for</option>
                                <option value="employee">employee</option>
                                <option value="supplier">supplier</option>
                                <option value="other">other</option>
                            </select>
                            {expenseFormik.touched.requested_for && expenseFormik.errors.requested_for ? (
                                <div className="text-red-500 text-[12px]">{expenseFormik.errors.requested_for}</div>
                            ) : ""}

                        </div>
                        {expenseFormik.values.requested_for == "other" && (
                            <div className='flex flex-col gap-[4px] w-full'>
                                <span className='text-[12px] text-black'>Beneficiary</span>
                                <input value={expenseFormik.values.beneficiary} name='beneficiary' onChange={expenseFormik.handleChange} type="text" className=' border p-3 text-[12px] rounded-[12px]' placeholder='Enter Beneficiary' />
                                {expenseFormik.touched.beneficiary && expenseFormik.errors.beneficiary ? (
                                    <div className="text-red-500 text-[12px]">{expenseFormik.errors.beneficiary}</div>
                                ) : ""}

                            </div>
                        )}
                        {expenseFormik.values.requested_for == "employee" && (<>
                            <div className='flex flex-col gap-[4px] w-full'>
                                <span className='text-[12px] text-black'>Employee</span>
                                <select name='employeeId' onChange={(e) => {
                                    expenseFormik.handleChange(e);
                                    const selectedEmployee = employees.find((emp: any) => emp._id === e.target.value);
                                    expenseFormik.setFieldValue("employeeType", selectedEmployee?.type || "");
                                }} className=' border p-3 text-[12px] rounded-[12px]'>
                                    <option value="">Select Employee</option>
                                    {employees?.map((emp: any, index: number) => {
                                        return (
                                            <option key={index} value={emp?._id}>{emp?.name}</option>
                                        )
                                    })}
                                </select>
                                {expenseFormik.touched.employeeId && expenseFormik.errors.employeeId ? (
                                    <div className="text-red-500 text-[12px]">{expenseFormik.errors.employeeId}</div>
                                ) : ""}

                            </div>

                        </>)}
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Reason</span>
                            <select value={expenseFormik.values.reason} name='reason' onChange={expenseFormik.handleChange} className=' border p-3 text-[12px] rounded-[12px]'>
                                <option value="">Select reason</option>
                                {expenseFormik.values.requested_for === "other" ? (

                                    <option value="full-payment">Full payment</option>
                                ) : expenseFormik.values.requested_for === "employee" ? (
                                    expenseFormik.values.employeeType === "staff" ? (
                                        <>
                                            <option value="advance-payment">Advance Payment</option>
                                            <option value="transportation">Transport</option>
                                        </>
                                    ) : expenseFormik.values.employeeType === "non-staff" ? (
                                        <>
                                            <option value="advance-payment">Advance Payment</option>
                                            <option value="salary">Salary</option>
                                        </>
                                    ) : (
                                        <option value="">Select employee first</option>
                                    )
                                ) : (
                                    <>
                                        <option value="advance-payment">advance payment</option>
                                        <option value="full-payment">Full payment</option>
                                    </>
                                )}

                            </select>
                            {expenseFormik.touched.reason && expenseFormik.errors.reason ? (
                                <div className="text-red-500 text-[12px]">{expenseFormik.errors.reason}</div>
                            ) : ""}

                        </div>

                        {expenseFormik.values.requested_for == "supplier" && (<>
                            <div className='flex flex-col gap-[4px] w-full'>
                                <span className='text-[12px] text-black'>Supplier</span>
                                <select name='supplierId' onChange={expenseFormik.handleChange} className=' border p-3 text-[12px] rounded-[12px]'>
                                    <option value="">Select Supplier</option>
                                    {suppliers?.supplier?.map((sup: any, index: number) => {
                                        return (
                                            <option key={index} value={sup?._id}>{sup?.name}</option>
                                        )
                                    })}
                                </select>
                                {expenseFormik.touched.supplierId && expenseFormik.errors.supplierId ? (
                                    <div className="text-red-500 text-[12px]">{expenseFormik.errors.supplierId}</div>
                                ) : ""}

                            </div>
                        </>)}
                        {expenseFormik.values.requested_for == "supplier" && expenseFormik.values.supplierId && (
                            <div className='flex flex-col gap-[4px] w-full'>
                                <span className='text-[12px] text-black'>Supplies</span>
                                {supplierSuppliesLoading ? (
                                    <span className='text-[12px] text-gray-500'>Loading...</span>
                                ) : !supplierSupplies || supplierSupplies.length === 0 ? (
                                    <div className='text-[12px] text-gray-500 border p-3 rounded-[12px]'>
                                        No unpaid supplies found for this supplier
                                    </div>
                                ) : (
                                    <select
                                        onChange={handleSuppliesSelection}
                                        className='border p-3 text-[12px] rounded-[12px]'
                                    >
                                        <option value="">Select Supplies</option>
                                        {supplierSupplies.map((supply: any) => (
                                            <option
                                                key={supply._id}
                                                value={supply._id}
                                                disabled={expenseFormik.values.selectedSupplies.includes(supply._id)}
                                            >
                                                {supply.item} - {supply.totalCost} Frw
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}


                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Expected Payment Date</span>
                            <input value={expenseFormik.values.expected_payment_date} name='expected_payment_date' onChange={expenseFormik.handleChange} type="Date" className=' border p-3 text-[12px] rounded-[12px]' placeholder='Enter expected_payment_date' />
                            {expenseFormik.touched.expected_payment_date && expenseFormik.errors.expected_payment_date ? (
                                <div className="text-red-500 text-[12px]">{expenseFormik.errors.expected_payment_date}</div>
                            ) : ""}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Amount To Be Paid</span>
                            <input disabled={expenseFormik.values.reason == "transportation" || expenseFormik.values.requested_for == "supplier"} value={expenseFormik.values.total_amount_to_be_paid} name='total_amount_to_be_paid' onChange={expenseFormik.handleChange} type="number" className=' border p-3 text-[12px] rounded-[12px]' placeholder='Enter Amount To Be Paid' />
                            {expenseFormik.touched.total_amount_to_be_paid && expenseFormik.errors.total_amount_to_be_paid ? (
                                <div className="text-red-500 text-[12px]">{expenseFormik.errors.total_amount_to_be_paid}</div>
                            ) : ""}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Amount  Paid</span>
                            <input value={expenseFormik.values.total_amount_paid} name='total_amount_paid' onChange={expenseFormik.handleChange} type="number" className=' border p-3 text-[12px] rounded-[12px]' placeholder='Enter Amount To Be Paid' />
                            {expenseFormik.touched.total_amount_paid && expenseFormik.errors.total_amount_paid ? (
                                <div className="text-red-500 text-[12px]">{expenseFormik.errors.total_amount_paid}</div>
                            ) : ""}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Payment Account</span>
                            <select value={expenseFormik.values.payment_account} onChange={expenseFormik.handleChange} name="payment_account" id="" className=' border p-3 text-[12px] rounded-[12px]'>
                                <option value="" disabled>Choose Payment Account</option>
                                <option value="Bank">Bank</option>
                                <option value="Petty Cash">Petty Cash</option>
                                {/* <option value="Cheque">Hand</option> */}
                            </select>
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Payment Mode</span>
                            <select name="payment_mode" value={expenseFormik.values.payment_mode} onChange={expenseFormik.handleChange} id="" className=' border p-3 text-[12px] rounded-[12px]'>
                                <option value="" disabled>Choose Payment Mode</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Cash">Cash</option>  
                                <option value="Transfer">Transfer</option>
                                {/* <option value="Cheque">Hand</option> */}
                            </select>
                        </div>
                    </div>
                    <div className='flex flex-col gap-[4px] w-full'>
                        <span className='text-[12px] text-black'>Description</span>
                        <textarea name="description" value={expenseFormik.values.description} onChange={expenseFormik.handleChange} placeholder='Enter description here' id="" className=' border p-3 text-[12px] rounded-[12px]' />
                        {expenseFormik.touched.description && expenseFormik.errors.description ? (
                            <div className="text-red-500 text-[12px]">{expenseFormik.errors.description}</div>
                        ) : ""}
                    </div>
                    <Button loading={isPending} className='flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center'>Request</Button>
                </form>
            </Dialog >
            <Sidebar className='w-1/3' visible={viewExpense} position="right" header='Expense Details' onHide={() => setViewExpense(false)}>
                <div className='flex flex-col gap-[20px] w-full p-4'>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Prepared By</span>
                        <span className='font-medium'>{viewData?.preparer_details?.name}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Beneficiary</span>
                        <span className='font-medium'>{viewData?.beneficiary}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Description</span>
                        <span className='font-medium'>{viewData?.description}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Amount To Be Paid</span>
                        <span className='font-medium'>{viewData?.total_amount_to_be_paid} Frw</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Amount Paid</span>
                        <span className='font-medium'>{viewData?.total_amount_paid} Frw</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Payment Mode</span>
                        <span className='font-medium'>{viewData?.payment_mode}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Payment Account</span>
                        <span className='font-medium'>{viewData?.payment_account}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Expected Payment Date</span>
                        <span className='font-medium'>{new Date(viewData?.expected_payment_date).toLocaleDateString()}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Status</span>
                        <span className={`font-medium ${viewData?.status === "Pending" ? "text-yellow-500" :
                            viewData?.status === "Approved" ? "text-green-500" :
                                viewData?.status === "Rejected" ? "text-red-500" : ""
                            }`}>
                            {viewData?.status}
                        </span>
                    </div>
                </div>
            </Sidebar>

        </>
    )
}

export default Expenses