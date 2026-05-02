"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import API from "../api/ApiCall"

// ─── School Settings ───────────────────────────────────────────────────────────
export const useGetSchoolSettings = () =>
  useQuery({ queryKey: ["school-settings"], queryFn: () => API.get("/forms/settings").then(r => r.data) })

export const useUpdateSchoolSettings = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => API.put("/forms/settings", data, { headers: { "Content-Type": "multipart/form-data" } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["school-settings"] }),
  })
}

// ─── Purchase Orders ───────────────────────────────────────────────────────────
export const useGetAllPurchaseOrders = () =>
  useQuery({ queryKey: ["purchase-orders"], queryFn: () => API.get("/forms/purchase-orders").then(r => r.data) })

export const useGetPurchaseOrderById = (id: string) =>
  useQuery({ queryKey: ["purchase-order", id], queryFn: () => API.get(`/forms/purchase-orders/${id}`).then(r => r.data), enabled: !!id })

export const useCreatePurchaseOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => API.post("/forms/purchase-orders", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-orders"] }),
  })
}

export const useApprovePurchaseOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => API.put(`/forms/purchase-orders/${id}/approve`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-orders"] }),
  })
}

export const useDeletePurchaseOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => API.delete(`/forms/purchase-orders/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-orders"] }),
  })
}

// ─── Delivery Notes ────────────────────────────────────────────────────────────
export const useGetAllDeliveryNotes = () =>
  useQuery({ queryKey: ["delivery-notes"], queryFn: () => API.get("/forms/delivery-notes").then(r => r.data) })

export const useGetDeliveryNoteById = (id: string) =>
  useQuery({ queryKey: ["delivery-note", id], queryFn: () => API.get(`/forms/delivery-notes/${id}`).then(r => r.data), enabled: !!id })

export const useCreateDeliveryNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => API.post("/forms/delivery-notes", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["delivery-notes"] }),
  })
}

export const useApproveDeliveryNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => API.put(`/forms/delivery-notes/${id}/approve`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["delivery-notes"] }),
  })
}

export const useDeleteDeliveryNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => API.delete(`/forms/delivery-notes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["delivery-notes"] }),
  })
}

// ─── Received Notes ────────────────────────────────────────────────────────────
export const useGetAllReceivedNotes = () =>
  useQuery({ queryKey: ["received-notes"], queryFn: () => API.get("/forms/received-notes").then(r => r.data) })

export const useGetReceivedNoteById = (id: string) =>
  useQuery({ queryKey: ["received-note", id], queryFn: () => API.get(`/forms/received-notes/${id}`).then(r => r.data), enabled: !!id })

export const useCreateReceivedNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => API.post("/forms/received-notes", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["received-notes"] }),
  })
}

export const useApproveReceivedNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => API.put(`/forms/received-notes/${id}/approve`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["received-notes"] }),
  })
}

export const useDeleteReceivedNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => API.delete(`/forms/received-notes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["received-notes"] }),
  })
}

// ─── Store Cards ───────────────────────────────────────────────────────────────
export const useGetAllStoreCards = () =>
  useQuery({ queryKey: ["store-cards"], queryFn: () => API.get("/forms/store-cards").then(r => r.data) })

export const useGetStoreCardById = (id: string) =>
  useQuery({ queryKey: ["store-card", id], queryFn: () => API.get(`/forms/store-cards/${id}`).then(r => r.data), enabled: !!id })

export const useCreateStoreCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => API.post("/forms/store-cards", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["store-cards"] }),
  })
}

export const useApproveStoreCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => API.put(`/forms/store-cards/${id}/approve`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["store-cards"] }),
  })
}

export const useDeleteStoreCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => API.delete(`/forms/store-cards/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["store-cards"] }),
  })
}

// ─── Requisitions ──────────────────────────────────────────────────────────────
export const useGetAllRequisitions = () =>
  useQuery({ queryKey: ["requisitions"], queryFn: () => API.get("/forms/requisitions").then(r => r.data) })

export const useGetRequisitionById = (id: string) =>
  useQuery({ queryKey: ["requisition", id], queryFn: () => API.get(`/forms/requisitions/${id}`).then(r => r.data), enabled: !!id })

export const useCreateRequisition = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => API.post("/forms/requisitions", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requisitions"] }),
  })
}

export const useApproveRequisition = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => API.put(`/forms/requisitions/${id}/approve`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requisitions"] }),
  })
}

export const useDeleteRequisition = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => API.delete(`/forms/requisitions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requisitions"] }),
  })
}

// ─── Mini Requisitions (Annex VI) ──────────────────────────────────────────────
export const useGetAllMiniRequisitions = () =>
  useQuery({ queryKey: ["mini-requisitions"], queryFn: () => API.get("/forms/mini-requisitions").then(r => r.data) })

export const useGetMiniRequisitionById = (id: string) =>
  useQuery({ queryKey: ["mini-requisition", id], queryFn: () => API.get(`/forms/mini-requisitions/${id}`).then(r => r.data), enabled: !!id })

export const useCreateMiniRequisition = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => API.post("/forms/mini-requisitions", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mini-requisitions"] }),
  })
}

export const useApproveMiniRequisition = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => API.put(`/forms/mini-requisitions/${id}/approve`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mini-requisitions"] }),
  })
}

export const useDeleteMiniRequisition = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => API.delete(`/forms/mini-requisitions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mini-requisitions"] }),
  })
}

// ─── Monthly Inventory Reports (Annex VII) ─────────────────────────────────────
export const useGetAllMonthlyInventories = () =>
  useQuery({ queryKey: ["monthly-inventories"], queryFn: () => API.get("/forms/monthly-inventories").then(r => r.data) })

export const useGetMonthlyInventoryById = (id: string) =>
  useQuery({ queryKey: ["monthly-inventory", id], queryFn: () => API.get(`/forms/monthly-inventories/${id}`).then(r => r.data), enabled: !!id })

export const useCreateMonthlyInventory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => API.post("/forms/monthly-inventories", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["monthly-inventories"] }),
  })
}

export const useApproveMonthlyInventory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => API.put(`/forms/monthly-inventories/${id}/approve`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["monthly-inventories"] }),
  })
}

export const useDeleteMonthlyInventory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => API.delete(`/forms/monthly-inventories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["monthly-inventories"] }),
  })
}

// ─── Utilization Reports (Annex VIII) ──────────────────────────────────────────
export const useGetAllUtilizationReports = () =>
  useQuery({ queryKey: ["utilization-reports"], queryFn: () => API.get("/forms/utilization-reports").then(r => r.data) })

export const useGetUtilizationReportById = (id: string) =>
  useQuery({ queryKey: ["utilization-report", id], queryFn: () => API.get(`/forms/utilization-reports/${id}`).then(r => r.data), enabled: !!id })

export const useCreateUtilizationReport = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => API.post("/forms/utilization-reports", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["utilization-reports"] }),
  })
}

export const useApproveUtilizationReport = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => API.put(`/forms/utilization-reports/${id}/approve`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["utilization-reports"] }),
  })
}

export const useDeleteUtilizationReport = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => API.delete(`/forms/utilization-reports/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["utilization-reports"] }),
  })
}

// ─── Generic Proof Upload ────────────────────────────────────────────────────
export const useUploadFormProof = (formType: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: string, file: File }) => {
      const formData = new FormData();
      formData.append("proof", file);
      return API.put(`/forms/${formType}/${id}/proof`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [formType] }),
  })
}

