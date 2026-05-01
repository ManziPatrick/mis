import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../api/ApiCall";

const createUniformPayment = async (data: any) => {
  const formData = new FormData();
  formData.append("studentId", data.studentId);
  formData.append("name", data.name);
  formData.append("faculty", data.faculty);
  formData.append("level", data.level);
  formData.append("amountPaid", data.amountPaid);
  formData.append("modeOfPayment", data.modeOfPayment);
  formData.append("fullUniform", data.fullUniform);
  formData.append("numberOfFullUniforms", data.numberOfFullUniforms);
  if (data.proofOfPayment) {
    formData.append("proofOfPayment", data.proofOfPayment);
  }
  if (data.uniforms && Array.isArray(data.uniforms)) {
    data.uniforms.forEach((uniform: any, index: number) => {
      formData.append(`itemName`, uniform.itemName);
      formData.append(`quantity`, String(uniform.quantity));
    });
  }

  const response = await API.post("/finance/uniform-payment", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const userCreateUniformPaymentMutation = () => {
  return useMutation({
    mutationKey: ["create-uniform-payment"],
    mutationFn: createUniformPayment,
  });
};

export const useGetAllUniformPaymentQuery = () => {
  return useQuery({
    queryKey: ["uniform-payment"],
    queryFn: async () => {
      const response = await API.get("/stock/uniform-payment");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

const createUniformStock = async (data: any) => {
  const formData = new FormData();
  formData.append("category", data.category);
  formData.append("item", data.item);
  formData.append("description", data.description);
  formData.append("fullUniformPrice", data.fullUniformPrice);
  formData.append("supplierId", data.supplierId);

  if (data.proofOfDelivery) {
    formData.append("proofOfDelivery", data.proofOfDelivery);
  }

  if (data.uniforms && Array.isArray(data.uniforms)) {
    data.uniforms.forEach((uniform: any, index: number) => {
      formData.append(`itemName`, uniform.itemName);
      formData.append(`itemPrice`, String(uniform.itemPrice));
      formData.append(`itemQuantity`, String(uniform.itemQuantity));
    });
  }

  const response = await API.post("/stock/uniform", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useCreateUniformStock = () => {
  return useMutation({
    mutationKey: ["create-uniform"],
    mutationFn: createUniformStock,
  });
};

export const useGetAllUniform = () => {
  return useQuery({
    queryKey: ["all-uniform-stock"],
    queryFn: async () => {
      const response = await API.get(`/stock/all-uniforms`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
