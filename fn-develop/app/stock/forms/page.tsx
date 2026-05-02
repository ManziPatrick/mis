"use client"
import React from 'react'
import Link from 'next/link'
import { FiFileText, FiClock, FiCheckCircle, FiAlertCircle, FiPlus, FiArrowRight } from 'react-icons/fi'
import {
  useGetAllPurchaseOrders,
  useGetAllDeliveryNotes,
  useGetAllReceivedNotes,
  useGetAllStoreCards,
  useGetAllRequisitions,
  useGetAllMiniRequisitions,
  useGetAllMonthlyInventories,
  useGetAllUtilizationReports,
} from '@/utlis/hooks/forms.hook'

const formCards = [
  {
    title: 'Annex I: Purchase Order',
    subtitle: 'Bon de commande',
    href: '/stock/forms/purchase-orders',
    color: 'from-blue-600 to-blue-800',
    borderColor: 'border-blue-500',
    queryKey: 'purchase-orders',
    creatorField: 'preparedBy',
    numberField: 'poNumber',
  },
  {
    title: 'Annex II: Delivery Note',
    subtitle: 'Bon de livraison',
    href: '/stock/forms/delivery-notes',
    color: 'from-green-600 to-green-800',
    borderColor: 'border-green-500',
    queryKey: 'delivery-notes',
    creatorField: 'deliveredBy',
    numberField: 'dnNumber',
  },
  {
    title: 'Annex III: Goods Received Note',
    subtitle: 'Bon de réception de marchandises',
    href: '/stock/forms/received-notes',
    color: 'from-purple-600 to-purple-800',
    borderColor: 'border-purple-500',
    queryKey: 'received-notes',
    creatorField: 'receivedBy',
    numberField: 'grnNumber',
  },
  {
    title: 'Annex IV: Store Card',
    subtitle: 'Carte de magasin',
    href: '/stock/forms/store-cards',
    color: 'from-orange-500 to-orange-700',
    borderColor: 'border-orange-500',
    queryKey: 'store-cards',
    creatorField: 'preparedBy',
    numberField: 'cardNumber',
  },
  {
    title: 'Annex V: Consumables Requisition (Main Store)',
    subtitle: 'Formulaire de réquisition',
    href: '/stock/forms/requisitions',
    color: 'from-red-500 to-red-700',
    borderColor: 'border-red-500',
    queryKey: 'requisitions',
    creatorField: 'requestedBy',
    numberField: 'voucherNumber',
  },
  {
    title: 'Annex VI: Consumables Requisition (Mini Store)',
    subtitle: 'Formulaire de réquisition',
    href: '/stock/forms/mini-requisitions',
    color: 'from-rose-500 to-rose-700',
    borderColor: 'border-rose-500',
    queryKey: 'mini-requisitions',
    creatorField: 'requestedBy',
    numberField: 'voucherNumber',
  },
  {
    title: 'Annex VII: Monthly Inventory Report',
    subtitle: "Rapport d'inventaire mensuel",
    href: '/stock/forms/monthly-inventory',
    color: 'from-teal-600 to-teal-800',
    borderColor: 'border-teal-500',
    queryKey: 'monthly-inventory',
    creatorField: 'preparedBy',
    numberField: 'reportNumber',
  },
  {
    title: 'Annex VIII: Consumables Utilization Report',
    subtitle: "Rapport d'utilisation",
    href: '/stock/forms/utilization-reports',
    color: 'from-indigo-500 to-indigo-700',
    borderColor: 'border-indigo-500',
    queryKey: 'utilization-reports',
    creatorField: 'preparedBy',
    numberField: 'reportNumber',
  },
]

