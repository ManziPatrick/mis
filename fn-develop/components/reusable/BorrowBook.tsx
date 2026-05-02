"use client"
import React from 'react'
import { Dialog } from 'primereact/dialog'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { useBorrowBook } from '@/utlis/hooks/library.hook'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

interface BorrowBookProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    bookData: any;
    reFetch: () => void;
}

const BorrowBook = ({ isOpen, setIsOpen, bookData, reFetch }: BorrowBookProps) => {
    const { mutate: borrow, isPending } = useBorrowBook()

    const formik = useFormik({
        initialValues: {
            studentId: '',
            dueDate: ''
        },
        validationSchema: Yup.object({
            studentId: Yup.string().required('Student ID is required'),
            dueDate: Yup.date().required('Due date is required').min(new Date(), 'Due date must be in the future')
        }),
        onSubmit: (values) => {
            const data = {
                ...values,
                bookId: bookData._id
            }
            borrow(data, {
                onSuccess: (res: any) => {
                    toast.success(res.message || "Book borrowed successfully")
                    reFetch()
                    setIsOpen(false)
                    formik.resetForm()
                },
                onError: (err: any) => {
                    const axiosError = err as AxiosError
                    const message = (axiosError.response?.data as any)?.message || "Failed to borrow book"
                    toast.error(message)
                }
            })
        }
    })

    return (
        <Dialog 
            header={`Borrow: ${bookData?.book_name}`} 
            visible={isOpen} 
            onHide={() => setIsOpen(false)}
            className='w-[400px]'
        >
            <form onSubmit={formik.handleSubmit} className='flex flex-col gap-[15px] py-4'>
                <div className='flex flex-col gap-[5px]'>
                    <label className='text-[14px] font-[500]'>Student ID</label>
                    <input 
                        name='studentId'
                        value={formik.values.studentId}
                        onChange={formik.handleChange}
                        className='p-2 border rounded-[6px] outline-none focus:border-[#2E3487]'
                        placeholder='Enter Student ID'
                    />
                    {formik.touched.studentId && formik.errors.studentId && (
                        <span className='text-red-500 text-[12px]'>{formik.errors.studentId}</span>
                    )}
                </div>

                <div className='flex flex-col gap-[5px]'>
                    <label className='text-[14px] font-[500]'>Due Date</label>
                    <input 
                        type='date'
                        name='dueDate'
                        value={formik.values.dueDate}
                        onChange={formik.handleChange}
                        className='p-2 border rounded-[6px] outline-none focus:border-[#2E3487]'
                    />
                    {formik.touched.dueDate && formik.errors.dueDate && (
                        <span className='text-red-500 text-[12px]'>{formik.errors.dueDate}</span>
                    )}
                </div>

                <Button 
                    type='submit' 
                    disabled={isPending}
                    className='bg-[#2E3487] text-white p-2 rounded-[6px] hover:opacity-90 mt-2'
                >
                    {isPending ? 'Processing...' : 'Borrow Book'}
                </Button>
            </form>
        </Dialog>
    )
}

export default BorrowBook
