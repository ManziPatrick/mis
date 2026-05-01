import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { IoMdDocument } from 'react-icons/io';
import * as Yup from 'yup';
import { useCreateEmployeeMutation } from '@/utlis/hooks/empoyees.hook';
import { newBookSchema } from '@/utlis/validation/validation';
import { useCreateBook, useUpdateBook } from '@/utlis/hooks/library.hook';


interface NewEmployeeType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    reFetch: () => void;
    updateData?: {
        book_name: string;
        isbn: string;
        author: string;
        quantity: number;
        shelf_number: string;
        _id: string
    }
}

interface BookFormValues {
    book_name: string;
    isbn: string;
    author: string;
    quantity: number;
    shelf_number: string;
}



const UpdateBook = ({ isOpen, setIsOpen, reFetch, updateData }: NewEmployeeType) => {
    const { mutate: updateBook, isPending } = useUpdateBook()


    const bookFormik = useFormik<BookFormValues>({
        initialValues: {
            book_name: '',
            isbn: '',
            quantity: 0,
            shelf_number: '',
            author: '',
        },
        validationSchema: newBookSchema,
        onSubmit: async (values) => {
            try {
                if (updateData) {
                    const data = {
                        ...values,
                        id: updateData?._id
                    }
                    updateBook(data, {
                        onSuccess: (response) => {
                            toast.success("Book update successfully");
                            reFetch()
                            bookFormik.resetForm();
                            setIsOpen(false);
                        },
                        onError: (error: any) => {
                            toast.error(error.response.data.message);
                        }
                    })
                }
            } catch (error: any) {
                toast.error(error.message);
            } finally {
            }
        },
    });

    useEffect(() => {
        if (updateData) {
            bookFormik.setFieldValue("book_name", updateData.book_name)
            bookFormik.setFieldValue("isbn", updateData.isbn)
            bookFormik.setFieldValue("quantity", updateData.quantity)
            bookFormik.setFieldValue("author", updateData.author)
            bookFormik.setFieldValue("shelf_number", updateData.shelf_number)
        }
    }, [updateData])

    return (
        <>
            <Toaster position="top-right" />
            <Dialog
                header="Update Book"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/2"
                visible={isOpen}
                onHide={() => setIsOpen(false)}
            >
                <form
                    onSubmit={bookFormik.handleSubmit}
                    className="w-full p-3 flex flex-col gap-[10px]"
                >
                    <div className="grid grid-cols-2 gap-[5px]">
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Book Name</span>
                            <input
                                value={bookFormik.values.book_name}
                                name="book_name"
                                onChange={bookFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter book name"
                            />
                            {bookFormik.touched.book_name && bookFormik.errors.book_name && (
                                <div className="text-red-500 text-[12px]">{bookFormik.errors.book_name}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">ISBN</span>
                            <input
                                value={bookFormik.values.isbn}
                                name="isbn"
                                onChange={bookFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter ISBN"
                            />
                            {bookFormik.touched.isbn && bookFormik.errors.isbn && (
                                <div className="text-red-500 text-[12px]">{bookFormik.errors.isbn}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Author</span>
                            <input
                                value={bookFormik.values.author}
                                name="author"
                                type='text'
                                onChange={bookFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder='Enter Author'
                            />
                            {bookFormik.touched.author && bookFormik.errors.author && (
                                <div className="text-red-500 text-[12px]">{bookFormik.errors.author}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Shelf number</span>
                            <input
                                value={bookFormik.values.shelf_number}
                                name="shelf_number"
                                onChange={bookFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter shelf number"
                            />
                            {bookFormik.touched.shelf_number && bookFormik.errors.shelf_number && (
                                <div className="text-red-500 text-[12px]">{bookFormik.errors.shelf_number}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Quantity</span>
                            <input
                                value={bookFormik.values.quantity}
                                name="quantity"
                                onChange={bookFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter net salary"
                            />
                            {bookFormik.touched.quantity && bookFormik.errors.quantity && (
                                <div className="text-red-500 text-[12px]">{bookFormik.errors.quantity}</div>
                            )}
                        </div>
                    </div>
                    <Button
                        loading={isPending}
                        className="flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center"
                    >
                        Update Book
                    </Button>
                </form>
            </Dialog>
        </>
    );
};

export default UpdateBook;