const FormsHub = () => {
  const { data: pos } = useGetAllPurchaseOrders()
  const { data: dns } = useGetAllDeliveryNotes()
  const { data: grns } = useGetAllReceivedNotes()
  const { data: scs } = useGetAllStoreCards()
  const { data: reqs } = useGetAllRequisitions()
  const { data: mreqs } = useGetAllMiniRequisitions()
  const { data: minvs } = useGetAllMonthlyInventories()
  const { data: urep } = useGetAllUtilizationReports()

  const allData: Record<string, any[]> = {
    'purchase-orders': pos || [],
    'delivery-notes': dns || [],
    'received-notes': grns || [],
    'store-cards': scs || [],
    'requisitions': reqs || [],
    'mini-requisitions': mreqs || [],
    'monthly-inventory': minvs || [],
    'utilization-reports': urep || [],
  }

  const totalForms = Object.values(allData).reduce((sum, arr) => sum + arr.length, 0)
  const totalPending = Object.values(allData).reduce((sum, arr) => sum + arr.filter((r: any) => r.status === 'pending').length, 0)
  const totalApproved = Object.values(allData).reduce((sum, arr) => sum + arr.filter((r: any) => r.status === 'approved').length, 0)

  return (
    <div className='flex flex-col gap-6 p-6'>

      {/* ── Header ── */}
      <div className='flex flex-row items-center justify-between'>
        <div>
          <h1 className='text-[22px] font-[700] text-gray-800'>Official Forms</h1>
          <p className='text-[13px] text-gray-500'>Generate, manage and approve official procurement documents</p>
        </div>
        <Link href='/stock/forms/settings' className='text-[13px] bg-[#2E3487] text-white px-4 py-2 rounded-[6px] hover:opacity-80'>
          ⚙ School Settings
        </Link>
      </div>

      {/* ── Summary Strip ── */}
      <div className='grid grid-cols-3 gap-4'>
        <div className='bg-white rounded-[10px] p-4 border-l-4 border-[#2E3487] shadow-sm flex items-center gap-4'>
          <div className='w-10 h-10 rounded-full bg-[#2E3487]/10 flex items-center justify-center'>
            <FiFileText size={18} className='text-[#2E3487]' />
          </div>
          <div>
            <p className='text-[12px] text-gray-500'>Total Forms</p>
            <p className='text-[24px] font-[700] text-gray-800'>{totalForms}</p>
          </div>
        </div>
        <div className='bg-white rounded-[10px] p-4 border-l-4 border-yellow-500 shadow-sm flex items-center gap-4'>
          <div className='w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center'>
            <FiClock size={18} className='text-yellow-600' />
          </div>
          <div>
            <p className='text-[12px] text-gray-500'>Pending Approval</p>
            <p className='text-[24px] font-[700] text-yellow-600'>{totalPending}</p>
          </div>
        </div>
        <div className='bg-white rounded-[10px] p-4 border-l-4 border-green-500 shadow-sm flex items-center gap-4'>
          <div className='w-10 h-10 rounded-full bg-green-50 flex items-center justify-center'>
            <FiCheckCircle size={18} className='text-green-600' />
          </div>
          <div>
            <p className='text-[12px] text-gray-500'>Approved</p>
            <p className='text-[24px] font-[700] text-green-600'>{totalApproved}</p>
          </div>
        </div>
      </div>

      {/* ── How to create a form guide ── */}
      <div className='bg-blue-50 border border-blue-200 rounded-[10px] p-4 flex items-start gap-3'>
        <FiAlertCircle size={18} className='text-blue-600 mt-0.5 shrink-0' />
        <div>
          <p className='text-[13px] font-[600] text-blue-800'>How to create a form</p>
          <p className='text-[12px] text-blue-700 mt-1'>
            Click on any form card below to open its list page, then press the{' '}
            <strong className='bg-blue-200 px-1.5 py-0.5 rounded text-blue-900'>+ New</strong> button at the top-right corner.
            Fill in the required fields and submit — the form will appear as <strong>Pending</strong> until an authorised approver signs and reviews it.
            You can also use the quick <strong>New</strong> button directly on each card.
          </p>
        </div>
      </div>

      {/* ── Form Cards ── */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {formCards.map((card) => {
          const records: any[] = allData[card.queryKey] || []
          const total = records.length
          const pending = records.filter(r => r.status === 'pending').length
          const approved = records.filter(r => r.status === 'approved').length

          // Most recent submission sorted by createdAt or date
          const latest = records.length
            ? [...records].sort((a, b) =>
                new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime()
              )[0]
            : null

          const latestCreator = latest
            ? (latest[card.creatorField] || latest.preparedBy || latest.requestedBy || '—')
            : null
          const latestDate = latest
            ? new Date(latest.createdAt || latest.date).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
              })
            : null
          const latestRef = latest ? (latest[card.numberField] || '') : null

          return (
            <div key={card.href} className={`bg-white rounded-[12px] border-t-4 ${card.borderColor} shadow-sm hover:shadow-md transition-all`}>

              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${card.color} rounded-t-[8px] p-4 text-white`}>
                <div className='flex items-start justify-between'>
                  <div className='w-10 h-10 bg-white/20 rounded-[8px] flex items-center justify-center'>
                    <FiFileText size={20} />
                  </div>
                  <span className='text-[32px] font-[800] leading-none'>{total}</span>
                </div>
                <h2 className='text-[14px] font-[700] mt-3 leading-snug'>{card.title}</h2>
                <p className='text-[11px] text-white/70 mt-0.5'>{card.subtitle}</p>
              </div>

              {/* Status Breakdown */}
              <div className='flex items-center gap-3 px-4 py-3 border-b'>
                <span className='flex items-center gap-1.5 text-[12px] text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full font-[500]'>
                  <FiClock size={11} /> {pending} pending
                </span>
                <span className='flex items-center gap-1.5 text-[12px] text-green-700 bg-green-50 px-2 py-1 rounded-full font-[500]'>
                  <FiCheckCircle size={11} /> {approved} approved
                </span>
              </div>

              {/* Latest Submission */}
              <div className='px-4 py-3 border-b min-h-[72px]'>
                {latest ? (
                  <div>
                    <p className='text-[11px] text-gray-400 font-[500] uppercase tracking-wide'>Last Submitted By</p>
                    <p className='text-[13px] font-[600] text-gray-800 mt-0.5 truncate'>{latestCreator}</p>
                    <div className='flex items-center gap-2 mt-0.5'>
                      {latestRef && <span className='text-[11px] text-gray-400'>{latestRef}</span>}
                      {latestRef && <span className='text-[11px] text-gray-300'>·</span>}
                      <span className='text-[11px] text-gray-400'>{latestDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center h-full py-2'>
                    <p className='text-[12px] text-gray-400'>No submissions yet</p>
                    <p className='text-[11px] text-gray-300'>Be the first to create one →</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className='flex items-center justify-between px-4 py-3'>
                <Link href={card.href} className='flex items-center gap-1.5 text-[13px] text-[#2E3487] font-[600] hover:underline'>
                  View all <FiArrowRight size={13} />
                </Link>
                <Link
                  href={card.href}
                  className={`flex items-center gap-1 text-[12px] text-white bg-gradient-to-r ${card.color} px-3 py-1.5 rounded-[6px] hover:opacity-90 font-[500]`}
                >
                  <FiPlus size={13} /> New
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FormsHub
