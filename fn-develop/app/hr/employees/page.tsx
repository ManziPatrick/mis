"use client";
import React, { useState } from "react";
import { useCreateEmployeeMutation, useDeleteEmployee, useGetAllEmployees } from "@/utlis/hooks/empoyees.hook";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { BiSearch } from "react-icons/bi";
import { BsFilterSquareFill } from "react-icons/bs";
import { GiEmptyWoodBucket } from "react-icons/gi";
import { OrbitProgress } from "react-loading-indicators";
import { Button } from "primereact/button";
import NewEmployee from "@/components/reusable/NewEmployee";
import { FaRegPenToSquare } from "react-icons/fa6";
import { GoEye } from "react-icons/go";
import { Dialog } from "primereact/dialog";
import { tuple } from "yup";
import { toast } from "sonner";
import UpdateEmployee from "@/components/reusable/update/UpdateEmployee";

const Employeee = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isView, setIsView] = useState<boolean>(false)
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const [viewedData, setViewedData] = useState<any>({})
  const { data: employees, isLoading, isError, error, refetch } = useGetAllEmployees();
  const { mutate: createEmployeee, isPending } = useCreateEmployeeMutation()
  const { mutate: deletEmployee, isPending: deleting } = useDeleteEmployee()

  const dateTemplate = (rowData: any) => {
    return (
      <div className="flex flex-row gap-[10px] items-center">
        <span>{new Date(rowData.dateOfJoining).toISOString().split('T')[0]}</span>
      </div>
    )
  }
  const salaryTemplate = (rowData: any) => {
    return (
      <div className="flex flex-row gap-[10px] items-center">
        <span>{rowData.netSalary} Frw</span>
      </div>
    )
  }

  const actionTemplate = (rowData: any) => {
    return (
      <div className="flex flex-row gap-[20px] items-center">
        <div onClick={() => { setViewedData(rowData); setIsView(true) }} className="text-green-700 cursor-pointer"><GoEye size={20} /></div>
        <div onClick={() => { setViewedData(rowData); setIsUpdate(true) }} className="text-orange-700 cursor-pointer"><FaRegPenToSquare size={16} /></div>
      </div>
    )
  }

  const deleteEmployeeFunc = (id: string) => {
    deletEmployee(id, {
      onSuccess: () => {
        refetch()
        toast.success("Delete Employeee successfully")
        setIsView(false)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "Error deleting employee";
        toast.error(errorMessage);

      }
    })


  }

  const statusTemplate = (rowData: any) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'approved':
          return 'bg-green-100 text-green-700';
        case 'rejected':
          return 'bg-red-100 text-red-700';
        case 'pending':
          return 'bg-yellow-100 text-yellow-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <div className="flex flex-row gap-[10px] items-center">
        <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getStatusColor(rowData.status)}`}>
          {rowData.status}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-[20px] p-4">
      {/* Breadcrumb */}
      <div className="w-full items-center justify-between flex flex-row">
        <div className="flex flex-row cursor-pointer gap-[4px] items-center">
          <span className="text-[14px]">HR /</span>
          <span className="text-[14px] font-[600]">Employees</span>
        </div>
        <Button onClick={() => setIsOpen(true)} className='text-[14px] text-white rounded-[6px] hover:opacity-80 px-6 py-3 bg-[#2E3487] flex flex-row gap-[10px] items-center'>
          +
          New Employee
        </Button>
      </div>

      {/* Employee Stats */}
      <div className="flex flex-row gap-[20px] items-center justify-between">
        <div className="flex flex-col gap-[10px]  items-center justify-center bg-white rounded-[6px] py-4">
          <div className="pb-4 border-b px-20 w-full flex items-center justify-center">
            <span className="text-[22px] font-[600] text-center">
              {employees?.length || 0}
            </span>
          </div>
          <div className="px-20 w-full flex items-center justify-center">
            <span className="text-[14px] font-[700] text-center">Employees</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="w-full flex flex-row gap-[10px] items-center p-4 bg-white rounded-[6px] justify-between">
        <div className="flex flex-row gap-[10px]">
          <span className="text-[18px] font-[400]">Employees</span>
          <div className="p-1 px-2 rounded-[4px] bg-gray-50">
            <span className="font-[500]">{employees?.length || 0}</span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-[10px]">
          <div className="flex flex-row border items-center gap-[10px] rounded-[12px] p-2">
            <BiSearch />
            <input
              type="text"
              placeholder="Search something"
              className="outline-none"
            />
          </div>
          <div className="p-2 cursor-pointer">
            <BsFilterSquareFill color="black" size={20} />
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="w-full p-10 rounded-[6px] bg-white flex items-center justify-center">

          <div className="w-full p-10 flex items-center justify-center">
            <OrbitProgress color="#2E3487" size="small" />
          </div>
        </div>
      ) : (
        <>
          {/* Error or No Employees */}
          {isError ? (
            <div className="w-full p-10 rounded-[6px] bg-white flex items-center justify-center">
              <div className="w-full flex  items-center text-center justify-center p-2 flex-col gap-[3px]">
                <GiEmptyWoodBucket size={60} color="lightgray" />
                <span className="text-[16px] font-[700]">No Employees Found</span>
                <span className="text-[12px]">There are no employees yet.</span>
              </div>
            </div>

          ) : (<>

            {/* DataTable */}
            {employees?.length > 0 && (
              <DataTable
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 40]}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                value={employees.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                className="w-full mt-4"
              >
                <Column
                  body={(rowData, options) =>
                    (options.rowIndex + 1).toString().padStart(3, "0")
                  }
                  field="code"
                  header="#"
                  headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[14px] font-[400]"
                  bodyClassName="h-[8vh] p-2 text-[13px] border-b"
                ></Column>
                <Column
                  field="name"
                  header="Name"
                  headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                  bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                ></Column>
                <Column
                  field="phone"
                  header="Phone"
                  headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                  bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                ></Column>
                <Column
                  field="nationality"
                  header="Nationality"
                  headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                  bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                ></Column>
                <Column
                  field=""
                  header="Net Salary"
                  body={salaryTemplate}
                  headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                  bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                ></Column>
                <Column
                  field="type"
                  header="Type"
                  headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                  bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                ></Column>
                <Column
                  field=""
                  header="Joined On"
                  body={dateTemplate}
                  headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                  bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                ></Column>
                <Column
                  field="status"
                  header="Status"
                  body={statusTemplate}
                  headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                  bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                ></Column>
                <Column
                  field="action"
                  header="Action"
                  body={actionTemplate}
                  headerClassName="h-[8vh] bg-[#2E3487] text-white px-2 text-[12px] font-[400]"
                  bodyClassName="h-[8vh] p-2 text-[12px] border-b"
                ></Column>
              </DataTable>
            )}
          </>)}
        </>
      )}
      <NewEmployee isOpen={isOpen} setIsOpen={setIsOpen} reFetch={refetch} departments={[]} />
      <Dialog
        header="Employee"
        headerStyle={{ fontSize: 10, color: "black" }}
        className="w-1/2"
        visible={isView}
        onHide={() => setIsView(false)}
      >
        <div className="w-full flex flex-col gap-[20px]">
          <div className="w-full p-4 bg-gray-100 rounded-[6px] flex flex-row gap-[20px] justify-between">
            <div className="flex flex-row gap-[10px] items-center">
              <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
                <span className="text-[20px] text-center justify-center font-[400] text-black">
                  {viewedData?.name?.split(" ")[0]?.split("")[0]}
                  {viewedData?.name?.split(" ")[1]?.split("")[0]}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] text-black font-[600]">{viewedData?.name}</span>
                <span className="text-[13px] font-[500]">{viewedData?.phone}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-black font-[600]">Email</span>
              <span className="text-[13px] font-[500]">{viewedData?.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-black font-[600]">Joined on</span>
              <span className="text-[13px] font-[500]">
                {viewedData?.dateOfJoining
                  ? new Date(viewedData.dateOfJoining).toISOString().split('T')[0]
                  : "N/A"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[20px]">
            <div className="flex flex-col">
              <span className="text-[16px] text-black font-[500]">Department</span>
              <span className="text-[13px] font-[500]">{viewedData?.department}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-black font-[500]">Net Salary</span>
              <span className="text-[13px] font-[500]">{viewedData?.netSalary} frw</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-black font-[500]">Occupation</span>
              <span className="text-[13px] font-[500]">{viewedData?.occupation}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-black font-[500]">Type</span>
              <span className="text-[13px] font-[500]">{viewedData?.type}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-black font-[500]">Status</span>
              <span className="text-[13px] font-[500]">{viewedData?.status}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-black font-[500]">Nationality</span>
              <span className="text-[13px] font-[500] uppercase">{viewedData?.nationality}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-black font-[500]">Contract</span>
              <a href={viewedData?.contractPdf} target="_blank" className="text-[14px] text-blue-500 font-[500]">VIEW</a>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-black font-[500]">National ID</span>
              <a href={viewedData?.nationalIdPdf} target="_blank" className="text-[14px] text-blue-500 font-[500]">VIEW</a>
            </div>
            {viewedData.nationality !== "rwandan" && (
              <>
                <div className="flex flex-col">
                  <span className="text-[16px] text-black font-[500]">Passport</span>
                  <a href={viewedData?.passportPdf} target="_blank" className="text-[14px] text-blue-500 font-[500]">VIEW</a>
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] text-black font-[500]">Visa</span>
                  <a href={viewedData?.visaPdf} target="_blank" className="text-[14px] text-blue-500 font-[500]">VIEW</a>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-end justify-end">
            <div className="flex flex-col gap-[10px]">
              <span className="text-red-500">Danger Zone</span>
              <Button onClick={() => deleteEmployeeFunc(viewedData?._id)} className=" text-white px-4 py-[4px] text-center flex items-center justify-center bg-red-500 rounded-[6px]">{deleting ? "loading." : "Delete "}</Button>
            </div>
          </div>
        </div>
      </Dialog>
      <UpdateEmployee
        isOpen={isUpdate}
        setIsOpen={setIsUpdate}
        reFetch={refetch}
        departments={[]}
        employeeData={viewedData}
      />


    </div>
  );
};

export default Employeee;
