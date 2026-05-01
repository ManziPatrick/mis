import { useQuery } from "@tanstack/react-query";
import API from "../api/ApiCall";

export const useGetStockValue = () => {
  return useQuery({
    queryKey: ["stock-value"],
    queryFn: async () => {
      const response = await API.get("/report/total-stock-value");
      return response.data;
    },
  });
};
export const useGetAllPendingApprovals = () => {
  return useQuery({
    queryKey: ["pending-approvals"],
    queryFn: async () => {
      const response = await API.get("/report/pending-approvals");
      return response.data;
    },
  });
};

export const useGetAllApprovedRequest = () => {
  return useQuery({
    queryKey: ["approved-requests"],
    queryFn: async () => {
      const response = await API.get("/report/approved-requests");
      return response.data;
    },
  });
};

export const useGetAllRejectedRequest = () => {
  return useQuery({
    queryKey: ["rejected-requests"],
    queryFn: async () => {
      const response = await API.get("/report/rejected-requests");
      return response.data;
    },
  });
};

export const useGetPettyCashReport = () => {
  return useQuery({
    queryKey: ["petty-cash-report"],
    queryFn: async () => {
      const response = await API.get("/report/petty-cash");
      return response.data;
    },
  });
};

export const useGetLowStock = () => {
  return useQuery({
    queryKey: ["low-stock"],
    queryFn: async () => {
      const response = await API.get(`/report/low-stock`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetStockSummary = () => {
  return useQuery({
    queryKey: ["stock-summary"],
    queryFn: async () => {
      const response = await API.get(`/report/stock-summary`);
      return response.data;
    },
  });
};
