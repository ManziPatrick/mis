"use client"
import React, { useState, useMemo } from 'react'
import { useGetAllPurchaseOrders, useCreatePurchaseOrder, useApprovePurchaseOrder, useDeletePurchaseOrder, useUploadFormProof } from '@/utlis/hooks/forms.hook'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { OrbitProgress } from 'react-loading-indicators'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { CiSearch } from 'react-icons/ci'
import { FiPrinter, FiPlus, FiTrash2, FiCheck, FiX, FiUploadCloud, FiExternalLink } from 'react-icons/fi'
import { toast } from 'sonner'
import Link from 'next/link'
import SignatureModal from '@/components/reusable/SignatureModal'
import { useSession } from 'next-auth/react'

const emptyItem = { item: '', specifications: '', unit: 'pcs', quantity: 1, unitPrice: 0, totalPrice: 0 }

const PurchaseOrders = () => {
  const { data, isLoading, refetch } = useGetAllPurchaseOrders()
  const { mutate: createPO, isPending: creating } = useCreatePurchaseOrder()
  const { mutate: approvePO, isPending: approving } = useApprovePurchaseOrder()
  const { mutate: deletePO } = useDeletePurchaseOrder()
  const { mutate: uploadProof } = useUploadFormProof('purchase-orders')

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [tradeNumber, setTradeNumber] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [supplierName, setSupplierName] = useState('')
  const [preparedBy, setPreparedBy] = useState('')
  const [items, setItems] = useState([{ ...emptyItem }])

  const [sigModal, setSigModal] = useState({ visible: false, type: '', id: '' })
  const { data: session } = useSession()

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter((o: any) =>
      o.poNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.supplierName?.toLowerCase().includes(search.toLowerCase()) ||
      o.tradeNumber?.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  const updateItem = (idx: number, field: string, value: any) => {
    const updated = items.map((item, i) => {
      if (i !== idx) return item
      const newItem = { ...item, [field]: value }
      newItem.totalPrice = (field === 'quantity' ? +value : +newItem.quantity) * (field === 'unitPrice' ? +value : +newItem.unitPrice)
      return newItem
    })
    setItems(updated)
  }

  const totalAmount = items.reduce((s, i) => s + (i.totalPrice || 0), 0)

  const handleCreate = () => {
    if (!tradeNumber || !supplierName || !date) { toast.error('Fill all required fields'); return }
    setSigModal({ visible: true, type: 'create', id: '' })
  }

  const onConfirmCreate = (sig: string) => {
    createPO({ tradeNumber, date, supplierName, preparedBy, items, preparedBySignatureData: sig }, {
      onSuccess: () => { 
        toast.success('Purchase Order created'); 
        setIsOpen(false); 
        resetForm(); 
        refetch();
        setSigModal({ visible: false, type: '', id: '' });
      },
      onError: () => toast.error('Failed to create Purchase Order'),
    })
  }

  const resetForm = () => {
    setTradeNumber(''); setDate(new Date().toISOString().split('T')[0])
    setSupplierName(''); setPreparedBy(''); setItems([{ ...emptyItem }])
  }

  const handleApprove = (id: string) => {
    setSigModal({ visible: true, type: 'approve', id })
  }

  const onConfirmApprove = (sig: string) => {
    const roleName = session?.user?.role === 'headteacher' ? 'Head Teacher' : 'Admin';
    approvePO({ id: sigModal.id, action: 'approved', approvedBy: roleName, signatureData: sig }, {
      onSuccess: () => { 
        toast.success('Approved'); 
        refetch();
        setSigModal({ visible: false, type: '', id: '' });
      },
      onError: () => toast.error('Failed to approve'),
    })
  }

  const handleReject = (id: string) => {
    approvePO({ id, action: 'rejected', rejectionReason: 'Rejected by admin' }, {
      onSuccess: () => { toast.success('Rejected'); refetch() },
      onError: () => toast.error('Failed to reject'),
    })
  }

  const handleUploadProof = (id: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,.pdf'
    input.onchange = (e: any) => {
      if (e.target.files?.[0]) {
        const tId = toast.loading('Uploading proof...')
        uploadProof({ id, file: e.target.files[0] }, {
          onSuccess: () => { toast.success('Proof uploaded', { id: tId }); refetch() },
          onError: () => toast.error('Failed to upload proof', { id: tId })
        })
      }
    }
    input.click()
  }

  const statusTemplate = (row: any) => {
    const cls = row.status === 'approved' ? 'bg-green-100 text-green-700' : row.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
    return <span className={`px-2 py-1 rounded-full text-[11px] font-[600] uppercase ${cls}`}>{row.status}</span>
  }

  const actionTemplate = (row: any) => (
    <div className='flex flex-row gap-2'>
      <Link href={`/stock/forms/print/purchase-order/${row._id}`} target='_blank'>
        <button className='p-2 rounded-[4px] bg-blue-50 text-blue-700 hover:bg-blue-100'><FiPrinter size={14} /></button>
      </Link>
      {row.status === 'pending' && (
        <>
          <button onClick={() => handleApprove(row._id)} className='p-2 rounded-[4px] bg-green-50 text-green-700 hover:bg-green-100'><FiCheck size={14} /></button>
          <button onClick={() => handleReject(row._id)} className='p-2 rounded-[4px] bg-red-50 text-red-700 hover:bg-red-100'><FiX size={14} /></button>
        </>
      )}
      {row.status === 'approved' && !row.proofUrl && (
        <button onClick={() => handleUploadProof(row._id)} className='p-2 rounded-[4px] bg-purple-50 text-purple-700 hover:bg-purple-100' title="Upload Signed Proof"><FiUploadCloud size={14} /></button>
      )}
      {row.proofUrl && (
        <Link href={row.proofUrl} target='_blank'>
          <button className='p-2 rounded-[4px] bg-teal-50 text-teal-700 hover:bg-teal-100' title="View Proof"><FiExternalLink size={14} /></button>
        </Link>
      )}
      <button onClick={() => { deletePO(row._id); refetch() }} className='p-2 rounded-[4px] bg-gray-50 text-red-600 hover:bg-red-50'><FiTrash2 size={14} /></button>
    </div>
  )

  return (
    <div className='flex flex-col gap-4 p-6'>
      <div className='flex justify-between items-center'>
        <div>
          <p className='text-[13px] text-gray-500'>Stock / Forms /</p>
          <h1 className='text-[20px] font-[700]'>Annex I: Purchase Orders</h1>
        </div>
        <button onClick={() => setIsOpen(true)} className='flex items-center gap-2 bg-[#2E3487] text-white px-4 py-2 rounded-[8px] text-[13px] hover:opacity-80'>
          <FiPlus size={16} /> New Purchase Order
        </button>
      </div>

      <div className='flex justify-between items-center bg-white p-4 rounded-[8px]'>
        <span className='font-[600]'>All Orders ({filtered.length})</span>
        <div className='flex items-center gap-2 border rounded-[6px] p-2 w-[280px]'>
          <CiSearch size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search by PO No / Supplier' className='text-[13px] outline-none w-full' />
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center p-20'><OrbitProgress color="#2E3487" size="small" text="" textColor="" /></div>
      ) : !filtered.length ? (
        <div className='flex flex-col items-center justify-center p-16 bg-white rounded-[8px]'>
          <GiEmptyWoodBucket size={60} color='lightgray' />
          <span className='font-[700] mt-2'>No purchase orders found</span>
        </div>
      ) : (
        <DataTable value={filtered} paginator rows={10} className='w-full'>
          <Column header="#" body={(_r, o) => (o.rowIndex + 1).toString().padStart(3, '0')} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column field='poNumber' header='PO Number' headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b font-[600]' />
          <Column field='tradeNumber' header='Trade' headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column field='supplierName' header='Supplier' headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column field='date' header='Date' body={(r) => new Date(r.date).toLocaleDateString()} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column field='totalAmount' header='Total (Frw)' body={(r) => r.totalAmount?.toLocaleString()} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b font-[600]' />
          <Column header='Status' body={statusTemplate} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
          <Column header='Actions' body={actionTemplate} headerClassName='bg-[#2E3487] text-white h-[50px] px-3 text-[13px]' bodyClassName='px-3 py-2 text-[13px] border-b' />
        </DataTable>
      )}

      <Dialog header="New Purchase Order" visible={isOpen} onHide={() => { setIsOpen(false); resetForm() }} className='w-[90vw] max-w-[900px]'>
        <div className='flex flex-col gap-4 p-2'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-[600]'>Trade / Section *</label>
              <input value={tradeNumber} onChange={e => setTradeNumber(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' placeholder='e.g. ICT, Mechanics...' />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-[600]'>Date *</label>
              <input type='date' value={date} onChange={e => setDate(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-[600]'>Supplier *</label>
              <input value={supplierName} onChange={e => setSupplierName(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' placeholder='Supplier name' />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-[12px] font-[600]'>Prepared By (Accountant)</label>
              <input value={preparedBy} onChange={e => setPreparedBy(e.target.value)} className='border rounded-[6px] p-2 text-[13px] outline-none' placeholder='Name of accountant' />
            </div>
          </div>

          <div className='border rounded-[8px] overflow-hidden'>
            <table className='w-full text-[12px]'>
              <thead>
                <tr className='bg-[#2E3487] text-white'>
                  <th className='p-2 text-left w-8'>#</th>
                  <th className='p-2 text-left'>Item</th>
                  <th className='p-2 text-left'>Specifications</th>
                  <th className='p-2 text-left w-16'>Unit</th>
                  <th className='p-2 text-left w-20'>Qty</th>
                  <th className='p-2 text-left w-24'>UP (Frw)</th>
                  <th className='p-2 text-left w-24'>TP (Frw)</th>
                  <th className='p-2 w-10'></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className='border-b'>
                    <td className='p-1 text-center text-gray-500'>{idx + 1}</td>
                    <td className='p-1'><input value={item.item} onChange={e => updateItem(idx, 'item', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input value={item.specifications} onChange={e => updateItem(idx, 'specifications', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input type='number' value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1'><input type='number' value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', e.target.value)} className='w-full border rounded p-1 text-[12px] outline-none' /></td>
                    <td className='p-1 font-[600] px-2'>{item.totalPrice?.toLocaleString()}</td>
                    <td className='p-1'>
                      {items.length > 1 && <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className='text-red-500 hover:text-red-700'><FiTrash2 size={14} /></button>}
                    </td>
                  </tr>
                ))}
                <tr className='bg-gray-50'>
                  <td colSpan={6} className='p-2 text-right font-[700]'>Total</td>
                  <td className='p-2 font-[700]'>{totalAmount.toLocaleString()} Frw</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <button onClick={() => setItems([...items, { ...emptyItem }])} className='text-[13px] text-[#2E3487] font-[600] hover:underline self-start'>+ Add Row</button>

          <div className='flex gap-3 justify-end pt-2'>
            <button onClick={() => { setIsOpen(false); resetForm() }} className='px-4 py-2 border rounded-[6px] text-[13px]'>Cancel</button>
            <button onClick={handleCreate} disabled={creating} className='px-4 py-2 bg-[#2E3487] text-white rounded-[6px] text-[13px] hover:opacity-80 disabled:opacity-50'>
              {creating ? 'Creating...' : 'Create Purchase Order'}
            </button>
          </div>
        </div>
      </Dialog>
      <SignatureModal 
        visible={sigModal.visible} 
        onHide={() => setSigModal({ ...sigModal, visible: false })}
        onConfirm={sigModal.type === 'create' ? onConfirmCreate : onConfirmApprove}
        title={sigModal.type === 'create' ? "Sign as Preparer" : "Sign as Approver"}
      />
    </div>
  )
}

export default PurchaseOrders
