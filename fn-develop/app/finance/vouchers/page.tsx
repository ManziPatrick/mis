"use client"
import React, { useState } from 'react'
import { useGetAllPayments, useGetAllVouchers, useUploadProofVoucher } from '@/utlis/hooks/expense.hook'
import { useFormik } from 'formik'
import { Dialog } from 'primereact/dialog'
import * as Yup from "yup"
import { toast } from 'sonner'
import { BsFilterSquareFill } from 'react-icons/bs'
import { OrbitProgress } from 'react-loading-indicators'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { BiSearch } from 'react-icons/bi'
import { IoMdDocument } from 'react-icons/io'
import { Button } from 'primereact/button'
import { AxiosError } from 'axios'


const Vouchers = () => {
    const { data: vouchers, isLoading: voucherLoading, refetch, isError, error } = useGetAllVouchers()
    const { mutate: uploadProof, isPending } = useUploadProofVoucher()
    const [selectedVoucherId, setSelectedVoucherId] = useState<string>()
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false)

    const dateTemplate = (rowData: any) => {
        const formattedDate = new Date(rowData.generated_date).toLocaleDateString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedDate}</span>
            </div>
        )
    }
    const timeTemplate = (rowData: any) => {
        const formattedTime = new Date(rowData.generated_date).toLocaleTimeString();
        return (
            <div className=' flex flex-row gap-[10px] items-center'>
                <span>{formattedTime}</span>
            </div>
        )
    }


    const actionTempelate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[20px] items-center'>
                {rowData.document_status == "Signed" ? (
                    <a href={rowData.signed_document} target='_blank' className='text-[14px] cursor-pointer font-[400] text-blue-500'>View Proof</a>
                ) : (
                    <span onClick={() => { setSelectedVoucherId(rowData._id); setIsAddOpen(true) }} className='text-[14px] cursor-pointer font-[400] text-blue-500'>+ Add Proof</span>
                )}
            </div>
        )
    }

    const proofFormik = useFormik({
        initialValues: {
            signedDocument: null
        },
        validationSchema: Yup.object().shape({
            signedDocument: Yup.mixed()
                .required('Signed documen is required')
                .test(
                    'fileFormat',
                    'Only PDF files are allowed',
                    (value: any) => !value || (value && value.type === 'application/pdf')
                ),

        }),
        onSubmit: (values) => {
            const data = {
                signedDocument: values.signedDocument,
                id: selectedVoucherId || ""

            }
            uploadProof(data, {
                onSuccess: (response) => {
                    toast.success(response.message)
                    setSelectedVoucherId("")
                    refetch()
                    setIsAddOpen(false)
                },
                onError: (errorF) => {
                    const error: any = errorF as AxiosError
                    toast.error(error.response.data.message)
                }
            })
            toast.success("filer uplaoaded successfully")

        }
    })

    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[12px]'>Finance  /</span>
                    <span className='text-[12px] font-[600]'>Transactions</span>
                </div>
            </div>

            <div className="w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between">
                <div className="flex flex-row gap-[10px]">
                    <span className="text-[18px] font-[400]">Vouchers</span>
                    <div className="p-1 px-2 rounded-[4px] bg-gray-50">
                        <span className="font-[500]">{vouchers?.length || 0}</span>
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
                </div>
            </div>
            {voucherLoading ? (
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
                                <span className="text-[16px] font-[700]">No Vouchers Found</span>
                                <span className="text-[12px]">There is no payments vouchers yet.</span>
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            paginator
                            rows={10}
                            rowsPerPageOptions={[10, 20, 40]}
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            value={vouchers?.sort((a: any, b: any) => new Date(b.generated_date).getTime() - new Date(a.generated_date).getTime())}
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
                                field="description"
                                header="Description"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field=""
                                header="Date"
                                body={dateTemplate}
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field=""
                                header="Time"
                                body={timeTemplate}
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="document_status"
                                header="Document Status"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field="approved_by.firstName"
                                header="Approved By"
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>
                            <Column
                                field=""
                                header="Action"
                                body={actionTempelate}
                                headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                                bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                            ></Column>

                        </DataTable>
                    )}
                </>
            )}

            <Dialog header="Add Proof" visible={isAddOpen} onHide={() => { setSelectedVoucherId(""); setIsAddOpen(false) }} className='w-1/3'>
                <form onSubmit={proofFormik.handleSubmit} className='flex flex-col gap-[10px] w-full'>
                    <div className='flex flex-col gap-[10px]'>
                        <label
                            htmlFor="signedDocument"
                            className={`cursor-pointer border flex flex-row gap-[4px] p-3 rounded-[12px] ${proofFormik.values.signedDocument !== null ? "text-white bg-[#2E3487]" : ""
                                } items-center justify-center`}
                        >
                            <IoMdDocument size={20} />
                            <span className="text-[13px] font-[500]">Upload signed document</span>

                        </label>
                        <input
                            type="file"
                            name="signedDocument"
                            id="signedDocument"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(event: any) => {
                                const file = event.currentTarget.files[0];
                                proofFormik.setFieldValue("signedDocument", file);
                            }}
                        />
                        {proofFormik.touched.signedDocument && proofFormik.errors.signedDocument && (
                            <div className="text-red-500 text-[12px]">{String(proofFormik.errors.signedDocument)}</div>
                        )}
                    </div>
                    <Button loading={isPending} className='text-[14px] bg-[#2E3487] justify-center mx-auto text-white rounded-[12px] flex flex-row gap-[10px] items-center py-4 w-full'>
                        Upload
                    </Button>
                </form>
            </Dialog>

        </div>
    )
}

export default Vouchers