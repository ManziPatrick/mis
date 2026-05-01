import { useGetSingleVouchersByRequest } from '@/utlis/hooks/expense.hook'
import Image from 'next/image';
import { Dialog } from 'primereact/dialog'
import React, { useRef } from 'react'
import { OrbitProgress } from 'react-loading-indicators'
import { useReactToPrint } from "react-to-print";
import { toWords } from 'number-to-words';

interface modalType {
  visible: boolean;
  setIsVisble: any;
  requestId: string;
  voucher: any;
  isLoading: boolean

}

const VoucherModal = ({ visible, setIsVisble, requestId, voucher, isLoading }: modalType) => {

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <Dialog header="Voucher" visible={visible} onHide={() => setIsVisble(false)} className='w-[80%] h-[80%]'>
      <div className='w-full flex flex-col gap-[10px]'>
        {isLoading ? (
          <div className='w-full p-20 flex items-center justify-center '>
            <div className='w-full p-10 flex items-center justify-center'>
              <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
            </div>
          </div>
        ) : (
          voucher && (
            <div ref={contentRef} className='w-full flex flex-col gap-[10px] px-4  justify-center'>
              <div className='flex flex-row gap-[40px] items-center py-6 mx-auto border-b-2 w-full'>
                <div className='w-[140px] h-[140px]'>
                  <Image src={`/image/logo2.png`} width={1000} height={1000} alt='' className='w-full h-full' />
                </div>
                <div className='flex flex-col items-center'>
                  <h1 className='text-[24px] font-[700]'>INTERNATIONAL TECHNICAL SCHOOL OF KIGALI</h1>
                  <h2 className='text-[20px] font-[700]'>(MIS KIGALI)</h2>
                  <span className='text-[16px] font-[700]'>P.O BOX 337 KIGALI-RWANDA/GASABO District-NDERA Sector</span>
                  <span className='text-[16px] font-[700]'>TEL: (+250) 78861933 / 788850591</span>
                  <span className='text-[16px] font-[700]'>Email: info@miskigali.com</span>
                </div>
              </div>
              <div className='mx-auto w-full flex flex-col gap-[20px] mt-10 px-4'>
                <div className='w-full flex flex-row justify-between items-center'>
                  <h1 className='text-[18px]'>PAYMENT VOUCHER</h1>
                  <h1><span className='font-[700]'>NUMBER:</span> {voucher?.voucher_number}</h1>
                </div>

                <div className='flex flex-row gap-[4px] items-center'>
                  <h1 className='text-[18px]'>Date:</h1>
                  <span>{new Date(voucher.createdAt).getDate()}</span>
                  <span>/</span>
                  <span>{new Date(voucher.createdAt).getMonth()}</span>
                  <span>/</span>
                  <span>{new Date(voucher.createdAt).getFullYear()}</span>
                </div>
                <div className='flex flex-row gap-[10px] items-center'>
                  <h1 className='text-[18px]'>SUM IN FIGURE:</h1>
                  <h1 className='text-[18px] border-b border-[#565656] border-dashed'>{voucher?.amount_paid}</h1>
                </div>
                <div className='flex flex-row gap-[10px] items-center'>
                  <h1 className='text-[18px]'>SUM IN WORD:</h1>
                  <h1 className='text-[18px] border-b border-[#565656] border-dashed'>{voucher?.amount_paid && toWords(voucher?.amount_paid)}</h1>
                </div>
                <div className='flex flex-row gap-[10px] items-center'>
                  <h1 className='text-[18px]'>METHOD OF PAYMENT:</h1>
                  <h1 className='text-[18px] border-b border-[#565656] border-dashed'>{voucher?.payment_mode}</h1>
                </div>
                <div className='flex flex-row gap-[10px] items-center'>
                  <h1 className='text-[18px]'>PAYMENT ACOOUNT:</h1>
                  <h1 className='text-[18px] border-b border-[#565656] border-dashed'>{voucher?.payment_account}</h1>
                </div>
                <div className='flex flex-row gap-[10px] items-center'>
                  <h1 className='text-[18px]'>BENEFICIARY:</h1>
                  <h1 className='text-[18px] border-b border-[#565656] border-dashed'>{voucher?.beneficiary}</h1>
                </div>
                <div className='flex flex-row gap-[10px] items-center'>
                  <h1 className='text-[18px]'>DESCRIPTION:</h1>
                  <h1 className='text-[18px] border-b border-[#565656] border-dashed'>{voucher?.description}</h1>
                </div>
                <div className='flex flex-row items-center justify-between'>
                  <div className='flex flex-row gap-[10px] items-center'>
                    <h1 className='text-[18px]'>PREPARED BY:</h1>
                    <h1 className='text-[18px] border-b border-[#565656] border-dashed'>{voucher?.prepared_by?.firstName} {voucher?.prepared_by?.lastName}</h1>
                  </div>
                  <div className='flex flex-row gap-[10px] items-center'>
                    <h1 className='text-[18px]'>RECEIVED BY:</h1>
                    <h1 className='text-[18px] border-b border-[#565656] border-dashed'>{voucher?.beneficiary}</h1>
                  </div>
                </div>
                <div className='flex flex-row gap-[10px] items-center'>
                  <h1 className='text-[18px]'>CHECKED AND APPROVED BY:</h1>
                  <h1 className='text-[18px] border-b border-[#565656] border-dashed'>{`admin`}</h1>
                </div>
              </div>

            </div>
          )
        )}
        <button onClick={() => reactToPrintFn()}>Print</button>

      </div>

    </Dialog>
  )
}

export default VoucherModal