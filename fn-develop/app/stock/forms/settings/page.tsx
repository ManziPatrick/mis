"use client"
import React, { useState, useEffect } from 'react'
import { useGetSchoolSettings, useUpdateSchoolSettings } from '@/utlis/hooks/forms.hook'
import { OrbitProgress } from 'react-loading-indicators'
import { toast } from 'sonner'
import Link from 'next/link'
import { FiArrowLeft, FiUpload, FiSave } from 'react-icons/fi'

const SchoolSettingsPage = () => {
  const { data: settings, isLoading } = useGetSchoolSettings()
  const { mutate: updateSettings, isPending: saving } = useUpdateSchoolSettings()

  const [schoolName, setSchoolName] = useState('')
  const [address, setAddress] = useState('')
  const [tradePrefix, setTradePrefix] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')

  useEffect(() => {
    if (settings) {
      setSchoolName(settings.schoolName || '')
      setAddress(settings.address || '')
      setTradePrefix(settings.tradePrefix || '')
      setLogoPreview(settings.logoUrl || '')
    }
  }, [settings])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSave = () => {
    if (!schoolName || !address) { toast.error('School name and address are required'); return }
    const formData = new FormData()
    formData.append('schoolName', schoolName)
    formData.append('address', address)
    formData.append('tradePrefix', tradePrefix)
    if (logoFile) formData.append('logo', logoFile)

    updateSettings(formData, {
      onSuccess: () => toast.success('School settings updated successfully'),
      onError: () => toast.error('Failed to update settings'),
    })
  }

  if (isLoading) {
    return <div className='flex justify-center items-center p-20'><OrbitProgress color="#2E3487" size="small" text="" textColor="" /></div>
  }

  return (
    <div className='flex flex-col gap-6 p-6 max-w-[800px]'>
      <div className='flex items-center gap-4'>
        <Link href='/stock/forms' className='text-[13px] text-gray-500 hover:text-[#2E3487] flex items-center gap-1'><FiArrowLeft size={14} /> Back to Forms</Link>
      </div>

      <div>
        <h1 className='text-[22px] font-[700]'>School Settings</h1>
        <p className='text-[13px] text-gray-500'>Configure your school branding. These details appear on all generated official forms.</p>
      </div>

      <div className='bg-white rounded-[12px] p-6 flex flex-col gap-6 shadow-sm'>
        {/* Logo Upload */}
        <div className='flex flex-col gap-3'>
          <label className='text-[13px] font-[700]'>School Logo</label>
          <div className='flex items-center gap-6'>
            <div className='w-[100px] h-[100px] border-2 border-dashed border-gray-300 rounded-[10px] flex items-center justify-center overflow-hidden bg-gray-50'>
              {logoPreview ? (
                <img src={logoPreview} alt='School Logo' className='w-full h-full object-contain' />
              ) : (
                <div className='text-center text-gray-400'>
                  <FiUpload size={24} className='mx-auto mb-1' />
                  <p className='text-[10px]'>No logo</p>
                </div>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor='logo-upload' className='cursor-pointer flex items-center gap-2 bg-[#2E3487] text-white px-4 py-2 rounded-[6px] text-[13px] hover:opacity-80 w-fit'>
                <FiUpload size={14} /> Upload Logo
              </label>
              <input id='logo-upload' type='file' accept='image/*' className='hidden' onChange={handleLogoChange} />
              <p className='text-[11px] text-gray-400'>PNG, JPG or SVG. Recommended: 200×200px</p>
            </div>
          </div>
        </div>

        {/* School Info */}
        <div className='grid grid-cols-1 gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-[13px] font-[700]'>School / Institution Name *</label>
            <input value={schoolName} onChange={e => setSchoolName(e.target.value)} className='border rounded-[8px] p-3 text-[13px] outline-none focus:border-[#2E3487]' placeholder='e.g. IPRC Kicukiro' />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-[13px] font-[700]'>Full Address *</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className='border rounded-[8px] p-3 text-[13px] outline-none focus:border-[#2E3487]' placeholder='e.g. KN 14 Ave, Kigali, Rwanda' />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-[13px] font-[700]'>Default Trade / Section Prefix</label>
            <input value={tradePrefix} onChange={e => setTradePrefix(e.target.value)} className='border rounded-[8px] p-3 text-[13px] outline-none focus:border-[#2E3487]' placeholder='e.g. ICT, EEE, Mechanics' />
            <p className='text-[11px] text-gray-400'>Pre-fills the Trade field when creating new forms</p>
          </div>
        </div>

        {/* Preview */}
        <div className='border rounded-[8px] p-4 bg-gray-50'>
          <p className='text-[12px] font-[700] mb-3 text-gray-600'>PREVIEW — How it appears on forms:</p>
          <div className='flex items-center gap-3 bg-white p-3 rounded border'>
            {logoPreview ? (
              <img src={logoPreview} alt='' className='w-[50px] h-[50px] object-contain' />
            ) : (
              <div className='w-[50px] h-[50px] border-dashed border border-gray-300 flex items-center justify-center text-[9px] text-gray-400'>Logo</div>
            )}
            <div>
              <p className='text-[13px] font-[700]'>{schoolName || 'School Name'}</p>
              <p className='text-[11px] text-gray-500'>{address || 'School Address'}</p>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className='flex items-center gap-2 bg-[#2E3487] text-white px-6 py-3 rounded-[8px] text-[14px] font-[600] hover:opacity-80 disabled:opacity-50 w-fit'>
          <FiSave size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

export default SchoolSettingsPage
