"use client"
import React, { useEffect, useState } from 'react'
import { FaRegEye, FaUserPlus } from 'react-icons/fa6'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useGetAllReceivedMoney, useGetPettyChash } from '@/utlis/hooks/expense.hook'
import { Dialog } from 'primereact/dialog'
import { CiCirclePlus } from 'react-icons/ci'
import { IoMdDocument } from 'react-icons/io'
import RecordMoney from '@/components/reusable/RecordMoney'
import { OrbitProgress } from 'react-loading-indicators'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { Sidebar } from 'primereact/sidebar'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const ReceivedMoney = () => {
    const [petty_cash_sum, set_petty_cash_sum] = useState<number>(0)
    const { data: received_money, isLoading, isPending, isError, error, refetch } = useGetAllReceivedMoney()
    const { data: petty_cash, isLoading: pettyIsLoading, isPending: pettyIsPending, isError: pettyIsError, error: pettyError, refetch: pettyRefetch } = useGetPettyChash()
    const [isActive, setIsActive] = useState<boolean>(false)
    const [viewedData, setViewedData] = useState<any>()
    const [visibleRight, setVisibleRight] = useState<boolean>(false)

    useEffect(() => {
        if (petty_cash) {
            const length = petty_cash.length - 1
            set_petty_cash_sum(petty_cash[length].amount_balance)
        }
    }, [petty_cash, refetch]);


    const actionTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[10px] items-center'>
                <span className=' cursor-pointer px-2 border p-2 rounded-[4px] hover:bg-gray-100' onClick={() => { setViewedData(rowData); setVisibleRight(true) }} ><FaRegEye size={20} /></span>
            </div>
        )
    }

    const exportToExcel = () => {
        if (!received_money?.receivedMoney || received_money?.receivedMoney.length === 0) {
            alert("No data to export.");
            return;
        }

        const worksheetData = received_money?.receivedMoney.map((payment: any, index: number) => ({
            "#": (index + 1).toString().padStart(3, "0"),
            "From": payment.received_from,
            "Received By": payment.received_by?.firstName || "",
            "Approved By": payment.approved_by?.firstName || "",
            "Amount": payment.amount?.$numberDecimal,
            "Account": payment.account,
            "Reason": payment.reason,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Received_money");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(data, "Received_Money_Report.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.text("Received Money Report", 14, 10);

        autoTable(doc, {
            head: [
                ["#", "From", "Received By", "Approved By", "Amount", "Account", "Reason"]
            ],
            body: received_money?.receivedMoney?.map((payment: any, index: number) => [
                (index + 1).toString().padStart(3, "0"),
                payment.received_from,
                payment.received_by?.firstName || "",
                payment.approved_by?.firstName || "",
                payment.amount?.$numberDecimal,
                payment.account,
                payment.reason,
            ]) || [],
            startY: 20,
        });

        doc.save("Received_Money_Report.pdf");
    };

    return (
        <>
            <div className='w-full flex flex-col gap-[0px] p-4'>
                <div className='w-full items-center justify-between flex flex-row'>
                    <div className='flex flex-row gap-[4px] items-center'>
                        <span className='text-[14px]'>Finance  /</span>
                        <span className='text-[14px] font-[600]'>Received Money</span>
                    </div>
                    <Button onClick={() => setIsActive(true)} className='text-[12px] text-white rounded-[6px] hover:opacity-80 px-6 py-3 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                        <CiCirclePlus color='white' size={16} />
                        Record Money
                    </Button>
                </div>

                <div className='w-full grid grid-cols-4 gap-[20px] items-center'>
                    <div className='p-4 rounded-[6px] gap-[18px] w-full bg-white flex flex-col'>
                        <div className='flex flex-row items-end gap-[4px]'>
                            <span className='text-[18px] font-[400]'>My Balance</span>
                            <span className='text-[10px] text-[gray]'>/Petty Cash</span>
                        </div>
                        <div className='flex flex-row gap-[4px] items-center'>
                            <h1 className='text-[20px] font-[600]'>{!pettyIsLoading && petty_cash_sum}</h1>
                            <span className='text-[12px] text-[gray]'>/frw</span>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <div className='w-full p-10 flex bg-white items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : isError ? (
                    <div className=''>
                        {error.message == "Request failed with status code 404" && (
                            <div className='w-full flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                                <GiEmptyWoodBucket size={60} color='lightgray' />
                                <span className='text-[16px] font-[700]'>No Received Money found</span>
                                <span className='text-[12px]'>There is no received money yet but you can create new one </span>
                                <Button className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                                    <FaUserPlus color='white' size={16} />
                                    Add received money
                                </Button>

                            </div>

                        )}
                    </div>
                ) : received_money && received_money?.receivedMoney.length > 0 ? (
                    <>
                        <div className='w-full flex flex-row items-center gap-[10px] justify-end py-4'>
                            <Button onClick={exportToPDF} className='p-2 px-4 bg-black text-white rounded-[4px]'>Export Pdf</Button>
                            <Button onClick={exportToExcel} className='p-2 px-4 bg-blue-800 text-white rounded-[4px]'>Export Excel</Button>
                        </div>
                        <DataTable
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} suppliers" // Display pagination info
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" value={received_money?.receivedMoney.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} className='w-full mt-4'>
                            <Column
                                body={(rowData, options) =>
                                    (options.rowIndex + 1).toString().padStart(3, "0")
                                }
                                field="code"
                                header="#"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[13px] border-b"
                            ></Column>
                            <Column field='received_from' header="From" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field="received_by.firstName" header="Received By" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field="approved_by.firstName" header="Approved By" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field="amount.$numberDecimal" header="Amount" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field="account" header="Account" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            <Column field="" body={actionTemplate} header="Action" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                        </DataTable>
                    </>
                ) : (
                    <div className='text-center text-gray-500'>No received money yet.</div>
                )}
            </div>
            <RecordMoney isActive={isActive} setIsActive={setIsActive} refetch={refetch} pettyRefetch={pettyRefetch} />
            <Sidebar className='w-1/3' visible={visibleRight} position="right" header='Received Money Details' onHide={() => setVisibleRight(false)}>
                <div className='flex flex-col gap-[20px] w-full p-4'>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Received From</span>
                        <span className='font-medium'>{viewedData?.received_from}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Received By</span>
                        <span className='font-medium'>{viewedData?.received_by?.firstName} {viewedData?.received_by?.lastName}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Approved By</span>
                        <span className='font-medium'>{viewedData?.approved_by?.firstName} {viewedData?.approved_by?.lastName}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Amount</span>
                        <span className='font-medium'>{viewedData?.amount?.$numberDecimal} Frw</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Account</span>
                        <span className='font-medium'>{viewedData?.account}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Reason</span>
                        <span className='font-medium'>{viewedData?.reason}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center justify-between'>
                        <span className='text-gray-600'>Date</span>
                        <span className='font-medium'>{new Date(viewedData?.date).toLocaleDateString()}</span>
                    </div>
                    {viewedData?.signed_document && (
                        <Button
                            onClick={() => window.open(viewedData.signed_document, '_blank')}
                            className='flex items-center justify-center gap-2 bg-[#2E3487] text-white px-4 py-2 rounded-[6px] hover:opacity-80'
                        >
                            <IoMdDocument size={20} />
                            View Signed Document
                        </Button>
                    )}
                </div>
            </Sidebar>
        </>

    )
}

export default ReceivedMoney