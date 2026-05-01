"use client"
import React, { useEffect, useState } from 'react'
import { FaRegPenToSquare, FaUserPlus } from 'react-icons/fa6'
import { Button } from 'primereact/button'
import { BsFilterLeft } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { useGetAllAssets, useGetAllStock, useGetAllStockCategory, userCreateStockCategoryMutation } from '@/utlis/hooks/stock.hook'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { OrbitProgress } from 'react-loading-indicators'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { Dialog } from 'primereact/dialog'
import { useFormik } from 'formik'
import { toast, Toaster } from 'sonner'
import * as Yup from "yup"
import NewAsset from '@/components/reusable/NewAssets'
import NewStock from '@/components/reusable/NewStock'
import { useGetAllSuppiers } from '@/utlis/hooks/suppliers.hook'
import RemoveItemStock from '@/components/reusable/RemoveItemStock'
import { GrTransaction } from 'react-icons/gr'
import Link from 'next/link'
import { confirmDialog } from 'primereact/confirmdialog'
import UpdateStock from '@/components/reusable/update/UpdateStock'
import FilterModal from '@/components/reusable/FilterModal'

const Stocks = () => {
    const [isCreateCategory, setIsCreateCategory] = useState<boolean>(false)
    const [isNewStock, setIsNewStock] = useState<boolean>(false)
    const [isRemoveStock, setIsRemoveStock] = useState<boolean>(false)
    const [deducateData, setDeducateData] = useState<any>()
    const { data: stocks, isLoading, isError, error, refetch } = useGetAllStock()
    const { data: categories, isLoading: categoryLoading, isError: categoryIsError, error: categoryError, refetch: categoryFetch } = useGetAllStockCategory()
    const { data: suppliers, isLoading: supplierLoading } = useGetAllSuppiers()
    const { mutate: createCategory, isPending: categoryPending } = userCreateStockCategoryMutation()
    const [isUpdateStock, setIsUpdateStock] = useState<boolean>(false)
    const [updateStockData, setUpdateStockData] = useState<any>()
    const [isFilterModal, setIsFilterModal] = useState<boolean>(false)
    const [filterData, setFilterData] = useState<any>({})
    const [filteredStocks, setFilteredStocks] = useState<any>([])
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
                    setIsCreateCategory(false)

                }, onError: (error) => {
                    toast.error(error.message)
                }
            }))

        }
    })

    const amountTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[5px] items-center'>
                <span className='text-[12px] font-[500]'>{rowData.totalPrice}</span>
                <span>frw</span>
            </div>
        )
    }
    const unityPriceTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[5px] items-center'>
                <span className='text-[12px] font-[500]'>{rowData.unityPrice}</span>
                <span>frw</span>
            </div>
        )
    }
    const actionTemplate = (rowData: any) => {
        return (
            <div className='flex flex-row gap-[10px] items-center'>
                <span onClick={() => { setIsUpdateStock(true); setUpdateStockData(rowData) }} className=' cursor-pointer px-2 border p-2 rounded-[4px] hover:bg-gray-100'><FaRegPenToSquare size={20} /></span>
                <span onClick={() => openDeduct(rowData)} className='  cursor-pointer px-2 border p-2 text-orange-500 rounded-[4px] hover:bg-red-200'>Deduct</span>
            </div>
        )
    }

    const transactionTemplate = (rowData: any) => {
        return (
            <Link href={`/stock/stocks/transa/${rowData._id}`} className='flex flex-row gap-[10px] cursor-pointer text-blue-900 items-center'>
                <GrTransaction size={20} />
                <span>View transaction</span>
            </Link>
        )
    }

    const openDeduct = (data: any) => {
        setDeducateData(data)
        setIsRemoveStock(true)
    }

    useEffect(() => {
        let updatedStocks = Array.isArray(stocks) ? [...stocks] : [];
        if (filterData.category && filterData.category !== 'all') {
            updatedStocks = updatedStocks.filter((stock: any) => stock?.category?._id === filterData.category);
        }
    
        if (search) {
            updatedStocks = updatedStocks.filter(
                (stock: any) =>
                    stock.item.toLowerCase().includes(search.toLowerCase()) ||
                    stock.supplierId.name.toLowerCase().includes(search.toLowerCase())
            );
        }
    
        setFilteredStocks(updatedStocks);
    }, [filterData, stocks, search]);








    return (
        <div className='flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Stock  /</span>
                    <span className='text-[14px] font-[600]'>Stocks</span>
                </div>
                <Button onClick={() => setIsNewStock(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-6 py-3 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                    +
                    New Stock
                </Button>
            </div>
            <div className='flex flex-row gap-[10px] bg-white  items-center justify-between p-4 rounded-[6px]'>
                <div className='flex flex-row gap-[10px] items-center'>

                    <div className='flex flex-row gap-[4px] items-center'>
                        <h1 className='text-[16px] font-[600]'>All Stock</h1>
                        <span className='p-2 bg-gray-100 rounded-[4px]'>{!isLoading && stocks?.length}</span>
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
                        <input value={search} onChange={(e) => setSearch(e.target.value)} name='search' type="search" className='text-[13px] rounded-[6px] outline-none' placeholder='Search' />
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
                        {!stocks || stocks?.length == 0 ? (
                            <div className='w-full flex items-center text-center justify-center p-10 flex-col gap-[3px]'>
                                <GiEmptyWoodBucket size={60} color='lightgray' />
                                <span className='text-[16px] font-[700]'>No Stock Avaliable</span>
                                <span className='text-[12px]'>There is no stocks yet but you can create new one </span>
                                <Button onClick={() => setIsNewStock(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-4 py-2 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
                                    +
                                    New Stock
                                </Button>

                            </div>
                        ) : (
                            <DataTable value={filteredStocks} className='w-full mt-4'>
                                <Column body={(rowData, options) => (options.rowIndex + 1).toString().padStart(3, '0')} field="code" header="#" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2  text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[13px] border-b"}></Column>
                                <Column field='item' header="Item Name" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field='category.name' header="Category" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>

                                <Column field="quantity" header="Quantity" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="unity" header="Unity" headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="unityPrice" header="Unity Price" body={unityPriceTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="totalPrice" header="total price" body={amountTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white  text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column field="supplierId.name" header="Supplier" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column body={actionTemplate} header="Action" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
                                <Column body={transactionTemplate} header="Transaction" headerClassName='h-[8vh] bg-[#2E3487] text-white text-[12px] px-2 font-[400]' bodyClassName={"h-[8vh] p-2 text-[12px] border-b"}></Column>
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
            <UpdateStock isOpen={isUpdateStock} setIsOpen={setIsUpdateStock} reFetch={refetch} stockData={updateStockData} categories={categories} suppliers={suppliers?.supplier || []} />
            <NewStock suppliers={supplierLoading ? [] : suppliers?.supplier} isOpen={isNewStock} setIsOpen={setIsNewStock} categories={categories} reFetch={refetch} />
            <RemoveItemStock isOpen={isRemoveStock} setIsOpen={setIsRemoveStock} refetch={refetch} data={deducateData} />
            <FilterModal visible={isFilterModal} onHide={() => setIsFilterModal(false)} categories={categories!} filterData={filterData} setFilterData={setFilterData} />


        </div>
    )
}

export default Stocks