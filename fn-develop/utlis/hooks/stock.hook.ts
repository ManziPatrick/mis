// get data in stocks and assets

import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../api/ApiCall";

export const useGetAllStock = () => {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: async () => {
      const response = await API.get("/stock");
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetStockById = (id: string) => {
  return useQuery({
    queryKey: ["stocks-by-id"],
    queryFn: async () => {
      const response = await API.get(`/stock/${id}`);
      return response.data;
    },
  });
};

export const useGetAllAssets = () => {
  return useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const response = await API.get("/stock/assets");
      return response.data;
    },
  });
};

export const useGetAssetsById = (id: string) => {
  return useQuery({
    queryKey: ["assets-by-id"],
    queryFn: async () => {
      const response = await API.get(`/stock/assets/${id}`);
      return response.data;
    },
  });
};

export const useGetAllStockCategory = () => {
  return useQuery({
    queryKey: ["stock-category"],
    queryFn: async () => {
      const response = await API.get(`/stock/category`);
      return response.data;
    },
  });
};

export const useGetTansactionStock = () => {
  return useQuery({
    queryKey: ["stock-transaction"],
    queryFn: async () => {
      const response = await API.get(`/stock/transactions`);
      return response.data;
    },
  });
};

export const useGetTansactionStockByStockId = (stockId: string) => {
  return useQuery({
    queryKey: ["stock-transaction", stockId],
    queryFn: async () => {
      const response = await API.get(`/stock/${stockId}/transactions`);
      return response.data;
    },
  });
};

export const useGetUniformPayement = () => {
  return useQuery({
    queryKey: ["uniform-payment"],
    queryFn: async () => {
      const response = await API.get("/stock/uniform-payment");
      return response.data;
    },
  });
};
export const useGetUniformPayementById = (id: string) => {
  return useQuery({
    queryKey: ["uniform-payment", id],
    queryFn: async () => {
      const response = await API.get(`/stock/uniform-payment/${id}`);
      return response.data;
    },
  });
};

// post and update stock and assets thing

const createStock = async (data: any) => {
  const formData = new FormData();

  formData.append("item", data.item);
  formData.append("category", data.category);
  formData.append("description", data.description);
  formData.append("quantity", data.quantity);
  formData.append("supplierId", data.supplierId);
  formData.append("date", data.date);
  formData.append("unity", data.unity);
  formData.append("unityPrice", data.unityPrice);
  formData.append("totalPrice", data.totalPrice);

  if (data.proofOfDelivery) {
    formData.append("proofOfDelivery", data.proofOfDelivery);
  }

  const response = await API.post("/stock", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const userCreateStockMutation = () => {
  return useMutation({
    mutationKey: ["create-stock"],
    mutationFn: createStock,
  });
};

export const userCreateAssetMutation = () => {
  return useMutation({
    mutationKey: ["create-asset"],
    mutationFn: async (data: any) => {
      const response = await API.post("/stock/assets", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
  });
};

interface categoryType {
  name: string;
  description: string;
}

export const userCreateStockCategoryMutation = () => {
  return useMutation({
    mutationKey: ["create-stock-category"],
    mutationFn: async ({ name, description }: categoryType) => {
      const response = await API.post("/stock/category", { name, description });
      return response.data;
    },
  });
};

export const userRemoveStockMutation = () => {
  return useMutation({
    mutationKey: ["remove-stock"],
    mutationFn: async (data: any) => {
      const response = await API.post(`/stock/${data.stockId}/stockout`, {
        quantity: data.quantity,
      });
      return response.data;
    },
  });
};

interface removeStockType {
  stockId: string;
  quantity: number;
  takenBy: string;
}

export const useRemoveItemFromStock = () => {
  return useMutation({
    mutationKey: ["remove-stock"],
    mutationFn: async ({ stockId, quantity, takenBy }: removeStockType) => {
      const response = await API.post(`/stock/${stockId}/stockout`, {
        quantity,
        takenBy,
      });
      return response.data;
    },
  });
};

export const useGetAllTransaction = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await API.get(`/stock/transactions`);
      return response.data;
    },
  });
};

export const useApproveUniformPayment = () => {
  return useMutation({
    mutationKey: ["approve-uniform-payment"],
    mutationFn: async (data: any) => {
      const response = await API.put(
        `/stock/uniform-payment/${data.id}/approve`,
        { approval: data.approval }
      );
      return response.data;
    },
  });
};

export const useGetSingleStockTransaction = (id: string) => {
  return useQuery({
    queryKey: ["stock-transation"],
    queryFn: async () => {
      const response = await API.get(`/stock/${id}/transactions`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteAsset = () => {
  return useMutation({
    mutationKey: ["delete-asset"],
    mutationFn: async (id: string) => {
      const response = await API.delete(`/stock/assets/${id}`);
      return response.data;
    },
  });
};

export const useFinanceUniformStock = (item: string) => {
  return useQuery({
    queryKey: ["finance-uniform-stock"],
    queryFn: async () => {
      const response = await API.get(`/finance/uniform?item=${item}`);
      return response.data;
    },
  });
};

interface updateStockType {
  id: string;
  item: string;
  category: string;
  description: string;
  quantity: number;
  totalPrice: number;
  unityPrice: number;
  unity: string;
}

export const useUpdateStock = () => {
  return useMutation({
    mutationKey: ["update-stock"],
    mutationFn: async ({ id, item, category, description, quantity , totalPrice, unityPrice, unity }: updateStockType) => {
      const formData = new FormData();
      formData.append("item", item);  
      formData.append("category", category);
      formData.append("description", description);
      formData.append("quantity", quantity.toString());
      formData.append("totalPrice", totalPrice.toString());
      formData.append("unityPrice", unityPrice.toString());
      formData.append("unity", unity);
      const response = await API.put(`/stock/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};

export const useUpdateAsset = () => {
  return useMutation({
    mutationKey: ["update-asset"],
    mutationFn: async (data: FormData) => {
      // We assume the id is appended to the FormData
      const id = data.get('id');
      const response = await API.put(`/stock/assets/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
  });
};

export const useGetAllAssetAssignments = () => {
  return useQuery({
    queryKey: ["asset-assignments"],
    queryFn: async () => {
      const response = await API.get("/stock/asset-assignments");
      return response.data;
    },
  });
};

interface AssignAssetType {
  studentId: string;
  conditionOnAssignment: string;
  assetId: string;
}

export const useAssignAsset = () => {
  return useMutation({
    mutationKey: ["assign-asset"],
    mutationFn: async (data: AssignAssetType) => {
      const response = await API.post(`/stock/assets/${data.assetId}/assign`, data);
      return response.data;
    },
  });
};

interface ReturnAssetType {
  assignmentId: string;
  conditionOnReturn: string;
}

export const useReturnAsset = () => {
  return useMutation({
    mutationKey: ["return-asset"],
    mutationFn: async (data: ReturnAssetType) => {
      const response = await API.post(`/stock/asset-assignments/${data.assignmentId}/return`, {
        conditionOnReturn: data.conditionOnReturn
      });
      return response.data;
    },
  });
};
