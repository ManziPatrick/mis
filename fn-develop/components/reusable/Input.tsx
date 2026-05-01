import { InputType } from '@/utlis/types/type.types'
import React from 'react'


const Input = ({label,type,onChange,placeholder}: InputType) => {
  return (
    <div className='flex flex-col gap-[10px]'>
        <span className='text-[12px]'>{label}</span>
        <input type={type} className='w-full p-4 border rounded-[8px]' onChange={onChange} placeholder={placeholder}/>
    </div>
  )
}

export default Input