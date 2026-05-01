"use client"
import NewSupplier from '@/components/reusable/NewSupplier'
import UpdateSupplier from '@/components/reusable/update/UpdateSupplier'
import { useGetAllPayments } from '@/utlis/hooks/expense.hook'
import { useDeleteSupplier, useGetAllSuppiers, useSendDeleteSupplierRequest } from '@/utlis/hooks/suppliers.hook'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import Link from 'next/link'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { FaRegEye, FaRegPenToSquare, FaUserPlus } from 'react-icons/fa6'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { GoEye } from 'react-icons/go'
import { OrbitProgress } from 'react-loading-indicators'
import { toast } from 'sonner'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Payments = () => {
    const [isNewOpen, setIsNewOpen] = useState<boolean>(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)
    const { data: suppliers, isLoading, refetch } = useGetAllSuppiers()
    const [isView, setIsView] = useState<boolean>(false)
    const [viewedData, setViewedData] = useState<any>({})
    const { data: payments, isLoading: paymentLoading } = useGetAllPayments()





    const dateTemplate = (rowData: any) => {
        const formattedDate = new Date(rowData.paymentDate).toLocaleDateString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedDate}</span>
            </div>
        )
    }
    const timeTemplate = (rowData: any) => {
        const formattedTime = new Date(rowData.paymentDate).toLocaleTimeString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedTime}</span>
            </div>
        )
    }

    const exportToExcel = () => {
        if (!payments || payments.length === 0) {
            alert("No payment data to export.");
            return;
        }


        const worksheetData = payments.map((payment: any, index: number) => ({
            "#": index + 1,
            "Payee Name": payment.payeeName,
            "Payee Type": payment.payeeType,
            "Reason": payment.reason,
            "Payment Date": new Date(payment.paymentDate).toLocaleDateString(),
            "Payment Time": new Date(payment.paymentDate).toLocaleTimeString(),
            "Amount Paid": payment.amountPaid,
            "Total Amount": payment.totalAmount,
            "Remaining Balance": payment.remainingBalance,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");


        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(data, "Payments_Report.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.text("Payments Report", 14, 10);

        autoTable(doc, {
            head: [
                [
                    "#",
                    "Payee Name",
                    "Payee Type",
                    "Reason",
                    "Payment Date",
                    "Payment Time",
                    "Amount Paid",
                    "Total Amount",
                    "Remaining Balance",
                ],
            ],
            body: payments?.map((payment: any, index: number) => [
                index + 1,
                payment.payeeName,
                payment.payeeType,
                payment.reason,
                new Date(payment.paymentDate).toLocaleDateString(),
                new Date(payment.paymentDate).toLocaleTimeString(),
                payment.amountPaid,
                payment.totalAmount,
                payment.remainingBalance,
            ]) || [],
            startY: 20,
        });

        doc.save("Payments_Report.pdf");
    };






    return (
        <>
            <div className='flex flex-col gap-[20px] p-4'>
                <div className='w-full items-center justify-between flex flex-row'>
                    <div className='flex flex-row gap-[4px] items-center'>
                        <span className='text-[14px]'>Procurement  /</span>
                        <span className='text-[14px] font-[600]'>Payments</span>
                    </div>

                </div>
                <div className='w-full bg-white rounded-[6px] p-4 flex flex-row items-center justify-between'>
                    <div className='flex flex-row gap-[10px] items-center'>
                        <span className='text-[14px] font-[600]'>Payments</span>
                        <div className='px-2 bg-gray-100 py-[2px] text-[14px] font-[600]'>{!isLoading ? payments?.length : 0}</div>
                    </div>
                    <div className='flex flex-row items-center gap-[10px]'>
                        <div className='flex flex-row gap-[4px] items-center cursor-pointer p-2 border rounded-[6px]'>
                            <span className='text-[12px]'>More Filter</span>
                            <BsFilterLeft size={18} />
                        </div>
                        <div className='flex flex-row items-center gap-[3px] p-2 border rounded-[6px]'>
                            <CiSearch size={18} />
                            <input type="text" className='text-[12px] rounded-[6px] outline-none' placeholder='Search' />
                        </div>
                        <Button onClick={exportToPDF} className='p-2 px-4 bg-black text-white rounded-[4px]'>Export Pdf</Button>
                        <Button onClick={exportToExcel} className='p-2 px-4 bg-blue-800 text-white rounded-[4px]'>Export Excel</Button>
                    </div>
                </div>
                {paymentLoading ? (
                    <div className='w-full p-10 flex items-center  justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (
                    <>
                        {payments?.length == 0 || payments == null ? (
                            <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                                <GiEmptyWoodBucket size={60} color='lightgray' />
                                <span className='text-[16px] font-[700]'>No Payments Avaliable</span>
                                <span className='text-[12px]'>There is no payments so far</span>

                            </div>
                        ) : (
                            <DataTable
                                paginator
                                rows={10}
                                rowsPerPageOptions={[10, 20, 40]}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} books"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                value={payments?.filter((item: any) => item.payeeType == "Supplier")} className='w-full mt-4'>
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
                                    field="payeeName"
                                    header="Payee Name"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="payeeType"
                                    header="Payee Type"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="reason"
                                    header="Reason"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="paymentDate"
                                    header="Payment Date"
                                    body={dateTemplate}
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="paymentDate"
                                    header="Payment Time"
                                    body={timeTemplate}
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="amountPaid"
                                    header="Amount Paid"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="totalAmount"
                                    header="Amount To Be Paid"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                                <Column
                                    field="remainingBalance"
                                    header="Remaining Balance"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                                ></Column>
                            </DataTable>
                        )}
                    </>
                )}
            </div>
            <NewSupplier isOpen={isNewOpen} setIsOpen={setIsNewOpen} reFetch={refetch} />
            <UpdateSupplier isOpen={isUpdateOpen} setIsOpen={setIsUpdateOpen} reFetch={refetch} updateData={viewedData} />

            <Dialog visible={isView} className='w-1/2' header="Supplier Info" onHide={() => { setIsView(false), setViewedData(null) }}>
                <div className='flex flex-col gap-[10px] w-full'>
                    <div className=' w-full grid grid-cols-3 gap-[20px]'>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>Name</span>
                            <span className='text-[14px]'>{viewedData?.name}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>Email</span>
                            <span className='text-[14px]'>{viewedData?.email}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>Phone</span>
                            <span className='text-[14px]'>{viewedData?.phone}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>address</span>
                            <span className='text-[14px]'>{viewedData?.address}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>commodity</span>
                            <span className='text-[13px]'>{viewedData?.commodity}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>CONTRACT</span>
                            <a href={`${viewedData?.contract}`} target='_blank' className='text-blue-600 font-[400]'>Download</a>
                        </div>
                    </div>
                </div>

            </Dialog>
        </>
    )
}

export default Payments