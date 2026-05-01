import { useRecordReceivedMoneyMutation } from '@/utlis/hooks/expense.hook'
import { useSelectAllUsers } from '@/utlis/hooks/user.hook'
import { RecordMoneyFormikSchema } from '@/utlis/validation/validation'
import { error } from 'console'
import { useFormik } from 'formik'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { IoMdDocument } from 'react-icons/io'
import { toast, Toaster } from 'sonner'

interface recordType {
    isActive: boolean
    setIsActive: any
    refetch: any
    pettyRefetch?: any
}

const RecordMoney = ({ isActive, setIsActive,refetch,pettyRefetch }: recordType) => {
    const  {mutate: recordeMoneyMutate,isPending} = useRecordReceivedMoneyMutation()
    const RecorderFormik = useFormik({
        initialValues: {
            received_from: "",
            date: "",
            amount: "",
            account: "",
            reason: "",
            signed_document: null,
        },
        validationSchema: RecordMoneyFormikSchema,
        onSubmit: async(values) => {
            const data = {
                received_from: values.received_from,
                date: values.date,
                amount: parseFloat(RecorderFormik.values.amount),
                account: values.account,
                reason: values.reason,
                signed_document: values.signed_document,

            }
            console.log("docs",data)
            recordeMoneyMutate(data,{
                onSuccess: (response)=>{
                    toast.success(response.message)
                    refetch()
                    pettyRefetch()
                    setIsActive(false)
                    RecorderFormik.resetForm()
                    console.log(response)
                },
                onError: (eror)=>{
                    toast.error(eror.message)
                    console.log(eror)
                }
            })
        },
    });

    console.log(RecorderFormik.values)
    return (
        <Dialog header="Record Money" visible={isActive} onHide={() => setIsActive(false)} className='w-1/2'>
            <Toaster position='top-right' />
            <div className=' flex flex-col gap-[4px] items-center w-full'>
                <form onSubmit={RecorderFormik.handleSubmit} action="" method="post" className='flex flex-col gap-[4px] w-full'>
                    <div className='grid grid-cols-2 gap-[10px] w-full'>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Received From</span>
                            <input onChange={RecorderFormik.handleChange} value={RecorderFormik.values.received_from} name='received_from' type="text" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Received from' />
                            {RecorderFormik.touched.received_from && RecorderFormik.errors.received_from ? (
                                <div className="text-red-500 text-[12px]">{RecorderFormik.errors.received_from}</div>
                            ) : ""}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Reason</span>
                            <input onChange={RecorderFormik.handleChange} value={RecorderFormik.values.reason} name='reason' type="text" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Reason' />
                            {RecorderFormik.touched.reason && RecorderFormik.errors.reason ? (
                                <div className="text-red-500 text-[12px]">{RecorderFormik.errors.reason}</div>
                            ) : ""}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Amount</span>
                            <input onChange={RecorderFormik.handleChange} value={RecorderFormik.values.amount} name='amount' type="number" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Amount' />
                            {RecorderFormik.touched.amount && RecorderFormik.errors.amount ? (
                                <div className="text-red-500 text-[12px]">{RecorderFormik.errors.amount}</div>
                            ) : ""}
                        </div>

                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Payment Account</span>
                            <select onChange={RecorderFormik.handleChange} value={RecorderFormik.values.account} name="account" id="" className=' border p-4 text-[12px] rounded-[12px]'>
                                <option value="" disabled>Choose  Account</option>
                                <option value="Bank">Bank</option>
                                <option value="Petty Cash">Petty Cash</option>
                            </select>
                            {RecorderFormik.touched.account && RecorderFormik.errors.account ? (
                                <div className="text-red-500 text-[12px]">{RecorderFormik.errors.account}</div>
                            ) : ""}
                        </div>
                        <div className='flex flex-col gap-[4px] w-full'>
                            <span className='text-[12px] text-black'>Date</span>
                            <input onChange={RecorderFormik.handleChange} value={RecorderFormik.values.date} name='date' type="date" className=' border p-3 text-[13px] rounded-[12px]' placeholder='Enter Date' />
                            {RecorderFormik.touched.date && RecorderFormik.errors.date ? (
                                <div className="text-red-500 text-[12px]">{RecorderFormik.errors.date}</div>
                            ) : ""}
                        </div>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                        <span className="text-[13px] font-[400]">Add Proof</span>
                        <label
                            htmlFor="signed_document"
                            className={`cursor-pointer border flex flex-row gap-[4px] p-3 rounded-[12px] ${RecorderFormik.values.signed_document !== null ? "text-white bg-[#2E3487]" : ""} items-center justify-center`}
                        >
                            <IoMdDocument size={20}  />
                            <span className="text-[13px] font-[500]">Assign document (PDF)</span>
                        </label>
                        <input
                            type="file"
                            name="signed_document"
                            id="signed_document"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(event:any) => {
                                const file = event.currentTarget.files[0];
                                RecorderFormik.setFieldValue("signed_document", file);
                            }}
                        />
                        {RecorderFormik.touched.signed_document && RecorderFormik.errors.signed_document && (
                            <div className="text-red-500 text-[12px]">{RecorderFormik.errors.signed_document}</div>
                        )}
                    </div>
                  
                   
                    <Button loading={isPending} className='flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center'>Record</Button>
                </form>
            </div>

        </Dialog>
    )
}

export default RecordMoney