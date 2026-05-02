"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  useGetPurchaseOrderById,
  useGetDeliveryNoteById,
  useGetReceivedNoteById,
  useGetStoreCardById,
  useGetRequisitionById,
  useGetMiniRequisitionById,
  useGetMonthlyInventoryById,
  useGetUtilizationReportById,
  useGetSchoolSettings
} from '@/utlis/hooks/forms.hook'
import { OrbitProgress } from 'react-loading-indicators'
import Image from 'next/image'

// ─── Helper ───────────────────────────────────────────────────────────────────

const fmtDate = (d: string | Date) => {
  if (!d) return '........'
  const dt = new Date(d)
  return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SchoolHeader = ({ settings }: { settings: any }) => (
  <div className='flex flex-row items-center gap-4 mb-4'>
    {settings?.logoUrl ? (
      <img src={settings.logoUrl} alt='School Logo' className='w-[80px] h-[80px] object-contain' />
    ) : (
      <div className='w-[80px] h-[80px] border-2 border-dashed border-gray-400 flex items-center justify-center text-[10px] text-gray-400 text-center'>School Logo</div>
    )}
    <div>
      <p className='text-[14px] font-[700]'>{settings?.schoolName || 'School Name'}</p>
      <p className='text-[12px]'>{settings?.address || 'School Address'}</p>
    </div>
  </div>
)

const SigLine = ({ label, name, signature }: { label: string; name?: string; signature?: string }) => (
  <div className='flex flex-col gap-1'>
    <p className='text-[11px] font-[600]'>{label}</p>
    <div className='relative h-[60px] w-[160px] flex items-end'>
      {signature ? (
        <img src={signature} alt='Signature' className='max-h-[50px] object-contain mb-[-10px]' />
      ) : (
        <p className='text-[11px] text-gray-500 mb-[-10px]'>{name || '................................'}</p>
      )}
    </div>
    <div className='border-b border-gray-300 w-[160px]'></div>
    {signature && <p className='text-[10px] text-gray-600 mt-1'>{name}</p>}
  </div>
)

// ─── Form Renderers ───────────────────────────────────────────────────────────

const PurchaseOrderPrint = ({ data, settings }: any) => (
  <div>
    <SchoolHeader settings={settings} />
    <h2 className='text-[15px] font-[800] mb-1'>Annex I: Purchase Order/ Bon de commande</h2>
    <p className='text-[11px] text-gray-500 mb-4'>School logo together with the name and address</p>
    <div className='flex flex-col gap-[6px] text-[12px] mb-4'>
      <p><strong>Trade:</strong> {data.tradeNumber}{"..".repeat(20)}</p>
      <p><strong>Date</strong> {fmtDate(data.date)}</p>
      <p><strong>Supplier:</strong> {data.supplierName}{"..".repeat(20)}</p>
      <p><strong>Purchase Order No............</strong></p>
    </div>
    <table className='w-full border-collapse text-[11px] mb-6'>
      <thead>
        <tr className='bg-[#5DADE2] text-white'>
          {['No', 'Item', 'Specifications', 'Unit', 'Quantity', 'UP (Frw)', 'TP (Frw)'].map(h => (
            <th key={h} className='border border-gray-300 p-2 text-left font-[600]'>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.items?.map((item: any, i: number) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className='border border-gray-200 p-2 text-center'>{i + 1}</td>
            <td className='border border-gray-200 p-2'>{item.item}</td>
            <td className='border border-gray-200 p-2'>{item.specifications}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.unit}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.quantity}</td>
            <td className='border border-gray-200 p-2 text-right'>{item.unitPrice?.toLocaleString()}</td>
            <td className='border border-gray-200 p-2 text-right'>{item.totalPrice?.toLocaleString()}</td>
          </tr>
        ))}
        <tr className='font-[700] bg-gray-100'>
          <td colSpan={6} className='border border-gray-200 p-2 text-right'>Total</td>
          <td className='border border-gray-200 p-2 text-right'>{data.totalAmount?.toLocaleString()} Frw</td>
        </tr>
      </tbody>
    </table>
    <div className='flex justify-between mt-8'>
      <SigLine label='Prepared by:' name={data.preparedBy || 'Accountant'} signature={data.preparedBySignature} />
      <SigLine label='Approved by:' name={data.approvedBy || 'Head Teacher'} signature={data.approvedBySignature} />
    </div>
  </div>
)

