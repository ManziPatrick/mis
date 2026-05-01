import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../api/ApiCall";
import { NewSupplierType } from "../types/type.types";

export const useGetAllSuppiers = () => {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const response = await API.get("/procurement/supplier");
      return response.data;
    },
  });
};

const createNewSupplier = async (data: NewSupplierType) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("tin", data.tin);
  formData.append("phone", data.phone);
  formData.append("email", data.email);
  formData.append("commodity", data.commodity);
  formData.append("address", data.address);

  if (data.contract) {
    formData.append("contract", data.contract);
  }

  const response = await API.post("/procurement/supplier", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const userCreaSupplierMutation = () => {
  return useMutation({
    mutationKey: ["create-supplier"],
    mutationFn: createNewSupplier,
  });
};

const updateSupplier = async (data: NewSupplierType) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("tin", data.tin);
  formData.append("phone", data.phone);
  formData.append("email", data.email);
  formData.append("commodity", data.commodity);
  formData.append("address", data.address);

  if (data.contract && data.contract !== null) {
    formData.append("contract", data.contract);
  }

  const response = await API.put(`/procurement/supplier/${data.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useUpdateSupplier = () => {
  return useMutation({
    mutationKey: ["update-supplier"],
    mutationFn: updateSupplier,
  });
};

export const useApproveSupplier = () => {
  return useMutation({
    mutationKey: ["approve-supplier"],
    mutationFn: async ({ id, status }: any) => {
      const response = await API.put(`/user/supplier/${id}`, {
        status: status,
      });
      return response.data;
    },
  });
};
export const useDeleteSupplier = () => {
  return useMutation({
    mutationKey: ["delete-supplier"],
    mutationFn: async (id: string) => {
      const response = await API.delete(`/procurement/supplier/${id}`);
      return response.data;
    },
  });
};

interface deleteRequestType {
  id: any;
  reason: string;
}

export const useSendDeleteSupplierRequest = () => {
  return useMutation({
    mutationKey: ["send-delete-supplier-book"],
    mutationFn: async (data: deleteRequestType) => {
      const response = await API.post(
        `/procurement/supplier/${data.id}/delete-request`,
        { reason: data.reason }
      );
      return response.data;
    },
  });
};

export const useGetAllSuppliesToPay = () => {
  return useQuery({
    queryKey: ["supplies-to-pay"],
    queryFn: async () => {
      const response = await API.get("/stock/get-supplies");
      return response.data;
    },
  });
};

export const useGetSingleSuppliesToPay = (id: string) => {
  return useQuery({
    queryKey: ["single-supplies-to-pay"],
    queryFn: async () => {
      const response = await API.get(`/stock/get-supplies/${id}`);
      return response.data;
    },
  });
};


export const useGetAllSupplies = () => {
  return useQuery({
    queryKey: ["supplies"],
    queryFn: async () => {
      const response = await API.get("/stock/get-supplies");
      return response.data;
    },
  });
};

export const useGetSingleSuppliesSupplier = (id: string) => {
  return useQuery({
    queryKey: ["single-supplies-supplier"],
    queryFn: async () => {
      const response = await API.get(`/stock/get-supply/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

export const useGetSingleUnpaidSuppliesSupplier = (id: string) => {
  return useQuery({
    queryKey: ["single-unpaid-supplies-supplier"],
    queryFn: async () => {
      const response = await API.get(`/stock/get-unpaid-supplies/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};
