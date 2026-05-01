import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { IoMdDocument } from 'react-icons/io';
import * as Yup from 'yup';
import { useCreateEmployeeMutation } from '@/utlis/hooks/empoyees.hook';

interface NewEmployeeType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    reFetch: () => void;
    departments: string[];
}

interface EmployeeFormValues {
    name: string;
    email: string;
    department: string;
    occupation: string;
    netSalary: string;
    type: string;
    phone: string;
    nationalId: string;
    nationality: string;
    nationalIdPdf: File | null;
    contractPdf: File | null;
    visaPdf: File | null;
    passportPdf: File | null;
    dateOfJoing: string;
}

type FileInputKeys = 'nationalIdPdf' | 'contractPdf' | 'visaPdf' | 'passportPdf';

const NewEmployee = ({ isOpen, setIsOpen, reFetch, departments }: NewEmployeeType) => {
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: createEmployee, isPending } = useCreateEmployeeMutation()

    const employeeSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        department: Yup.string().required('Department is required'),
        occupation: Yup.string().required('Occupation is required'),
        netSalary: Yup.string().required('Net salary is required'),
        type: Yup.string().required('Employee type is required'),
        phone: Yup.string().required('Phone number is required'),
        nationalId: Yup.string(),
        nationality: Yup.string().required('Nationality is required'),
        dateOfJoing: Yup.string().required('Date of joining is required')
    });

    const employeeFormik = useFormik<EmployeeFormValues>({
        initialValues: {
            name: '',
            email: '',
            department: '',
            occupation: '',
            netSalary: '',
            type: '',
            phone: '',
            nationalId: '',
            nationality: '',
            nationalIdPdf: null,
            contractPdf: null,
            visaPdf: null,
            passportPdf: null,
            dateOfJoing: ''
        },
        validationSchema: employeeSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {

                createEmployee(values, {
                    onSuccess: (response) => {
                        toast.success("Employee created successfully");
                        reFetch()
                        employeeFormik.resetForm();
                        setIsOpen(false);
                    },
                    onError: (error: any) => {
                        toast.error(error.response.data.message);
                    }
                })

            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        },
    });

    const renderFileInput = (fieldName: FileInputKeys, label: string) => (
        <div className="flex flex-col gap-[4px] w-full">
            <span className="text-[12px] text-black">{label}</span>
            <label
                htmlFor={fieldName}
                className={`cursor-pointer border flex flex-row gap-[4px] p-3 rounded-[12px] ${employeeFormik.values[fieldName] !== null ? "text-white bg-[#2E3487]" : ""
                    } items-center justify-center`}
            >
                <IoMdDocument size={20} />
                <span className="text-[13px] font-[500]">Upload {label}</span>
            </label>
            <input
                type="file"
                name={fieldName}
                id={fieldName}
                accept="application/pdf"
                className="hidden"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const file = event.currentTarget.files?.[0] || null;
                    employeeFormik.setFieldValue(fieldName, file);
                }}
            />
            {employeeFormik.touched[fieldName] && employeeFormik.errors[fieldName] && (
                <div className="text-red-500 text-[12px]">{String(employeeFormik.errors[fieldName])}</div>
            )}
        </div>
    );

    return (
        <>
            <Toaster position="top-right" />
            <Dialog
                header="New Employee"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/2"
                visible={isOpen}
                onHide={() => setIsOpen(false)}
            >
                <form
                    onSubmit={employeeFormik.handleSubmit}
                    className="w-full p-3 flex flex-col gap-[10px]"
                >
                    <div className="grid grid-cols-2 gap-[5px]">
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Name</span>
                            <input
                                value={employeeFormik.values.name}
                                name="name"
                                onChange={employeeFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter employee name"
                            />
                            {employeeFormik.touched.name && employeeFormik.errors.name && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.name}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Email</span>
                            <input
                                value={employeeFormik.values.email}
                                name="email"
                                onChange={employeeFormik.handleChange}
                                type="email"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter email address"
                            />
                            {employeeFormik.touched.email && employeeFormik.errors.email && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.email}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Department</span>
                            <input
                                value={employeeFormik.values.department}
                                name="department"
                                type='text'
                                onChange={employeeFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder='Enter departments'
                            />
                            {employeeFormik.touched.department && employeeFormik.errors.department && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.department}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Occupation</span>
                            <input
                                value={employeeFormik.values.occupation}
                                name="occupation"
                                onChange={employeeFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter occupation"
                            />
                            {employeeFormik.touched.occupation && employeeFormik.errors.occupation && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.occupation}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Net Salary</span>
                            <input
                                value={employeeFormik.values.netSalary}
                                name="netSalary"
                                onChange={employeeFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter net salary"
                            />
                            {employeeFormik.touched.netSalary && employeeFormik.errors.netSalary && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.netSalary}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Employee Type</span>
                            <select
                                value={employeeFormik.values.type}
                                name="type"
                                onChange={employeeFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"
                            >
                                <option value="" disabled>Select employee type</option>
                                <option value="staff">Staff</option>
                                <option value="non-staff">Non staff</option>
                            </select>
                            {employeeFormik.touched.type && employeeFormik.errors.type && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.type}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Phone Number</span>
                            <input
                                value={employeeFormik.values.phone}
                                name="phone"
                                onChange={employeeFormik.handleChange}
                                type="text"
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder="Enter phone number"
                            />
                            {employeeFormik.touched.phone && employeeFormik.errors.phone && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.phone}</div>
                            )}
                        </div>


                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Nationality</span>
                            <select
                                value={employeeFormik.values.nationality}
                                name="nationality"
                                onChange={employeeFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"
                            >
                                <option value="" disabled>Select nationality</option>
                                <option value="rwandan">Rwandan</option>
                                <option value="foreigner">Foreigner</option>

                            </select>
                            {employeeFormik.touched.nationality && employeeFormik.errors.nationality && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.nationality}</div>
                            )}
                        </div>
                        {employeeFormik.values.nationality != "foreigner" && (
                            <>
                                <div className="flex flex-col gap-[4px] w-full">
                                    <span className="text-[12px] text-black">National ID</span>
                                    <input
                                        value={employeeFormik.values.nationalId}
                                        name="nationalId"
                                        onChange={employeeFormik.handleChange}
                                        type="text"
                                        className="border p-3 text-[12px] rounded-[12px]"
                                        placeholder="Enter national ID"
                                    />
                                    {employeeFormik.touched.nationalId && employeeFormik.errors.nationalId && (
                                        <div className="text-red-500 text-[12px]">{employeeFormik.errors.nationalId}</div>
                                    )}
                                </div>

                                {renderFileInput('nationalIdPdf', 'National ID Document')}
                            </>


                        )}
                        {renderFileInput('contractPdf', 'Contract Document')}
                        {employeeFormik.values.nationality != "rwandan" && (
                            <>
                                {renderFileInput('visaPdf', 'Visa Document')}
                                {renderFileInput('passportPdf', 'Passport Document')}
                            </>
                        )}

                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Date of Joining</span>
                            <input
                                value={employeeFormik.values.dateOfJoing}
                                name="dateOfJoing"
                                onChange={employeeFormik.handleChange}
                                type="date"
                                className="border p-3 text-[12px] rounded-[12px]"
                            />
                            {employeeFormik.touched.dateOfJoing && employeeFormik.errors.dateOfJoing && (
                                <div className="text-red-500 text-[12px]">{employeeFormik.errors.dateOfJoing}</div>
                            )}
                        </div>
                    </div>

                    <Button
                        loading={isPending}
                        className="flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center"
                    >
                        Save Employee
                    </Button>
                </form>
            </Dialog>
        </>
    );
};

export default NewEmployee;