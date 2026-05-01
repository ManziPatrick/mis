import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'

interface FilterModalProps {
    visible: boolean
    onHide: () => void
    categories?: any[]
    filterData?: any
    setFilterData?: any
}

const FilterModal = ({ visible, onHide, categories, filterData, setFilterData }: FilterModalProps) => {
    
    const handleCategoryChange = (e: any) => {
        setFilterData({...filterData, category: e.target.value})
    }


    return (
        <Dialog visible={visible} onHide={onHide} header="Filter" className='w-1/3'>
            <div className='w-full flex flex-col gap-[10px] items-center'>

                <div className='w-full flex flex-col gap-[10px]'>
                    <div className='w-full flex flex-col gap-[10px]'>
                        <span className='text-[14px] text-black'>{`category`}</span>
                        <select value={filterData.category} onChange={handleCategoryChange} className='border p-3 text-[13px] rounded-[12px]'>
                            <option value="all">All</option>

                            {categories?.map((category:any,index:number) => (
                                <option key={index} value={category._id}>{category.name}</option>
                            ))}
                        </select>

                    </div>
                </div>


            </div>



        </Dialog>
    )
}

export default FilterModal