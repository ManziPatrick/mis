import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../api/ApiCall";
import { createEmployeeType, updateEmployeeType } from "../types/type.types";

export const useGetAllEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await API.get("/hr/employee");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

const createEmployee = async (data: createEmployeeType) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("department", data.department);
  formData.append("occupation", data.occupation);
  formData.append("netSalary", data.netSalary);
  formData.append("type", data.type);
  formData.append("phone", data.phone);
  if (data.nationalId) {
    formData.append("nationalId", data.nationalId);
  }
  formData.append("nationality", data.nationality);
  if (data.nationalIdPdf) {
    formData.append("nationalIdPdf", data.nationalIdPdf);
  }
  formData.append("contractPdf", data.contractPdf);
  if (data.visaPdf) {
    formData.append("visaPdf", data.visaPdf);
  }
  if (data.passportPdf) {
    formData.append("passportPdf", data.passportPdf);
  }
  formData.append("dateOfJoining", data.dateOfJoing);

  const response = await API.post("/hr/employee", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useCreateEmployeeMutation = () => {
  return useMutation({
    mutationKey: ["create-employee"],
    mutationFn: createEmployee,
  });
};

export const useDeleteEmployee = () => {
  return useMutation({
    mutationKey: ["delete-employee"],
    mutationFn: async (id: string) => {
      const response = await API.delete(`/hr/employee/${id}`);
      return response.data;
    },
  });
};

export const useGetSingleEmployee = (id: string) => {
  return useQuery({
    queryKey: ["get-employee"],
    queryFn: async () => {
      const response = await API.get(`/hr/employee/${id}`);
      return response.data;
    },
  });
};

const updateEmployee = async (data: updateEmployeeType) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("department", data.department);
  formData.append("occupation", data.occupation);
  formData.append("netSalary", data.netSalary);
  formData.append("type", data.type);
  formData.append("phone", data.phone);
  if (data.nationalId) {
    formData.append("nationalId", data.nationalId);
  }
  formData.append("nationality", data.nationality);
  if (data.nationalIdPdf) {
    formData.append("nationalIdPdf", data.nationalIdPdf);
  }
  if(data.contractPdf){
    formData.append("contractPdf", data.contractPdf);
  }
  if (data.visaPdf) {
    formData.append("visaPdf", data.visaPdf);
  }
  if (data.passportPdf) {
    formData.append("passportPdf", data.passportPdf);
  }

  const response = await API.put(`/hr/employee/${data.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useUpdateEmployeeMutation = () => {
  return useMutation({
    mutationKey: ["update-employee"],
    mutationFn: updateEmployee,
  });
};

export const useApproveEmployee = () => {
  return useMutation({
    mutationKey: ["approve-employee"],
    mutationFn: async ({ id, status }: any) => {
      const response = await API.put(`/user/employee/${id}`, {status});
      return response.data;
    },
  });
};
