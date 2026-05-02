"use client"
import React from 'react'
import { Dialog } from 'primereact/dialog'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { useAssignAsset } from '@/utlis/hooks/stock.hook'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

interface AssignAssetProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    assetData: any;
    reFetch: () => void;
}

const AssignAsset = ({ isOpen, setIsOpen, assetData, reFetch }: AssignAssetProps) => {
    const { mutate: assign, isPending } = useAssignAsset()

    const formik = useFormik({
        initialValues: {
            studentId: '',
            conditionOnAssignment: 'Good'
        },
        validationSchema: Yup.object({
            studentId: Yup.string().required('Student ID is required'),
            conditionOnAssignment: Yup.string().required('Condition is required')
        }),
        onSubmit: (values) => {
            const data = {
                ...values,
                assetId: assetData._id
            }
            assign(data, {
                onSuccess: (res: any) => {
                    toast.success(res.message || "Asset assigned successfully")
                    reFetch()
                    setIsOpen(false)
                    formik.resetForm()
                },
                onError: (err: any) => {
                    const axiosError = err as AxiosError
                    const message = (axiosError.response?.data as any)?.message || "Failed to assign asset"
                    toast.error(message)
                }
            })
        }
    })

    return (
        <Dialog 
            header={`Assign Asset: ${assetData?.item}`} 
            visible={isOpen} 
            onHide={() => setIsOpen(false)}
            className='w-[400px]'
        >
            <form onSubmit={formik.handleSubmit} className='flex flex-col gap-[15px] py-4'>
                <div className='flex flex-col gap-[5px]'>
                    <label className='text-[14px] font-[500]'>Student ID / staff</label>
                    <input 
                        name='studentId'
                        value={formik.values.studentId}
                        onChange={formik.handleChange}
                        className='p-2 border rounded-[6px] outline-none focus:border-[#2E3487]'
                        placeholder='Enter ID'
                    />
                    {formik.touched.studentId && formik.errors.studentId && (
                        <span className='text-red-500 text-[12px]'>{formik.errors.studentId}</span>
                    )}
                </div>

                <div className='flex flex-col gap-[5px]'>
                    <label className='text-[14px] font-[500]'>Condition on Assignment</label>
                    <select 
                        name='conditionOnAssignment'
                        value={formik.values.conditionOnAssignment}
                        onChange={formik.handleChange}
                        className='p-2 border rounded-[6px] outline-none focus:border-[#2E3487]'
                    >
                        <option value="Good">Good</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>

                <Button 
                    type='submit' 
                    disabled={isPending}
                    className='bg-[#2E3487] text-white p-2 rounded-[6px] hover:opacity-90 mt-2'
                >
                    {isPending ? 'Processing...' : 'Assign Asset'}
                </Button>
            </form>
        </Dialog>
    )
}

export default AssignAsset
