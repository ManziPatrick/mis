"use client"
import React from 'react'
import Link from 'next/link'
import { FiFileText } from 'react-icons/fi'
import { useGetAllPurchaseOrders } from '@/utlis/hooks/forms.hook'
import { useGetAllDeliveryNotes } from '@/utlis/hooks/forms.hook'
import { useGetAllReceivedNotes } from '@/utlis/hooks/forms.hook'
import { useGetAllStoreCards } from '@/utlis/hooks/forms.hook'
import { useGetAllRequisitions } from '@/utlis/hooks/forms.hook'
import { useGetAllMiniRequisitions } from '@/utlis/hooks/forms.hook'
import { useGetAllMonthlyInventories } from '@/utlis/hooks/forms.hook'
import { useGetAllUtilizationReports } from '@/utlis/hooks/forms.hook'

const formCards = [
  {
    title: 'Annex I: Purchase Order',
    subtitle: 'Bon de commande',
    href: '/stock/forms/purchase-orders',
    color: 'from-blue-600 to-blue-800',
    queryKey: 'purchase-orders',
  },
  {
    title: 'Annex II: Delivery Note',
    subtitle: 'Bon de livraison',
    href: '/stock/forms/delivery-notes',
    color: 'from-green-600 to-green-800',
    queryKey: 'delivery-notes',
  },
  {
    title: 'Annex III: Goods Received Note',
    subtitle: 'Bon de réception de marchandises',
    href: '/stock/forms/received-notes',
    color: 'from-purple-600 to-purple-800',
    queryKey: 'received-notes',
  },
  {
    title: 'Annex IV: Store Card',
    subtitle: 'Carte de magasin',
    href: '/stock/forms/store-cards',
    color: 'from-orange-500 to-orange-700',
    queryKey: 'store-cards',
  },
  {
    title: 'Annex V: Consumables Requisition (Main Store)',
    subtitle: 'Formulaire de réquisition',
    href: '/stock/forms/requisitions',
    color: 'from-red-500 to-red-700',
    queryKey: 'requisitions',
  },
  {
    title: 'Annex VI: Consumables Requisition (Mini Store)',
    subtitle: 'Formulaire de réquisition',
    href: '/stock/forms/mini-requisitions',
    color: 'from-rose-500 to-rose-700',
    queryKey: 'mini-requisitions',
  },
  {
    title: 'Annex VII: Monthly Inventory Report',
    subtitle: 'Rapport d\'inventaire mensuel',
    href: '/stock/forms/monthly-inventory',
    color: 'from-teal-600 to-teal-800',
    queryKey: 'monthly-inventory',
  },
  {
    title: 'Annex VIII: Consumables Utilization Report',
    subtitle: 'Rapport d\'utilisation',
    href: '/stock/forms/utilization-reports',
    color: 'from-indigo-500 to-indigo-700',
    queryKey: 'utilization-reports',
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

  const counts: Record<string, number> = {
    'purchase-orders': pos?.length || 0,
    'delivery-notes': dns?.length || 0,
    'received-notes': grns?.length || 0,
    'store-cards': scs?.length || 0,
    'requisitions': reqs?.length || 0,
    'mini-requisitions': mreqs?.length || 0,
    'monthly-inventory': minvs?.length || 0,
    'utilization-reports': urep?.length || 0,
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex flex-row items-center justify-between'>
        <div>
          <h1 className='text-[22px] font-[700] text-gray-800'>Official Forms</h1>
          <p className='text-[13px] text-gray-500'>Generate, manage and approve official procurement documents</p>
        </div>
        <Link href='/stock/forms/settings' className='text-[13px] bg-[#2E3487] text-white px-4 py-2 rounded-[6px] hover:opacity-80'>
          ⚙ School Settings
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {formCards.map((card) => {
          const total = counts[card.queryKey] || 0
          return (
            <Link key={card.href} href={card.href} className='group block'>
              <div className={`bg-gradient-to-br ${card.color} rounded-[12px] p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]`}>
                <div className='flex flex-row items-start justify-between'>
                  <div className='w-[48px] h-[48px] bg-white/20 rounded-[10px] flex items-center justify-center'>
                    <FiFileText size={24} />
                  </div>
                  <span className='text-[28px] font-[700]'>{total}</span>
                </div>
                <div className='mt-4'>
                  <h2 className='text-[16px] font-[700]'>{card.title}</h2>
                  <p className='text-[13px] text-white/70 mt-1'>{card.subtitle}</p>
                </div>
                <div className='mt-4 text-[12px] text-white/80 font-[500] group-hover:underline'>
                  View all →
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default FormsHub
