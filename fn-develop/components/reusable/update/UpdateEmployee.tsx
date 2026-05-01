"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useUpdateEmployeeMutation } from "@/utlis/hooks/empoyees.hook";
import { toast } from "sonner";

interface UpdateEmployeeProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  employeeData: any;
  reFetch: any;
  departments: any;
}

const UpdateEmployee = ({ isOpen, setIsOpen, employeeData, reFetch, departments }: UpdateEmployeeProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    type: "",
    department: "",
    occupation: "",
    netSalary: "",
    dateOfJoing: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: updateEmployee, isPending } = useUpdateEmployeeMutation();

  useEffect(() => {
    if (employeeData) {
      setFormData({
        name: employeeData.name || "",
        email: employeeData.email || "",
        phone: employeeData.phone || "",
        nationality: employeeData.nationality || "",
        type: employeeData.type || "",
        department: employeeData.department || "",
        occupation: employeeData.occupation || "",
        netSalary: employeeData.netSalary || "",
        dateOfJoing: employeeData.dateOfJoing || ""
      });
    }
  }, [employeeData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.nationality) newErrors.nationality = "Nationality is required";
    if (!formData.type) newErrors.type = "Employment type is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.occupation) newErrors.occupation = "Occupation is required";
    if (!formData.netSalary) newErrors.netSalary = "Net salary is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    updateEmployee(
      { id: employeeData._id, ...formData },
      {
        onSuccess: () => {
          toast.success("Employee updated successfull");
          setIsOpen(false);
          reFetch();
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || "Error updating employee";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Dialog
      header="Update Employee"
      visible={isOpen}
      onHide={() => setIsOpen(false)}
      className="w-[600px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border rounded-md"
              placeholder="Enter full name"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">{errors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 border rounded-md"
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-2 border rounded-md"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <span className="text-red-500 text-xs">{errors.phone}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Nationality</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="p-2 border rounded-md"
            >
              <option value="">Select nationality</option>
              <option value="rwandan">Rwandan</option>
              <option value="foreigner">Foreigner</option>
            </select>
            {errors.nationality && (
              <span className="text-red-500 text-xs">{errors.nationality}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Employment Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="p-2 border rounded-md"
            >
              <option value="">Select type</option>
              <option value="staff">Staff</option>
              <option value="non-staff">Non Staff</option>
            </select>
            {errors.type && (
              <span className="text-red-500 text-xs">{errors.type}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Department</label>
            <input
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="p-2 border rounded-md"
              placeholder="Enter department"
            />
            {errors.department && (
              <span className="text-red-500 text-xs">{errors.department}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Occupation</label>
            <input
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="p-2 border rounded-md"
              placeholder="Enter occupation"
            />
            {errors.occupation && (
              <span className="text-red-500 text-xs">{errors.occupation}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Net Salary</label>
            <input
              type="number"
              name="netSalary"
              value={formData.netSalary}
              onChange={handleChange}
              className="p-2 border rounded-md"
              placeholder="Enter net salary"
            />
            {errors.netSalary && (
              <span className="text-red-500 text-xs">{errors.netSalary}</span>
            )}
          </div>

        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm text-white bg-[#2E3487] rounded-md"
          >
            {isPending ? "Updating..." : "Update Employee"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default UpdateEmployee;