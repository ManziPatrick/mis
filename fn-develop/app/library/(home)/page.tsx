"use client"
import Cards from '@/components/reusable/Cards'
import NewBook from '@/components/reusable/NewBook'
import UpdateBook from '@/components/reusable/update/UpdateBook'
import { useDeleteBook, useGetAllBookDeleteRequest, useGetAllBooks, useSendDeleteBookRequest } from '@/utlis/hooks/library.hook'
import { Icon } from '@iconify/react/dist/iconify.js'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import Link from 'next/link'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState, useMemo } from 'react'
import { FaRegPenToSquare } from 'react-icons/fa6'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { GoEye } from 'react-icons/go'
import { OrbitProgress } from 'react-loading-indicators'
import { toast } from 'sonner'
import * as Yup from "yup"

const Library = () => {
    const { data: booksData, isLoading, isError, error, refetch } = useGetAllBooks()
    const { data: requestes, isLoading: requestLoading, refetch: requestRefetch } = useGetAllBookDeleteRequest()
    const { mutate: deleteBook, isPending: deletePending } = useDeleteBook()
    const { mutate: requestDeleteBook, isPending: requestPending } = useSendDeleteBookRequest()
    const [isNewOpen, setIsNewOpen] = useState<boolean>(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)
    const [isView, setIsView] = useState<boolean>(false)
    const [viewedData, setViewedData] = useState<any>({})
    const [errorr, setError] = useState<any>()
    const [isSendRequest, setIsSendRequest] = useState<boolean>(false)

    const reversedBooks = useMemo(() => {
        if (!booksData) return [];
        return [...booksData].reverse();
    }, [booksData]);

    useEffect(() => {
        if (isError && error) {
            setError(error as AxiosError)
        }
    }, [error, isError])

    const actionTemplate = (rowData: any) => {
        return (
            <div className="flex flex-row gap-[20px] items-center">
                <div onClick={() => { setViewedData(rowData); setIsView(true) }} className="text-green-700 cursor-pointer"><GoEye size={20} /></div>
                <div onClick={() => openUpdate(rowData)} className="text-orange-700 cursor-pointer"><FaRegPenToSquare size={16} /></div>
            </div>
        )
    }


    const openUpdate = (data: any) => {
        setViewedData(data)
        setIsUpdateOpen(true)
    }

    const deleteBookFunc = () => {
        deleteBook(viewedData._id, {
            onSuccess: (response) => {
                toast.success(response.message)
            },
            onError: (error) => {
                setIsSendRequest(true)
                const errorF: any = error as AxiosError
                toast.error(errorF?.response?.data?.message)
            }
        })
    }

    const requestFormik = useFormik({
        initialValues: {
            reason: ''
        },
        validationSchema: Yup.object().shape({
            reason: Yup.string().required('Reason is required')
        }),
        onSubmit: (values) => {
            const data = {
                reason: values.reason,
                id: viewedData._id
            }
            requestDeleteBook(data, {
                onSuccess: (response) => {
                    toast.success("Request sent successfully")
                    setIsView(false)
                    setViewedData(null)
                    setIsSendRequest(false)
                },
                onError: (errorr) => {
                    const error: any = errorr as AxiosError
                    toast.success(error?.response?.data?.message)
                }
            })
        }
    })


    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Library  /</span>
                    <span className='text-[14px] font-[600]'>Dashboard</span>
                </div>
                <Button
                    onClick={() => setIsNewOpen(true)}
                    className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'
                >
                    + New Book
                </Button>
            </div>

            <div className='grid grid-cols-3 gap-[20px]'>
                <Cards value={reversedBooks?.length.toLocaleString()} icon={<Icon icon="wpf:books" width="26" height="26" color="#2E3487" />} title={"Total Books"} color={"bg-red-200"} />
                <Cards value={requestes?.filter((item: any) => item?.request_status === "Pending")?.length || 0} icon={<Icon icon="gravity-ui:code-pull-request-arrow-right" color='red' width="20" height="20" />} title={"Pending Request"} color={"bg-red-200"} />
                <Cards value={requestes?.filter((item: any) => item?.request_status === "Approved")?.length || 0} icon={<Icon icon="gravity-ui:code-pull-request-arrow-right" color='green' width="20" height="20" />} title={"Approved Request"} color={"bg-green-200"} />
                <Cards value={requestes?.filter((item: any) => item?.request_status === "Rejected")?.length || 0} icon={<Icon icon="gravity-ui:code-pull-request-arrow-right" color='red' width="20" height="20" />} title={"Rejected Request"} color={"bg-red-200"} />
            </div>

            {isLoading ? (
                <div className='w-full p-20 flex items-center justify-center'>
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                </div>
            ) : (
                <>
                    {isError || !reversedBooks.length ? (
                        <div className='w-full py-10 bg-white flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                            <GiEmptyWoodBucket size={60} color='lightgray' />
                            <span className='text-[16px] font-[700]'>No books found</span>
                            <span className='text-[12px]'>There is no books yet</span>
                            <Button
                                onClick={() => setIsNewOpen(true)}
                                className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'
                            >
                                + New Book
                            </Button>
                        </div>
                    ) : (
                        <div className='w-full flex flex-col gap-[10px] bg-white rounded-[12px]'>
                            <div className='w-full flex flex-row items-center justify-between py-4 px-4'>
                                <span className='text-[16px] font-[500]'>Latest books</span>
                                <Link href='/library/books' className='text-[14px] font-[500] text-blue-500'>View All</Link>
                            </div>
                            <DataTable
                                value={reversedBooks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)}
                                className='w-full mt-4'
                            >
                                <Column
                                    body={(rowData, options) => {
                                        const totalRecords = reversedBooks.length;
                                        const reverseIndex = totalRecords - options.rowIndex;
                                        return reverseIndex.toString().padStart(3, "0");
                                    }}
                                    field="code"
                                    header="#"
                                    headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]"
                                    bodyClassName="h-[8vh] p-2 text-[13px] border-b"
                                />
                                <Column field='book_name' header="Name" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                                <Column field="author" header="Author" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                                <Column field="shelf_number" header="Shelf number" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                                <Column field="isbn" header="ISBN" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                                <Column field="quantity" header="Quantity" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                                <Column field="Action" header="Action" body={actionTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            </DataTable>
                        </div>
                    )}
                </>
            )}

            <NewBook isOpen={isNewOpen} setIsOpen={setIsNewOpen} reFetch={refetch} />
            <UpdateBook isOpen={isUpdateOpen} setIsOpen={setIsUpdateOpen} reFetch={refetch} updateData={viewedData} />
            <Dialog visible={isView} className='w-1/2' header="Book Info" onHide={() => { setIsView(false); setIsSendRequest(false); setViewedData(null) }}>
                <div className='flex flex-col gap-[10px] w-full'>
                    <div className=' w-full grid grid-cols-3 gap-[20px]'>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>Book Name</span>
                            <span className='text-[14px]'>{viewedData?.book_name}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>Author</span>
                            <span className='text-[14px]'>{viewedData?.author}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>Shelf Number</span>
                            <span className='text-[14px]'>{viewedData?.shelf_number}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>ISBN</span>
                            <span className='text-[14px]'>{viewedData?.isbn}</span>
                        </div>
                        <div className='flex flex-col gap-[3px]'>
                            <span className='text-[16px] font-[500] text-black'>Qunatity</span>
                            <span className='text-[14px]'>{viewedData?.quantity}</span>
                        </div>
                    </div>
                    {!isSendRequest && (
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[16px] font-[500] text-red-500'>Danger zone</span>
                            <Button onClick={deleteBookFunc} className='px-4 w-[150px] items-center justify-center flex py-2 hover:bg-red-100 border  border-red-500 rounded-[6px] text-red-500'>
                                {deletePending ? "Loading.." : "Delete"}
                            </Button>
                        </div>
                    )}
                    {isSendRequest && (
                        <form onSubmit={requestFormik.handleSubmit} className='flex flex-col gap-[10px] py-4'>
                            <span className='text-[16px] font-[600]'>Send Delete Request</span>
                            <div className='flex flex-row gap-[10px] items-center '>
                                <input name='reason' onChange={requestFormik.handleChange} type="text" className='p-3 border rounded-[6px]' placeholder='Enter Reason ' />
                                <Button type='submit' className='px-8 p-3 bg-blue-500 text-white'>Send Request</Button>
                            </div>
                            {requestFormik.touched.reason && requestFormik.errors.reason ?
                                <span className='text-[14px] text-red-500'>{requestFormik.errors.reason}</span> : ''}
                        </form>
                    )}

                </div>

            </Dialog>
        </div>
    )
}

export default Library  