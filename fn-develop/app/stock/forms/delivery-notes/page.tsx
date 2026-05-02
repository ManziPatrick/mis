"use client"
import React, { useState, useMemo } from 'react'
import { useGetAllDeliveryNotes, useCreateDeliveryNote, useApproveDeliveryNote, useDeleteDeliveryNote, useUploadFormProof } from '@/utlis/hooks/forms.hook'
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

const emptyItem = { item: '', specifications: '', unit: 'pcs', quantityOrdered: 1, quantityDelivered: 1 }

const DeliveryNotes = () => {
  const { data, isLoading, refetch } = useGetAllDeliveryNotes()
  const { mutate: create, isPending: creating } = useCreateDeliveryNote()
  const { mutate: approve } = useApproveDeliveryNote()
  const { mutate: del } = useDeleteDeliveryNote()
  const { mutate: uploadProof } = useUploadFormProof('delivery-notes')

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [poNumber, setPoNumber] = useState('')
  const [tradeNumber, setTradeNumber] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState([{ ...emptyItem }])
  const [deliveredBy, setDeliveredBy] = useState([{ name: '' }, { name: '' }])
  const [committee, setCommittee] = useState([{ name: '' }, { name: '' }, { name: '' }])

  const [sigModal, setSigModal] = useState({ visible: false, id: '' })
  const { data: session } = useSession()

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter((o: any) => o.dnNumber?.toLowerCase().includes(search.toLowerCase()) || o.poNumber?.toLowerCase().includes(search.toLowerCase()))
  }, [data, search])

  const updateItem = (idx: number, field: string, value: any) => setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  const updateDelivered = (idx: number, value: string) => setDeliveredBy(deliveredBy.map((d, i) => i === idx ? { name: value } : d))
  const updateCommittee = (idx: number, value: string) => setCommittee(committee.map((d, i) => i === idx ? { name: value } : d))

  const handleCreate = () => {
    if (!poNumber || !tradeNumber || !date) { toast.error('Fill all required fields'); return }
    create({ poNumber, tradeNumber, date, items, deliveredBy: deliveredBy.filter(d => d.name), receivingCommittee: committee.filter(d => d.name) }, {
      onSuccess: () => { toast.success('Delivery Note created'); setIsOpen(false); refetch() },
      onError: () => toast.error('Failed to create'),
    })
  }

  const statusTemplate = (row: any) => {
    const cls = row.status === 'approved' ? 'bg-green-100 text-green-700' : row.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
    return <span className={`px-2 py-1 rounded-full text-[11px] font-[600] uppercase ${cls}`}>{row.status}</span>
  }

  const actionTemplate = (row: any) => (
    <div className='flex flex-row gap-2'>
      <Link href={`/stock/forms/print/delivery-note/${row._id}`} target='_blank'>
        <button className='p-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100'><FiPrinter size={14} /></button>
      </Link>
      {row.status === 'pending' && (
        <>
          <button onClick={() => setSigModal({ visible: true, id: row._id })} className='p-2 rounded bg-green-50 text-green-700 hover:bg-green-100'><FiCheck size={14} /></button>
          <button onClick={() => { approve({ id: row._id, action: 'rejected' }, { onSuccess: () => { toast.success('Rejected'); refetch() } }) }} className='p-2 rounded bg-red-50 text-red-700 hover:bg-red-100'><FiX size={14} /></button>
        </>
      )}
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
        <div>
          <p className='text-[13px] text-gray-500'>Stock / Forms /</p>
          <h1 className='text-[20px] font-[700]'>Annex II: Delivery Notes</h1>
        </div>
        <button onClick={() => setIsOpen(true)} className='flex items-center gap-2 bg-[#2E3487] text-white px-4 py-2 rounded-[8px] text-[13px] hover:opacity-80'>
          <FiPlus size={16} /> New Delivery Note
        </button>
      </div>

      <div className='flex justify-between items-center bg-white p-4 rounded-[8px]'>
        <span className='font-[600]'>All Delivery Notes ({filtered.length})</span>
        <div className='flex items-center gap-2 border rounded-[6px] p-2 w-[280px]'>
          <CiSearch size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search by DN No / PO No' className='text-[13px] outline-none w-full' />
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center p-20'><OrbitProgress color="#2E3487" size="small" text="" textColor="" /></div>
      ) : !filtered.length ? (
        <div className='flex flex-col items-center justify-center p-16 bg-white rounded-[8px]'>
          <GiEmptyWoodBucket size={60} color='lightgray' /><span className='font-[700] mt-2'>No delivery notes found</span>
        </div>
      ) : (
        <DataTable value={filtered} paginator rows={10} className='w-full'>
          <Column header="#" body={(_r, o) => (o.rowIndex + 1).toString().padStart(3, '0')} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column field='dnNumber' header='DN Number' headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b font-[600]' />
          <Column field='poNumber' header='PO Reference' headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column field='tradeNumber' header='Trade' headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column field='date' header='Date' body={(r) => new Date(r.date).toLocaleDateString()} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column header='Status' body={statusTemplate} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column header='Actions' body={actionTemplate} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
        </DataTable>
      )}

      <Dialog header="New Delivery Note" visible={isOpen} onHide={() => setIsOpen(false)} className='w-[90vw] max-w-[860px]'>
        <div className='flex flex-col gap-4 p-2'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col gap-1'><label className='text-[12px] font-[600]'>Trade *</label><input value={tradeNumber} onChange={e => setTradeNumber(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' /></div>
            <div className='flex flex-col gap-1'><label className='text-[12px] font-[600]'>PO Reference *</label><input value={poNumber} onChange={e => setPoNumber(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' /></div>
            <div className='flex flex-col gap-1'><label className='text-[12px] font-[600]'>Date *</label><input type='date' value={date} onChange={e => setDate(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' /></div>
          </div>

          <div className='border rounded-[8px] overflow-hidden'>
            <table className='w-full text-[12px]'>
              <thead><tr className='bg-[#2E3487] text-white'>
                <th className='p-2 w-8'>#</th><th className='p-2 text-left'>Item</th><th className='p-2 text-left'>Specifications</th>
                <th className='p-2 w-16'>Unit</th><th className='p-2 w-20'>Qty Ordered</th><th className='p-2 w-24'>Qty Delivered</th><th className='p-2 w-8'></th>
              </tr></thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className='border-b'>
                    <td className='p-1 text-center'>{idx + 1}</td>
                    <td className='p-1'><input value={item.item} onChange={e => updateItem(idx, 'item', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input value={item.specifications} onChange={e => updateItem(idx, 'specifications', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input type='number' value={item.quantityOrdered} onChange={e => updateItem(idx, 'quantityOrdered', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input type='number' value={item.quantityDelivered} onChange={e => updateItem(idx, 'quantityDelivered', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'>{items.length > 1 && <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className='text-red-500'><FiTrash2 size={13} /></button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setItems([...items, { ...emptyItem }])} className='text-[13px] text-[#2E3487] font-[600] hover:underline self-start'>+ Add Row</button>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-[12px] font-[700] mb-2'>Delivered By</p>
              {deliveredBy.map((d, i) => <input key={i} value={d.name} onChange={e => updateDelivered(i, e.target.value)} className='border rounded p-2 text-[12px] outline-none w-full mb-2' placeholder={`Person ${i + 1} name`} />)}
            </div>
            <div>
              <p className='text-[12px] font-[700] mb-2'>Receiving Committee</p>
              {committee.map((d, i) => <input key={i} value={d.name} onChange={e => updateCommittee(i, e.target.value)} className='border rounded p-2 text-[12px] outline-none w-full mb-2' placeholder={`Member ${i + 1} name`} />)}
            </div>
          </div>

          <div className='flex gap-3 justify-end'>
            <button onClick={() => setIsOpen(false)} className='px-4 py-2 border rounded-[6px] text-[13px]'>Cancel</button>
            <button onClick={handleCreate} disabled={creating} className='px-4 py-2 bg-[#2E3487] text-white rounded-[6px] text-[13px] hover:opacity-80 disabled:opacity-50'>
              {creating ? 'Creating...' : 'Create Delivery Note'}
            </button>
          </div>
        </div>
      </Dialog>
      <SignatureModal 
        visible={sigModal.visible} 
        onHide={() => setSigModal({ ...sigModal, visible: false })}
        onConfirm={(sig) => {
          const roleName = session?.user?.role === 'md' ? 'Managing Director' : 'Admin';
          approve({ id: sigModal.id, action: 'approved', approvedBy: roleName, signatureData: sig }, {
            onSuccess: () => { toast.success('Approved'); refetch(); setSigModal({ visible: false, id: '' }) },
            onError: () => toast.error('Failed to approve'),
          })
        }}
      />
    </div>
  )
}

export default DeliveryNotes