const DeliveryNotePrint = ({ data, settings }: any) => (
  <div>
    <SchoolHeader settings={settings} />
    <h2 className='text-[15px] font-[800] mb-1'>Annex II: Delivery note/ Bon de livraison</h2>
    <p className='text-[11px] text-gray-500 mb-4'>School logo together with the name and address</p>
    <div className='flex flex-col gap-[6px] text-[12px] mb-4'>
      <p><strong>Trade:</strong> {data.tradeNumber}{"..".repeat(20)}</p>
      <p><strong>Date</strong> {fmtDate(data.date)}</p>
      <p><strong>Delivery note No............</strong></p>
      <p><strong>Delivered against Purchase Order No........ </strong>{data.poNumber}</p>
    </div>
    <table className='w-full border-collapse text-[11px] mb-4'>
      <thead>
        <tr className='bg-[#5DADE2] text-white'>
          {['No', 'Item', 'Specifications', 'Unit', 'Quantity Ordered', 'Quantity Delivered'].map(h => (
            <th key={h} className='border border-gray-300 p-2 text-left font-[600]'>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.items?.map((item: any, i: number) => (
          <tr key={i}>
            <td className='border border-gray-200 p-2 text-center'>{i + 1}</td>
            <td className='border border-gray-200 p-2'>{item.item}</td>
            <td className='border border-gray-200 p-2'>{item.specifications}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.unit}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.quantityOrdered}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.quantityDelivered}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className='mt-4 text-[11px]'>
      <p className='font-[600] mb-1'>Delivered by:</p>
      <table className='w-full border-collapse mb-4'><thead><tr><th className='text-left p-1 w-8'>No</th><th className='text-left p-1'>Names</th><th className='text-left p-1'>Signature</th></tr></thead>
        <tbody>{(data.deliveredBy || []).map((d: any, i: number) => <tr key={i}><td className='p-1'>{i + 1}</td><td className='p-1 border-b w-[200px]'>{d.name}</td><td className='p-1 border-b w-[200px]'></td></tr>)}</tbody>
      </table>
      <div className='mb-4'><SigLine label='Approved by:' name={data.approvedBy || 'Managing Director'} signature={data.approvedBySignature} /></div>
      <p className='font-[600] mb-1'>Receiving committee members:</p>
      <table className='w-full border-collapse'><thead><tr><th className='text-left p-1 w-8'>No</th><th className='text-left p-1'>Names</th><th className='text-left p-1'>Signature</th></tr></thead>
        <tbody>{(data.receivingCommittee || []).map((d: any, i: number) => <tr key={i}><td className='p-1'>{i + 1}</td><td className='p-1 border-b w-[200px]'>{d.name}</td><td className='p-1 border-b w-[200px]'></td></tr>)}</tbody>
      </table>
    </div>
  </div>
)

const ReceivedNotePrint = ({ data, settings }: any) => (
  <div>
    <SchoolHeader settings={settings} />
    <h2 className='text-[15px] font-[800] mb-1'>Annex III: Goods received note/ Bon de reception de marchandises</h2>
    <p className='text-[11px] text-gray-500 mb-4'>School logo together with the name and address</p>
    <div className='flex flex-col gap-[6px] text-[12px] mb-4'>
      <p><strong>Trade:</strong> {data.tradeNumber}{"..".repeat(20)}</p>
      <p><strong>Date</strong> {fmtDate(data.date)}</p>
      <p><strong>Goods received note No............</strong></p>
      <p><strong>Received against Purchase Order No........ </strong>{data.poNumber}</p>
      <p><strong>We acknowledge receipt of the following goods from {"..".repeat(20)} (Supplier)</strong></p>
    </div>
    <table className='w-full border-collapse text-[11px] mb-4'>
      <thead>
        <tr className='bg-[#5DADE2] text-white'>
          {['No', 'Item', 'Specifications', 'Unit', 'Quantity', 'Remarks'].map(h => (
            <th key={h} className='border border-gray-300 p-2 text-left font-[600]'>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.items?.map((item: any, i: number) => (
          <tr key={i}>
            <td className='border border-gray-200 p-2 text-center'>{i + 1}</td>
            <td className='border border-gray-200 p-2'>{item.item}</td>
            <td className='border border-gray-200 p-2'>{item.specifications}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.unit}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.quantity}</td>
            <td className='border border-gray-200 p-2'>{item.remarks}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className='text-[11px]'>
      <p className='font-[600] mb-1'>Receiving committee members:</p>
      <table className='w-full border-collapse mb-4'><thead><tr><th className='text-left p-1 w-8'>No</th><th className='text-left p-1'>Names</th><th className='text-left p-1'>Signature</th></tr></thead>
        <tbody>{(data.committeeMembers || []).map((d: any, i: number) => <tr key={i}><td className='p-1'>{i + 1}</td><td className='p-1 border-b w-[200px]'>{d.name}</td><td className='p-1 border-b w-[200px]'></td></tr>)}</tbody>
      </table>
      <SigLine label='Approved by:' name={data.approvedBy || 'Logistics Officer'} signature={data.approvedBySignature} />
    </div>
  </div>
)

const RequisitionPrint = ({ data, settings }: any) => (
  <div>
    <SchoolHeader settings={settings} />
    <h2 className='text-[15px] font-[800] mb-1'>Annex V: Consumables requisition form used for the main store</h2>
    <p className='text-[11px] text-gray-500 mb-4'>School logo together with the name and address</p>
    <div className='flex flex-col gap-[6px] text-[12px] mb-4'>
      <p><strong>Requisitioning Trade:</strong> {data.tradeNumber}{"..".repeat(20)}</p>
      <p><strong>Date</strong> {fmtDate(data.date)}</p>
      <p><strong>Consumables Requisition Voucher NO............/{new Date(data.date).getFullYear()} (Year)</strong></p>
    </div>
    <table className='w-full border-collapse text-[11px] mb-6'>
      <thead>
        <tr className='bg-[#5DADE2] text-white'>
          {['No', 'Item', 'Quantity Requisitioned', 'Quantity Received', 'Observation'].map(h => (
            <th key={h} className='border border-gray-300 p-2 text-left font-[600]'>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.items?.map((item: any, i: number) => (
          <tr key={i}>
            <td className='border border-gray-200 p-2 text-center'>{i + 1}</td>
            <td className='border border-gray-200 p-2'>{item.item}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.quantityRequisitioned}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.quantityReceived}</td>
            <td className='border border-gray-200 p-2'>{item.observation}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className='grid grid-cols-4 gap-4 text-[11px]'>
      <SigLine label='Requested by:' name={data.requestedBy || 'Workshop Assistant'} signature={data.requestedBySignature} />
      <SigLine label='Verified by:' name={data.verifiedByDept || 'Head of Department/ Sector'} signature={data.verifiedByDeptSignature} />
      <SigLine label='Verified by:' name={data.verifiedByLogistics || 'Logistics Officer'} signature={data.verifiedByLogisticsSignature} />
      <SigLine label='Checked by:' name={data.checkedByDHT || 'DHT in charge of Studies'} signature={data.checkedByDHTSignature} />
    </div>
    <div className='mt-4'><SigLine label='Approved by:' name={data.approvedByHT || 'Head Teacher'} signature={data.approvedByHTSignature} /></div>
  </div>
)

const StoreCardPrint = ({ data, settings }: any) => (
  <div>
    <SchoolHeader settings={settings} />
    <h2 className='text-[15px] font-[800] mb-1'>Annex IV: Store card/ Carte de magasin</h2>
    <p className='text-[11px] text-gray-500 mb-4'>School logo together with the name and address</p>
    <div className='flex flex-col gap-[6px] text-[12px] mb-4'>
      <p><strong>Trade:</strong> {data.tradeNumber}{"..".repeat(20)}</p>
      <p><strong>School Year:</strong> {data.schoolYear}{"..".repeat(20)}</p>
      <p><strong>Item Description:</strong> {data.itemDescription}{"..".repeat(20)}</p>
    </div>
    <table className='w-full border-collapse text-[11px] mb-6'>
      <thead>
        <tr className='bg-[#5DADE2] text-white'>
          {['Date', 'Qty received', 'Qty requested', 'Balance', "User's name", "User's signature"].map(h => (
            <th key={h} className='border border-gray-300 p-2 text-left font-[600]'>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(data.entries || []).map((entry: any, i: number) => (
          <tr key={i} className='border-b border-gray-200'>
            <td className='border border-gray-200 p-2'>{fmtDate(entry.date)}</td>
            <td className='border border-gray-200 p-2 text-center'>{entry.qtyReceived}</td>
            <td className='border border-gray-200 p-2 text-center'>{entry.qtyRequested}</td>
            <td className='border border-gray-200 p-2 text-center'>{entry.balance}</td>
            <td className='border border-gray-200 p-2'>{entry.userName}</td>
            <td className='border border-gray-200 p-2'></td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className='flex justify-between mt-4'>
      <SigLine label='Prepared by:' name={data.preparedBy || 'Storekeeper/ Workshop Assistant'} signature={data.preparedBySignature} />
      <SigLine label='Verified by:' name={data.verifiedBy || 'Accountant'} signature={data.verifiedBySignature} />
    </div>
  </div>
)

const MiniRequisitionPrint = ({ data, settings }: any) => (
  <div>
    <SchoolHeader settings={settings} />
    <h2 className='text-[15px] font-[800] mb-1'>Annex VI: Consumables requisition form used for the mini store</h2>
    <p className='text-[11px] text-gray-500 mb-4'>School logo together with the name and address</p>
    <div className='flex flex-col gap-[6px] text-[12px] mb-4'>
      <p><strong>Requisitioning Trade:</strong> {data.tradeNumber}{"..".repeat(20)}</p>
      <p><strong>Date</strong> {fmtDate(data.date)}</p>
      <p><strong>Consumables Requisition Voucher NO............/{new Date(data.date).getFullYear()} (Year)</strong></p>
    </div>
    <table className='w-full border-collapse text-[11px] mb-6'>
      <thead>
        <tr className='bg-[#5DADE2] text-white'>
          {['No', 'Item', 'Quantity Requisitioned', 'Quantity Received', 'Observation'].map(h => (
            <th key={h} className='border border-gray-300 p-2 text-left font-[600]'>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.items?.map((item: any, i: number) => (
          <tr key={i}>
            <td className='border border-gray-200 p-2 text-center'>{i + 1}</td>
            <td className='border border-gray-200 p-2'>{item.item}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.quantityRequisitioned}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.quantityReceived}</td>
            <td className='border border-gray-200 p-2'>{item.observation}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className='grid grid-cols-3 gap-4 text-[11px] mt-4'>
      <SigLine label='Requested by:' name={data.requestedBy || 'Trainer'} signature={data.requestedBySignature} />
      <SigLine label='Verified by:' name={data.verifiedByAssistant || 'Workshop Assistant'} signature={data.verifiedByAssistantSignature} />
      <SigLine label='Approved by:' name={data.approvedByDHT || 'DHT/ Head of Department'} signature={data.approvedByDHTSignature} />
    </div>
  </div>
)

const MonthlyInventoryPrint = ({ data, settings }: any) => (
  <div>
    <SchoolHeader settings={settings} />
    <h2 className='text-[15px] font-[800] mb-1'>Annex VII: Monthly Inventory Report</h2>
    <p className='text-[11px] text-gray-500 mb-4'>School logo together with the name and address</p>
    <div className='flex flex-col gap-[6px] text-[12px] mb-4'>
      <p><strong>Trade:</strong> {data.tradeNumber}{"..".repeat(20)}</p>
      <p><strong>School Year:</strong> {data.schoolYear}{"..".repeat(20)}</p>
      <p><strong>Month:</strong> {data.month}{"..".repeat(20)}</p>
    </div>
    <table className='w-full border-collapse text-[11px] mb-6'>
      <thead>
        <tr className='bg-[#5DADE2] text-white'>
          {['No', 'Item', 'Initial Stock', 'Purchased stock', 'Consumed stock', 'Remaining stock'].map(h => (
            <th key={h} className='border border-gray-300 p-2 text-left font-[600]'>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.items?.map((item: any, i: number) => (
          <tr key={i}>
            <td className='border border-gray-200 p-2 text-center'>{i + 1}</td>
            <td className='border border-gray-200 p-2'>{item.item}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.initialStock}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.purchasedStock}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.consumedStock}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.remainingStock}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className='grid grid-cols-4 gap-4 text-[11px] mt-4'>
      <SigLine label='Prepared by:' name={data.preparedBy || 'Storekeeper'} signature={data.preparedBySignature} />
      <SigLine label='Checked by:' name={data.checkedBy || 'Logistics Officer'} signature={data.checkedBySignature} />
      <SigLine label='Verified by:' name={data.verifiedBy || 'Accountant'} signature={data.verifiedBySignature} />
      <SigLine label='Approved by:' name={data.approvedBy || 'Head Teacher'} signature={data.approvedBySignature} />
    </div>
  </div>
)

const UtilizationReportPrint = ({ data, settings }: any) => (
  <div>
    <SchoolHeader settings={settings} />
    <h2 className='text-[15px] font-[800] mb-1'>Annex VIII: Consumables utilization report form</h2>
    <p className='text-[11px] text-gray-500 mb-4'>School logo together with the name and address</p>
    <div className='flex flex-col gap-[6px] text-[12px] mb-4'>
      <p><strong>Trade:</strong> {data.tradeNumber}{"..".repeat(20)}</p>
      <p><strong>RQF Level:</strong> {data.rqfLevel}{"..".repeat(20)}</p>
      <p><strong>Title of Module:</strong> {data.titleOfModule}{"..".repeat(20)}</p>
      <p><strong>School Year:</strong> {data.schoolYear}{"..".repeat(20)}</p>
      <p><strong>Date of Submission:</strong> {fmtDate(data.dateOfSubmission)}</p>
    </div>
    <table className='w-full border-collapse text-[11px] mb-6'>
      <thead>
        <tr className='bg-[#5DADE2] text-white'>
          {['No', 'Item', 'Quantity received', 'Total number of students', 'Quantity utilized', 'Balance', 'Class representative signature'].map(h => (
            <th key={h} className='border border-gray-300 p-2 text-left font-[600]'>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.items?.map((item: any, i: number) => (
          <tr key={i}>
            <td className='border border-gray-200 p-2 text-center'>{i + 1}</td>
            <td className='border border-gray-200 p-2'>{item.item}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.quantityReceived}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.totalStudents}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.quantityUtilized}</td>
            <td className='border border-gray-200 p-2 text-center'>{item.balance}</td>
            <td className='border border-gray-200 p-2 text-center'></td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className='grid grid-cols-3 gap-4 text-[11px] mt-4'>
      <SigLine label='Prepared by:' name={data.preparedBy || 'Teacher'} signature={data.preparedBySignature} />
      <SigLine label='Checked by:' name={data.checkedBy || 'Workshop Assistant'} signature={data.checkedBySignature} />
      <SigLine label='Approved by:' name={data.approvedBy || 'Head of Department'} signature={data.approvedBySignature} />
    </div>
  </div>
)

// ─── Main Print Page ──────────────────────────────────────────────────────────

const PrintPage = () => {
  const { type, id } = useParams() as { type: string; id: string }
  const { data: settings } = useGetSchoolSettings()

  const poQuery = useGetPurchaseOrderById(type === 'purchase-order' ? id : '')
  const dnQuery = useGetDeliveryNoteById(type === 'delivery-note' ? id : '')
  const grnQuery = useGetReceivedNoteById(type === 'received-note' ? id : '')
  const scQuery = useGetStoreCardById(type === 'store-card' ? id : '')
  const rqQuery = useGetRequisitionById(type === 'requisition' ? id : '')
  const mrqQuery = useGetMiniRequisitionById(type === 'mini-requisition' ? id : '')
  const minvQuery = useGetMonthlyInventoryById(type === 'monthly-inventory' ? id : '')
  const urepQuery = useGetUtilizationReportById(type === 'utilization-report' ? id : '')

  const queryMap: Record<string, any> = {
    'purchase-order': poQuery,
    'delivery-note': dnQuery,
    'received-note': grnQuery,
    'store-card': scQuery,
    'requisition': rqQuery,
    'mini-requisition': mrqQuery,
    'monthly-inventory': minvQuery,
    'utilization-report': urepQuery,
  }

  const { data, isLoading } = queryMap[type] || {}

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => window.print(), 500)
      return () => clearTimeout(timer)
    }
  }, [data])

  if (isLoading || !data) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
      </div>
    )
  }

  const renderForm = () => {
    switch (type) {
      case 'purchase-order': return <PurchaseOrderPrint data={data} settings={settings} />
      case 'delivery-note': return <DeliveryNotePrint data={data} settings={settings} />
      case 'received-note': return <ReceivedNotePrint data={data} settings={settings} />
      case 'store-card': return <StoreCardPrint data={data} settings={settings} />
      case 'requisition': return <RequisitionPrint data={data} settings={settings} />
      case 'mini-requisition': return <MiniRequisitionPrint data={data} settings={settings} />
      case 'monthly-inventory': return <MonthlyInventoryPrint data={data} settings={settings} />
      case 'utilization-report': return <UtilizationReportPrint data={data} settings={settings} />
      default: return <p>Unknown form type</p>
    }
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          .print-page { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div className='min-h-screen bg-gray-100 flex flex-col items-center py-8 no-print-bg'>
        {/* Print toolbar */}
        <div className='no-print flex gap-4 mb-6 bg-white px-6 py-3 rounded-[8px] shadow-sm'>
          <button onClick={() => window.print()} className='flex items-center gap-2 bg-[#2E3487] text-white px-5 py-2 rounded-[6px] text-[13px] hover:opacity-80'>
            🖨 Print / Save as PDF
          </button>
          <button onClick={() => window.close()} className='px-5 py-2 border rounded-[6px] text-[13px]'>Close</button>
          <span className='flex items-center text-[12px] text-green-600 font-[600]'>
            {data.status === 'approved' ? '✅ Approved' : data.status === 'rejected' ? '❌ Rejected' : '⏳ Pending Approval'}
          </span>
        </div>

        {/* The actual form – styled like the official documents */}
        <div className='print-page bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-lg border border-gray-200 text-[12px] font-sans'>
          {renderForm()}

          {/* Footer */}
          <div className='mt-12 pt-4 border-t border-gray-200 flex justify-between text-[10px] text-gray-400'>
            <span>Amabwiriza avuguruye ku mikoreshereze y&apos;amafaranga yagenewe ibikoresho bishira (TVET School training consumables), 2024-2025</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrintPage
