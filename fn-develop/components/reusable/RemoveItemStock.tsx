import React from 'react'
import { useFormik } from 'formik'
import { Dialog } from 'primereact/dialog'
import * as Yup from "yup"
import { Toast } from 'primereact/toast'
import { toast, Toaster } from 'sonner'
import { useRemoveItemFromStock } from '@/utlis/hooks/stock.hook'
import { Button } from 'primereact/button'
import { AxiosError } from 'axios'

interface removeType {
    isOpen: boolean
    setIsOpen: any
    refetch?: any
    data: any
}

const RemoveItemStock = ({ isOpen, setIsOpen, refetch, data }: removeType) => {
    const { mutate: removeFromStock, isPending } = useRemoveItemFromStock()

    const removeItemFormik = useFormik({
        initialValues: {
            quantity: 0,
            takenBy: ""
        },
        validationSchema: Yup.object().shape({
            quantity: Yup.number().required("quantity is required").min(1, "quantity must be over 0"),
            takenBy: Yup.string().required("quantity is required").min(3, "Name must over 3 character")
        }),
        onSubmit: async (values) => {
            try {
                if (values.quantity > data.quantity) {
                    return toast.error("Insufficient stock")
                }
                const datas = {
                    stockId: data._id,
                    quantity: Number(values.quantity),
                    takenBy: values.takenBy

                }
                removeFromStock(datas, {
                    onSuccess: (response) => {
                        toast.success(response.message)
                        refetch()
                        removeItemFormik.resetForm()
                        setIsOpen(false)
                    },
                    onError: (error) => {
                        const axiError: any = error as AxiosError
                        toast.success(axiError?.response?.data?.message || "Something went wrong")

                    }
                })


            } catch (error: any) {
                toast.error(error.message)

            }


        }
    })
    return (
        <Dialog header={data?.item} visible={isOpen} onHide={() => setIsOpen(false)} className='w-1/3'>
            <Toaster position='top-right' />
            <div className=' flex flex-col gap-[10px] w-full'>

                <form onSubmit={removeItemFormik.handleSubmit} action="" className='flex flex-col w-full gap-[20px]'>
                    <div className='flex flex-col gap-[4px] w-full'>
                        <span className='text-[12px] text-black'>quantity</span>
                        <input onChange={removeItemFormik.handleChange} value={removeItemFormik.values.quantity} name='quantity' type="text" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Quantity' />
                        {removeItemFormik.touched.quantity && removeItemFormik.errors.quantity ? (
                            <div className="text-red-500 text-[12px]">{removeItemFormik.errors.quantity}</div>
                        ) : ""}
                    </div>
                    <div className='flex flex-col gap-[4px] w-full'>
                        <span className='text-[12px] text-black'>Taken By</span>
                        <input onChange={removeItemFormik.handleChange} value={removeItemFormik.values.takenBy} name='takenBy' type="text" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Who takes it' />
                        {removeItemFormik.touched.takenBy && removeItemFormik.errors.takenBy ? (
                            <div className="text-red-500 text-[12px]">{removeItemFormik.errors.takenBy}</div>
                        ) : ""}
                    </div>
                    <Button loading={isPending} className='flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center'>Deduct</Button>`
                </form>
            </div>

        </Dialog>
    )
}

export default RemoveItemStock