import { userCreateUserMutation } from '@/utlis/hooks/user.hook'
import { NewUserModalType } from '@/utlis/types/type.types'
import { newUserFormikSchema } from '@/utlis/validation/validation'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import Email from 'next-auth/providers/email'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { toast, Toaster } from 'sonner'

const NewUser = ({ isOpen, setIsOpen, roles, reFetch }: NewUserModalType) => {
    const [isLoading, setIsLoading] = useState(false)
    const { mutate: createUserMutate, isPending } = userCreateUserMutation()
    const newUserFomirk = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            role: "",
            phoneNumber: ""
        },
        validationSchema: newUserFormikSchema,
        onSubmit: async (values) => {
            setIsLoading(true)
            const data = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                role_id: values.role,
                phoneNumber: values.phoneNumber
            }
            try {
                createUserMutate(data, {
                    onSuccess: (data) => {
                        console.log(data)
                        toast.success("New user created sucessfully")
                        reFetch()
                        setIsOpen(false)
                        newUserFomirk.resetForm()
                        setIsLoading(false)

                    },
                    onError: (error) => {
                        setIsLoading(false)
                        const axError:any = error as AxiosError
                        toast.success(axError?.response?.data?.message)

                    }
                })

            } catch (error: any) {
                toast.success("Somethin went wrong try again later")

            }

        }
    })
    return (
        <>
            <Toaster position='top-right' />
            <Dialog header="New User" headerStyle={{ fontSize: 10, color: "black" }} className='w-1/2' visible={isOpen} onHide={() => { newUserFomirk.resetForm(); setIsOpen(false) }}>
                <form onSubmit={newUserFomirk.handleSubmit} className='w-full p-3 flex flex-col gap-[10px]'>
                    <div className='grid grid-cols-2 gap-[10px]'>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[14px] text-black'>First name</span>
                            <input value={newUserFomirk.values.firstName} name='firstName' onChange={newUserFomirk.handleChange} type="text" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter First Name' />
                            {newUserFomirk.touched.firstName && newUserFomirk.errors.firstName ? (
                                <div className="text-red-500 text-[12px]">{newUserFomirk.errors.firstName}</div>
                            ) : ""}

                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[14px] text-black'>Last name</span>
                            <input value={newUserFomirk.values.lastName} name='lastName' onChange={newUserFomirk.handleChange} type="text" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Last Name' />
                            {newUserFomirk.touched.lastName && newUserFomirk.errors.lastName ? (
                                <div className="text-red-500 text-[12px]">{newUserFomirk.errors.lastName}</div>
                            ) : ""}

                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[14px] text-black'>Email</span>
                            <input value={newUserFomirk.values.email} name='email' onChange={newUserFomirk.handleChange} type="text" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Email' />
                            {newUserFomirk.touched.email && newUserFomirk.errors.email ? (
                                <div className="text-red-500 text-[12px]">{newUserFomirk.errors.email}</div>
                            ) : ""}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[14px] text-black'>Phone Number</span>
                            <input value={newUserFomirk.values.phoneNumber} name='phoneNumber' onChange={newUserFomirk.handleChange} type="text" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Phone Number' />
                            {newUserFomirk.touched.phoneNumber && newUserFomirk.errors.phoneNumber ? (
                                <div className="text-red-500 text-[12px]">{newUserFomirk.errors.phoneNumber}</div>
                            ) : ""}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[14px] text-black'>Select Role</span>
                            <select onChange={newUserFomirk.handleChange} name='role' className=' uppercase border p-3 text-[13px] rounded-[6px]'>
                                <option value={``} className='uppercase' >Select Role</option>
                                {roles?.map((role: any, index: number) => {
                                    return (
                                        <option key={index} value={role._id} className='uppercase' >{role.roleName}</option>
                                    )
                                })}
                            </select>
                            {newUserFomirk.touched.role && newUserFomirk.errors.role ? (
                                <div className="text-red-500 text-[12px]">{newUserFomirk.errors.role}</div>
                            ) : ""}
                        </div>
                    </div>
                    `  <Button loading={isLoading} className='flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center'>Save</Button>`
                </form>


            </Dialog>
        </>
    )
}

export default NewUser