"use client"
import { useGetAllPayments, useGetAllVouchers } from '@/utlis/hooks/expense.hook'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilterSquareFill } from 'react-icons/bs'
import { FaRegPenToSquare } from 'react-icons/fa6'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { GoEye } from 'react-icons/go'
import { OrbitProgress } from 'react-loading-indicators'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Payments = () => {
    const { data: payments, isLoading, isError, error } = useGetAllPayments()
    const { data: vouchers, isLoading: voucherLoading } = useGetAllVouchers()

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
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[12px]'>Admin  /</span>
                    <span className='text-[12px] font-[600]'>Payments</span>
                </div>
            </div>

            <div className="w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between">
                <div className="flex flex-row gap-[10px]">
                    <span className="text-[18px] font-[400]">Payments</span>
                    <div className="p-1 px-2 rounded-[4px] bg-gray-50">
                        <span className="font-[500]">{payments?.length || 0}</span>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-[10px]">
                    <div className="flex flex-row border items-center gap-[10px] rounded-[12px] p-2">
                        <BiSearch />
                        <input
                            type="text"
                            placeholder="Search something"
                            className="outline-none"
                        />
                    </div>
                    <div className="p-2 cursor-pointer">
                        <BsFilterSquareFill color="black" size={20} />
                    </div>
                    <Button onClick={exportToPDF} className='p-2 px-4 bg-black text-white rounded-[4px]'>Export Pdf</Button>
                    <Button onClick={exportToExcel} className='p-2 px-4 bg-blue-800 text-white rounded-[4px]'>Export Excel</Button>
                </div>
            </div>
            {isLoading ? (
                <div className="w-full p-10 rounded-[6px] bg-white flex items-center justify-center">
                    <div className="w-full p-10 flex items-center justify-center">
                        <OrbitProgress color="#2E3487" size="small" />
                    </div>
                </div>
            ) : (
                <>
                    {isError || error ? (
                        <div className="w-full p-10 rounded-[6px] bg-white flex items-center justify-center">
                            <div className="w-full flex  items-center text-center justify-center p-2 flex-col gap-[3px]">
                                <GiEmptyWoodBucket size={60} color="lightgray" />
                                <span className="text-[16px] font-[700]">No Payments Found</span>
                                <span className="text-[12px]">There is no payments yet.</span>
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            paginator
                            rows={10}
                            rowsPerPageOptions={[10, 20, 40]}
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            value={payments?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
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
    )
}

export default Payments