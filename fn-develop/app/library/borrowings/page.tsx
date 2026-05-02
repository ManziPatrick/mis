"use client"
import { useGetAllBorrowings, useReturnBook } from '@/utlis/hooks/library.hook'
import { AxiosError } from 'axios'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useMemo } from 'react'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { OrbitProgress } from 'react-loading-indicators'
import { toast } from 'sonner'
import { LuBookUp } from "react-icons/lu";
import { CiSearch } from 'react-icons/ci'

const Borrowings = () => {
    const { data: borrowingsData, isLoading, isError, refetch } = useGetAllBorrowings()
    const { mutate: returnBook, isPending: returnPending } = useReturnBook()
    const [search, setSearch] = React.useState<string>("")

    const filteredBorrowings = useMemo(() => {
        if (!borrowingsData) return [];
        let data = [...borrowingsData].sort((a: any, b: any) => 
            new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
        );
        if (search) {
            data = data.filter((item: any) => 
                item.bookId?.book_name?.toLowerCase().includes(search.toLowerCase()) ||
                item.studentId?.toLowerCase().includes(search.toLowerCase())
            );
        }
        return data;
    }, [borrowingsData, search]);

    const handleReturn = (id: string) => {
        returnBook(id, {
            onSuccess: (res: any) => {
                toast.success(res.message || "Book returned successfully")
                refetch()
            },
            onError: (err: any) => {
                const axiosError = err as AxiosError
                const message = (axiosError.response?.data as any)?.message || "Failed to return book"
                toast.error(message)
            }
        })
    }

    const actionTemplate = (rowData: any) => {
        if (rowData.status === 'returned') {
            return <span className='text-green-600 font-[500]'>Returned</span>
        }
        return (
            <Button 
                onClick={() => handleReturn(rowData._id)}
                disabled={returnPending}
                className='text-[12px] bg-green-700 text-white px-3 py-1 rounded-[4px] hover:opacity-80'
            >
                Mark Returned
            </Button>
        )
    }

    const statusTemplate = (rowData: any) => {
        return (
            <span className={`px-2 py-1 rounded-[10px] text-[12px] ${
                rowData.status === 'borrowed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }`}>
                {rowData.status.toUpperCase()}
            </span>
        )
    }

    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Library  /</span>
                    <span className='text-[14px] font-[600]'>Rentals & Returns</span>
                </div>
            </div>

            <div className='flex flex-row items-center justify-between bg-white p-4 rounded-[6px]'>
                <h1 className='text-[16px] font-[600]'>All Rentals ({filteredBorrowings.length})</h1>
                <div className='flex flex-row items-center gap-[3px] p-2 border rounded-[6px] w-[300px]'>
                    <CiSearch size={18} />
                    <input 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        type="search" 
                        className='text-[13px] rounded-[6px] outline-none w-full' 
                        placeholder='Search by book / student ID' 
                    />
                </div>
            </div>

            {isLoading ? (
                <div className='w-full p-20 flex items-center justify-center'>
                    <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                </div>
            ) : (
                <>
                    {isError || !filteredBorrowings.length ? (
                        <div className='w-full py-10 bg-white flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                            <GiEmptyWoodBucket size={60} color='lightgray' />
                            <span className='text-[16px] font-[700]'>No borrowings found</span>
                            <span className='text-[12px]'>There are no active or past rentals</span>
                        </div>
                    ) : (
                        <DataTable
                            paginator
                            rows={10}
                            value={filteredBorrowings}
                            className='w-full mt-4'
                        >
                            <Column header="#" body={(data, options) => options.rowIndex + 1} headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]" bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column field='bookId.book_name' header="Book" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column field="studentId" header="Student ID" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column header="Borrow Date" body={(rowData) => new Date(rowData.borrowDate).toLocaleDateString()} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column header="Due Date" body={(rowData) => new Date(rowData.dueDate).toLocaleDateString()} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column header="Status" body={statusTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column header="Action" body={actionTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                        </DataTable>
                    )}
                </>
            )}
        </div>
    )
}

export default Borrowings
