"use client"
import { useGetAllAssetAssignments, useReturnAsset } from '@/utlis/hooks/stock.hook'
import { AxiosError } from 'axios'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import React, { useMemo, useState } from 'react'
import { GiEmptyWoodBucket } from 'react-icons/gi'
import { OrbitProgress } from 'react-loading-indicators'
import { toast } from 'sonner'
import { CiSearch } from 'react-icons/ci'

const AssetAssignments = () => {
    const { data: assignmentsData, isLoading, isError, refetch } = useGetAllAssetAssignments()
    const { mutate: returnAsset, isPending: returnPending } = useReturnAsset()
    const [isReturnModal, setIsReturnModal] = useState<boolean>(false)
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
    const [conditionOnReturn, setConditionOnReturn] = useState<string>('Good')
    const [search, setSearch] = useState<string>("")

    const filteredAssignments = useMemo(() => {
        if (!assignmentsData) return [];
        let data = [...assignmentsData].sort((a: any, b: any) => 
            new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
        );
        if (search) {
            data = data.filter((item: any) => 
                item.assetId?.item?.toLowerCase().includes(search.toLowerCase()) ||
                item.studentId?.toLowerCase().includes(search.toLowerCase())
            );
        }
        return data;
    }, [assignmentsData, search]);

    const handleReturn = () => {
        if (!selectedAssignment) return;
        
        returnAsset({ 
            assignmentId: selectedAssignment._id, 
            conditionOnReturn 
        }, {
            onSuccess: (res: any) => {
                toast.success(res.message || "Asset returned successfully")
                refetch()
                setIsReturnModal(false)
                setSelectedAssignment(null)
            },
            onError: (err: any) => {
                const axiosError = err as AxiosError
                const message = (axiosError.response?.data as any)?.message || "Failed to return asset"
                toast.error(message)
            }
        })
    }

    const actionTemplate = (rowData: any) => {
        if (rowData.status === 'returned') {
            return <span className='text-green-600 font-[500]'>Returned</span>
        }
        return (
            <Button 
                onClick={() => {
                    setSelectedAssignment(rowData);
                    setIsReturnModal(true);
                }}
                disabled={returnPending}
                className='text-[12px] bg-green-700 text-white px-3 py-1 rounded-[4px] hover:opacity-80'
            >
                Process Return
            </Button>
        )
    }

    const statusTemplate = (rowData: any) => {
        return (
            <span className={`px-2 py-1 rounded-[10px] text-[12px] ${
                rowData.status === 'assigned' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }`}>
                {rowData.status.toUpperCase()}
            </span>
        )
    }

    return (
        <div className='w-full flex flex-col gap-[20px] p-4'>
            <div className='w-full items-center justify-between flex flex-row'>
                <div className='flex flex-row gap-[4px] items-center'>
                    <span className='text-[14px]'>Stock  /</span>
                    <span className='text-[14px] font-[600]'>Asset Assignments</span>
                </div>
            </div>

            <div className='flex flex-row items-center justify-between bg-white p-4 rounded-[6px]'>
                <h1 className='text-[16px] font-[600]'>All Assignments ({filteredAssignments.length})</h1>
                <div className='flex flex-row items-center gap-[3px] p-2 border rounded-[6px] w-[300px]'>
                    <CiSearch size={18} />
                    <input 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        type="search" 
                        className='text-[13px] rounded-[6px] outline-none w-full' 
                        placeholder='Search by asset / student ID' 
                    />
                </div>
            </div>

            {isLoading ? (
                <div className='w-full p-20 flex items-center justify-center'>
                    <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
                </div>
            ) : (
                <>
                    {isError || !filteredAssignments.length ? (
                        <div className='w-full py-10 bg-white flex items-center text-center justify-center p-2 flex-col gap-[3px]'>
                            <GiEmptyWoodBucket size={60} color='lightgray' />
                            <span className='text-[16px] font-[700]'>No assignments found</span>
                            <span className='text-[12px]'>There are no active or past asset assignments</span>
                        </div>
                    ) : (
                        <DataTable
                            paginator
                            rows={10}
                            value={filteredAssignments}
                            className='w-full mt-4'
                        >
                            <Column header="#" body={(data, options) => options.rowIndex + 1} headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]" bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column field='assetId.item' header="Asset" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column field="studentId" header="Assigned To" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column header="Assigned Date" body={(rowData) => new Date(rowData.assignedDate).toLocaleDateString()} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column field="conditionOnAssignment" header="Condition (Start)" headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column header="Status" body={statusTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                            <Column header="Action" body={actionTemplate} headerClassName='h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]' bodyClassName="h-[8vh] p-2 text-[13px] border-b" />
                        </DataTable>
                    )}
                </>
            )}

            <Dialog 
                header="Return Asset" 
                visible={isReturnModal} 
                onHide={() => setIsReturnModal(false)}
                className='w-[400px]'
            >
                <div className='flex flex-col gap-[15px] py-4'>
                    <div className='flex flex-col gap-[5px] text-[14px]'>
                        <p>Returning: <strong>{selectedAssignment?.assetId?.item}</strong></p>
                        <p>Student: <strong>{selectedAssignment?.studentId}</strong></p>
                    </div>

                    <div className='flex flex-col gap-[5px]'>
                        <label className='text-[14px] font-[500]'>Condition on Return</label>
                        <select 
                            value={conditionOnReturn}
                            onChange={(e) => setConditionOnReturn(e.target.value)}
                            className='p-2 border rounded-[6px] outline-none focus:border-[#2E3487]'
                        >
                            <option value="Good">Good</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    <Button 
                        onClick={handleReturn}
                        disabled={returnPending}
                        className='bg-[#2E3487] text-white p-2 rounded-[6px] hover:opacity-90 mt-2'
                    >
                        {returnPending ? 'Processing...' : 'Complete Return'}
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default AssetAssignments
