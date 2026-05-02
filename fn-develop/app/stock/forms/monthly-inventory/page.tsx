"use client"
import React, { useState, useMemo } from 'react'
import { useGetAllMonthlyInventories, useCreateMonthlyInventory, useApproveMonthlyInventory, useDeleteMonthlyInventory, useUploadFormProof } from '@/utlis/hooks/forms.hook'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { OrbitProgress } from 'react-loading-indicators'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { CiSearch } from 'react-icons/ci'
import { FiPrinter, FiPlus, FiTrash2, FiCheck, FiX, FiUploadCloud, FiExternalLink } from 'react-icons/fi'
import { toast } from 'sonner'
import Link from 'next/link'
import SignatureModal from '@/components/reusable/SignatureModal'
import { useSession } from 'next-auth/react'

const emptyItem = { item: '', initialStock: 0, purchasedStock: 0, consumedStock: 0, remainingStock: 0 }

const MonthlyInventory = () => {
  const { data, isLoading, refetch } = useGetAllMonthlyInventories()
  const { mutate: create, isPending: creating } = useCreateMonthlyInventory()
  const { mutate: approve } = useApproveMonthlyInventory()
  const { mutate: del } = useDeleteMonthlyInventory()
  const { mutate: uploadProof } = useUploadFormProof('monthly-inventories')

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [tradeNumber, setTradeNumber] = useState('')
  const [schoolYear, setSchoolYear] = useState('2024-2025')
  const [month, setMonth] = useState('')
  const [preparedBy, setPreparedBy] = useState('')
  const [checkedBy, setCheckedBy] = useState('')
  const [verifiedBy, setVerifiedBy] = useState('')
  const [items, setItems] = useState([{ ...emptyItem }])

  const [sigModal, setSigModal] = useState({ visible: false, id: '' })
  const { data: session } = useSession()

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter((o: any) =>
      o.tradeNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.month?.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  const updateItem = (idx: number, field: string, value: any) =>
    setItems(items.map((e, i) => i === idx ? { ...e, [field]: value } : e))

  const handleCreate = () => {
    if (!tradeNumber || !schoolYear || !month) { toast.error('Fill required fields'); return }
    create({ tradeNumber, schoolYear, month, items, preparedBy, checkedBy, verifiedBy }, {
      onSuccess: () => { toast.success('Monthly Inventory created'); setIsOpen(false); refetch() },
      onError: () => toast.error('Failed to create'),
    })
  }

  const statusTemplate = (row: any) => {
    const cls = row.status === 'approved' ? 'bg-green-100 text-green-700' : row.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
    return <span className={`px-2 py-1 rounded-full text-[11px] font-[600] uppercase ${cls}`}>{row.status}</span>
  }

  const actionTemplate = (row: any) => (
    <div className='flex gap-2'>
      <Link href={`/stock/forms/print/monthly-inventory/${row._id}`} target='_blank'><button className='p-2 rounded bg-blue-50 text-blue-700'><FiPrinter size={14} /></button></Link>
      {row.status === 'pending' && <>
        <button onClick={() => setSigModal({ visible: true, id: row._id })} className='p-2 rounded bg-green-50 text-green-700 hover:bg-green-100'><FiCheck size={14} /></button>
        <button onClick={() => approve({ id: row._id, action: 'rejected' }, { onSuccess: () => { toast.success('Rejected'); refetch() } })} className='p-2 rounded bg-red-50 text-red-700 hover:bg-red-100'><FiX size={14} /></button>
      </>}
      {row.status === 'approved' && !row.proofUrl && (
        <button onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*,.pdf'
          input.onchange = (e: any) => {
            if (e.target.files?.[0]) {
              const tId = toast.loading('Uploading proof...')
              uploadProof({ id: row._id, file: e.target.files[0] }, {
                onSuccess: () => { toast.success('Proof uploaded', { id: tId }); refetch() },
                onError: () => toast.error('Failed to upload proof', { id: tId })
              })
            }
          }
          input.click()
        }} className='p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100' title="Upload Signed Proof"><FiUploadCloud size={14} /></button>
      )}
      {row.proofUrl && (
        <Link href={row.proofUrl} target='_blank'>
          <button className='p-2 rounded bg-teal-50 text-teal-700 hover:bg-teal-100' title="View Proof"><FiExternalLink size={14} /></button>
        </Link>
      )}
      <button onClick={() => { del(row._id); refetch() }} className='p-2 rounded bg-gray-50 text-red-600 hover:bg-red-50'><FiTrash2 size={14} /></button>
    </div>
  )

  return (
    <div className='flex flex-col gap-4 p-6'>
      <div className='flex justify-between items-center'>
        <div><p className='text-[13px] text-gray-500'>Stock / Forms /</p><h1 className='text-[20px] font-[700]'>Annex VII: Monthly Inventory</h1></div>
        <button onClick={() => setIsOpen(true)} className='flex items-center gap-2 bg-[#2E3487] text-white px-4 py-2 rounded-[8px] text-[13px] hover:opacity-80'><FiPlus size={16} /> New Inventory Report</button>
      </div>

      <div className='flex justify-between items-center bg-white p-4 rounded-[8px]'>
        <span className='font-[600]'>All Monthly Inventories ({filtered.length})</span>
        <div className='flex items-center gap-2 border rounded-[6px] p-2 w-[280px]'><CiSearch size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search trade / month' className='text-[13px] outline-none w-full' /></div>
      </div>

      {isLoading ? <div className='flex justify-center p-20'><OrbitProgress color="#2E3487" size="small" text="" textColor="" /></div>
        : !filtered.length ? <div className='flex flex-col items-center justify-center p-16 bg-white rounded-[8px]'><GiEmptyWoodBucket size={60} color='lightgray' /><span className='font-[700] mt-2'>No monthly inventories found</span></div>
        : <DataTable value={filtered} paginator rows={10} className='w-full'>
          <Column field='month' header='Month' headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b font-[600]' />
          <Column field='tradeNumber' header='Trade' headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column field='schoolYear' header='School Year' headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column header='Items' body={(r) => r.items?.length || 0} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column header='Status' body={statusTemplate} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column header='Actions' body={actionTemplate} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
        </DataTable>}

      <Dialog header="New Monthly Inventory Report" visible={isOpen} onHide={() => setIsOpen(false)} className='w-[90vw] max-w-[850px]'>
        <div className='flex flex-col gap-4 p-2'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col gap-1'><label className='text-[12px] font-[600]'>Trade *</label><input value={tradeNumber} onChange={e => setTradeNumber(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' /></div>
            <div className='flex flex-col gap-1'><label className='text-[12px] font-[600]'>School Year *</label><input value={schoolYear} onChange={e => setSchoolYear(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' /></div>
            <div className='flex flex-col gap-1'><label className='text-[12px] font-[600]'>Month *</label><input value={month} onChange={e => setMonth(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' placeholder='e.g. October' /></div>
          </div>

          <div className='border rounded-[8px] overflow-hidden'>
            <table className='w-full text-[12px]'>
              <thead><tr className='bg-[#2E3487] text-white'>
                <th className='p-2 text-left'>Item</th>
                <th className='p-2 text-left w-20'>Initial</th>
                <th className='p-2 text-left w-20'>Purchased</th>
                <th className='p-2 text-left w-20'>Consumed</th>
                <th className='p-2 text-left w-20'>Remaining</th>
                <th className='p-2 w-8'></th>
              </tr></thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className='border-b'>
                    <td className='p-1'><input value={item.item} onChange={e => updateItem(idx, 'item', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input type='number' value={item.initialStock} onChange={e => updateItem(idx, 'initialStock', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input type='number' value={item.purchasedStock} onChange={e => updateItem(idx, 'purchasedStock', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input type='number' value={item.consumedStock} onChange={e => updateItem(idx, 'consumedStock', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input type='number' value={item.remainingStock} onChange={e => updateItem(idx, 'remainingStock', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'>{items.length > 1 && <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className='text-red-500'><FiTrash2 size={13} /></button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setItems([...items, { ...emptyItem }])} className='text-[13px] text-[#2E3487] font-[600] self-start'>+ Add Item Row</button>

          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col gap-1'><label className='text-[12px] font-[600]'>Prepared By (Storekeeper)</label><input value={preparedBy} onChange={e => setPreparedBy(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' /></div>
            <div className='flex flex-col gap-1'><label className='text-[12px] font-[600]'>Checked By (Logistics)</label><input value={checkedBy} onChange={e => setCheckedBy(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' /></div>
            <div className='flex flex-col gap-1'><label className='text-[12px] font-[600]'>Verified By (Accountant)</label><input value={verifiedBy} onChange={e => setVerifiedBy(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' /></div>
          </div>

          <div className='flex gap-3 justify-end'>
            <button onClick={() => setIsOpen(false)} className='px-4 py-2 border rounded-[6px] text-[13px]'>Cancel</button>
            <button onClick={handleCreate} disabled={creating} className='px-4 py-2 bg-[#2E3487] text-white rounded-[6px] text-[13px] hover:opacity-80 disabled:opacity-50'>{creating ? 'Creating...' : 'Create'}</button>
          </div>
        </div>
      </Dialog>
      <SignatureModal 
        visible={sigModal.visible} 
        onHide={() => setSigModal({ ...sigModal, visible: false })}
        onConfirm={(sig) => {
          const roleName = session?.user?.role === 'headteacher' ? 'Head Teacher' : 'Admin';
          approve({ id: sigModal.id, action: 'approved', approvedBy: roleName, signatureData: sig }, {
            onSuccess: () => { toast.success('Approved'); refetch(); setSigModal({ visible: false, id: '' }) },
            onError: () => toast.error('Failed to approve'),
          })
        }}
      />
    </div>
  )
}
export default MonthlyInventory
