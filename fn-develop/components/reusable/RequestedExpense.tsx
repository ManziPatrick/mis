import { Dialog } from 'primereact/dialog'
import React from 'react'

interface expenseType {
    expenseData: any,
    isViewOpen: boolean,
    onHide: () => void,
}

const RequestedExpense = ({expenseData,isViewOpen,onHide}:expenseType) => {
  return (
    <Dialog header={'Requested'}  visible={isViewOpen} onHide={onHide} className=''>
        <div className='w-full flex flex-col gap-[10px]'></div>

    </Dialog>
  )
}

export default RequestedExpense