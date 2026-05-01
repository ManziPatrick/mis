import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { IoMdDocument } from 'react-icons/io';
import * as Yup from 'yup';
import { useCreateEmployeeMutation } from '@/utlis/hooks/empoyees.hook';
import { newBookSchema } from '@/utlis/validation/validation';
import { useCreateBook } from '@/utlis/hooks/library.hook';


interface NewEmployeeType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    reFetch: () => void;
}

interface EmployeeFormValues {
    book_name: string;
    isbn: string;
    author: string;
    quantity: number;
    shelf_number: string;
}



const NewBook = ({ isOpen, setIsOpen, reFetch}: NewEmployeeType) => {
    const { mutate: createBook, isPending } = useCreateBook()


    const employeeFormik = useFormik<EmployeeFormValues>({
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
                createBook(values, {
                    onSuccess: (response) => {
                        toast.success("Book created successfully");
                        reFetch()
                        employeeFormik.resetForm();
                        setIsOpen(false);
                    },
                    onError: (error: any) => {
                        toast.error(error.response.data.message);
                    }
                })

            } catch (error: any) {
                toast.error(error.message);
            } finally {
            }
        },
    });

    return (
        <>
            <Toaster position="top-right" />
            <Dialog
                header="New Book"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/2"
                visible={isOpen}
                onHide={() => setIsOpen(false)}
            >
                <form
                    onSubmit={employeeFormik.handleSubmit}
                    className="w-full p-3 flex flex-col gap-[10px]"
                >
                    <div className="grid grid-cols-2 gap-[5px]">
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Book Name</span>
                            <input
                                value={employeeFormik.values.book_name}
                                name="book_name"
                                onChange={employeeFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter book name"
                            />
                            {employeeFormik.touched.book_name && employeeFormik.errors.book_name && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.book_name}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">ISBN</span>
                            <input
                                value={employeeFormik.values.isbn}
                                name="isbn"
                                onChange={employeeFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter ISBN"
                            />
                            {employeeFormik.touched.isbn && employeeFormik.errors.isbn && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.isbn}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Author</span>
                            <input
                                value={employeeFormik.values.author}
                                name="author"
                                type='text'
                                onChange={employeeFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder='Enter Author'
                            />
                            {employeeFormik.touched.author && employeeFormik.errors.author && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.author}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Shelf number</span>
                            <input
                                value={employeeFormik.values.shelf_number}
                                name="shelf_number"
                                onChange={employeeFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter shelf number"
                            />
                            {employeeFormik.touched.shelf_number && employeeFormik.errors.shelf_number && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.shelf_number}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Quantity</span>
                            <input
                                value={employeeFormik.values.quantity}
                                name="quantity"
                                onChange={employeeFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter net salary"
                            />
                            {employeeFormik.touched.quantity && employeeFormik.errors.quantity && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.quantity}</div>
                            )}
                        </div>
                    </div>
                    <Button
                        loading={isPending}
                        className="flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center"
                    >
                        Save Book
                    </Button>
                </form>
            </Dialog>
        </>
    );
};

export default NewBook;