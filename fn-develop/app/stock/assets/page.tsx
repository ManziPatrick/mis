"use client"
import React, { useEffect, useState } from 'react'
import { FaRegPenToSquare, FaUserPlus } from 'react-icons/fa6'
import { Button } from 'primereact/button'
import { BsFilterLeft } from 'react-icons/bs'
import { CiSearch, CiTrash } from 'react-icons/ci'
import { useDeleteAsset, useGetAllAssets, useGetAllStockCategory, userCreateStockCategoryMutation } from '@/utlis/hooks/stock.hook'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { OrbitProgress } from 'react-loading-indicators'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { Dialog } from 'primereact/dialog'
import { useFormik } from 'formik'
import { toast, Toaster } from 'sonner'
import * as Yup from "yup"
import NewAsset from '@/components/reusable/NewAssets'
import { confirmDialog } from 'primereact/confirmdialog'
import UpdateAsset from '@/components/reusable/update/UpdateAsset'
import AssignAsset from '@/components/reusable/AssignAsset'
import FilterModal from '@/components/reusable/FilterModal'

const Assets = () => {
    const [isCreateCategory, setIsCreateCategory] = useState<boolean>(false)
    const [isNewAsset, setIsNewAsset] = useState<boolean>(false)
    const [isUpdateAsset, setIsUpdateAsset] = useState<boolean>(false)
    const [assetToUpdate, setAssetToUpdate] = useState<any>(null)
    const [isAssignOpen, setIsAssignOpen] = useState<boolean>(false)
    const { data: assets, isLoading, isError, error, refetch } = useGetAllAssets()
    console.log(assets)
    const { data: categories, isLoading: categoryLoading, isError: categoryIsError, error: categoryError, refetch: categoryFetch } = useGetAllStockCategory()
    const { mutate: createCategory, isPending: categoryPending } = userCreateStockCategoryMutation()
    const { mutate: deleteAsset, isPending: isDeletingAsset } = useDeleteAsset()
    const [deleteingId, setDeletingId] = useState<string>("")
    const [isFilterModal, setIsFilterModal] = useState<boolean>(false)
    const [filterData, setFilterData] = useState<any>({})
    const [filteredAssets, setFilteredAssets] = useState<any>([])
    const [search, setSearch] = useState<string>("")

    const newCategoryFormik = useFormik({
        initialValues: {
            description: "",
            name: ""
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Name is required"),
            description: Yup.string().required("Description is required"),

        }),
        onSubmit: (values) => {
            createCategory({ name: values.name, description: values.description }, ({
                onSuccess: (data) => {
                    toast.success("Category created successfully")
                    categoryFetch()
                    newCategoryFormik.resetForm()
                    setIsCreateCategory(false)

                }, onError: (error) => {
                    toast.error(error.message)
                }
            }))

        }
    })

    const imageTemplate = (rowData: any) => {
        return rowData.imageUrl ? (
            <img src={rowData.imageUrl} alt={rowData.item} className='w-12 h-12 object-cover rounded-[4px]' />
        ) : (
            <div className='w-12 h-12 bg-gray-200 rounded-[4px] flex items-center justify-center text-[10px] text-gray-500'>No Image</div>
        );
    }

    const totalVlaueTempelate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[5px] items-center'>
                <span className='text-[12px]'>{rowData.totalValues}</span>
                <span>frw</span>
            </div>
        )
    }
    const actionTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[10px] items-center'>
                <span onClick={() => {
                    setAssetToUpdate(rowData)
                    setIsUpdateAsset(true)
                }} className=' cursor-pointer px-2 border p-2 rounded-[4px] hover:bg-gray-100'><FaRegPenToSquare size={20} /></span>
                <span onClick={() => {
                    setAssetToUpdate(rowData)
                    setIsAssignOpen(true)
                }} title="Assign" className=' cursor-pointer px-2 border p-2 text-blue-500 rounded-[4px] hover:bg-blue-100'><FaUserPlus size={20} /></span>
                <span onClick={() => confirmDelete(rowData._id)} className='  cursor-pointer px-2 border p-2 text-red-500 rounded-[4px] hover:bg-red-200'>
                    {isDeletingAsset && deleteingId == rowData._id ? <span className='text-[12px]'>Loading...</span> : <CiTrash size={20} />}
                </span>
            </div>


        )
    }

    const confirmDelete = (rowData: any) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptLabel: 'Yes, Delete',
            rejectLabel: 'Cancel',
            acceptClassName: ' bg-red-400 text-white p-3 ',
            rejectClassName: ' inline-block mr-2 bg-blue-400 text-white p-3 ',

            accept: () => deleteUserFun(rowData),
        });
    };

    const deleteUserFun = async (id: string) => {
        setDeletingId(id)
        deleteAsset(id, {
            onSuccess: (data) => {
                toast.success("Asset deleted successfully")
                refetch()

            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    }

    useEffect(() => {
        let updatedAssets = Array.isArray(assets?.assets) ? [...assets.assets] : [];

        console.log("updated assets",updatedAssets)

        if (filterData?.category && filterData?.category !== 'all') {
            updatedAssets = updatedAssets?.filter((asset: any) => asset?.category?._id === filterData.category);
        }

        if (search) {
            updatedAssets = updatedAssets.filter(
                (asset: any) =>
                    asset.item.toLowerCase().includes(search.toLowerCase()) ||
                    asset.location.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredAssets(updatedAssets);
    }, [filterData, assets, search]);


    return (
        <div className='flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Stock  /</span>
                    <span className='text-[14px] font-[600]'>Assets</span>
                </div>
                <Button onClick={() => setIsNewAsset(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-6 py-3 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                    +
                    New Asset
                </Button>
            </div>
            <div className='flex flex-row gap-[10px] bg-white  items-center justify-between p-4 rounded-[6px]'>
                <div className='flex flex-row gap-[10px] items-center'>

                    <div className='flex flex-row gap-[4px] items-center'>
                        <h1 className='text-[16px] font-[600]'>All Assets</h1>
                        <span className='p-2 bg-gray-100 rounded-[4px]'>{!isLoading && assets?.assets ? assets?.assets.length : 0}</span>
                    </div>
                    <div className='flex flex-row gap-[10px] items-center'></div>
                </div>
                <div className='flex flex-row items-center gap-[10px]'>
                    <Button onClick={() => setIsCreateCategory(true)} className='text-[12px] text-white rounded-[6px] hover:opacity-80 px-3 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                        <span>+</span>
                        New Category
                    </Button>


                    <div onClick={() => setIsFilterModal(true)} className='flex flex-row gap-[4px] items-center cursor-pointer p-2 border rounded-[6px]'>
                        <span className='text-[13px]'>More Filter</span>
                        <BsFilterLeft size={18} />
                    </div>

                    <div className='flex flex-row items-center gap-[3px] p-2 border rounded-[6px]'>
                        <CiSearch size={18} />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} name='search' type="search" className='text-[13px] rounded-[6px] outline-none' placeholder='Search by name / location' />
                    </div>
                </div>
            </div>
            <div className='w-full bg-white'>
                {isLoading ? (
                    <div className='w-full p-10 flex items-center justify-center'>
                        <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                    </div>
                ) : (
                    <>
                        {assets?.assets?.length == 0 ? (
                            <div className='w-full flex items-center text-center justify-center p-10 flex-col gap-[3px]'>
                                <GiEmptyWoodBucket size={60} color='lightgray' />
                                <span className='text-[16px] font-[700]'>No Assets Avaliable</span>
                                <span className='text-[12px]'>There is no assets yet but you can create new one </span>
                                <Button onClick={() => setIsNewAsset(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                                    +
                                    New Asset
                                </Button>

                            </div>
                        ) : (
                            <DataTable value={filteredAssets} className='w-full mt-4'>
                                <Column body={(rowData, options) => (options.rowIndex + 1).toString().padStart(3, '0')} field="code" header="Code" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2  text-[14px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column body={imageTemplate} header="Image" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column field='item' header="Item Name" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column field='category.name' header="Category" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="totalNumber" header="Total Number" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column field="location" header="Location" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column field="totalNumberInGoodCondition" header="In Good" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column field="totalNumberInCriticalCondition" header="In Critical" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column body={totalVlaueTempelate} header="Total Value" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column body={actionTemplate} header="Action" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[14px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                            </DataTable>
                        )}
                    </>
                )}
            </div>
            <Dialog header="New Category" className='w-1/3' onHide={() => setIsCreateCategory(false)} visible={isCreateCategory}>
                <form onSubmit={newCategoryFormik.handleSubmit} className='w-full flex flex-col gap-[10px]'>
                    <div className='flex flex-col gap-[4px] w-full'>
                        <span className='text-[14px] text-black'>Name</span>
                        <input
                            value={newCategoryFormik.values.name}
                            name='name'
                            onChange={newCategoryFormik.handleChange}
                            type="text"
                            className='border p-3 text-[13px] rounded-[12px]'
                            placeholder='Enter Item Name'
                        />
                        {newCategoryFormik.touched.name && newCategoryFormik.errors.name && (
                            <div className="text-red-500 text-[12px]">{newCategoryFormik.errors.name}</div>
                        )}
                    </div>
                    <div className='flex flex-col gap-[4px] w-full'>
                        <span className='text-[14px] text-black'>Description</span>
                        <textarea
                            value={newCategoryFormik.values.description}
                            name='description'
                            onChange={newCategoryFormik.handleChange}

                            className='border p-3 text-[13px] rounded-[12px]'
                            placeholder='Enter Description'
                        />
                        {newCategoryFormik.touched.description && newCategoryFormik.errors.description && (
                            <div className="text-red-500 text-[12px]">{newCategoryFormik.errors.description}</div>
                        )}
                    </div>
                    <Button loading={categoryPending} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-3 bg-[#2E3487] flex flex-row gap-[10px] justify-center items-center'>
                        Create
                    </Button>

                </form>

            </Dialog>
            <NewAsset isOpen={isNewAsset} setIsOpen={setIsNewAsset} categories={categories} reFetch={refetch} />
            <UpdateAsset assetToUpdate={assetToUpdate} isOpen={isUpdateAsset} setIsOpen={setIsUpdateAsset} categories={categories} reFetch={refetch} />
            <AssignAsset isOpen={isAssignOpen} setIsOpen={setIsAssignOpen} assetData={assetToUpdate} reFetch={refetch} />
            <FilterModal visible={isFilterModal} onHide={() => setIsFilterModal(false)} categories={categories!} filterData={filterData} setFilterData={setFilterData} />


        </div>
    )
}

export default Assets