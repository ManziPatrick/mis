import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../api/ApiCall";
import { ReceivedMoney, RequestExpense } from "../types/type.types";

const requestExpense = async ({
  requested_for,
  expected_payment_date,
  total_amount_paid,
  total_amount_to_be_paid,
  beneficiary,
  payment_mode,
  payment_account,
  date,
  reason,
  employeeId,
  supplierId,
  description,
  selectedSupplies
}: RequestExpense) => {
  const data = {
    requested_for,
    expected_payment_date,
    total_amount_paid,
    total_amount_to_be_paid,
    beneficiary,
    payment_mode,
    payment_account,
    date,
    reason,
    employeeId,
    supplierId,
    description,
    selectedSupplies
  };
  const response = await API.post("/finance/expense-requests", data);
  return response.data;
};

export const userRequestExpenseMutation = () => {
  return useMutation({
    mutationKey: ["request-expense"],
    mutationFn: requestExpense,
  });
};

export const useGetRequestedExpenseQuery = () => {
  return useQuery({
    queryKey: ["select-expense"],
    queryFn: async () => {
      const response = await API.get("/finance/expense-requests");
      return response.data;
    },
  });
};

export const useApproveRequestedExpense = () => {
  return useMutation({
    mutationKey: ["approve-request"],
    mutationFn: async (data: { id: string; status: string }) => {
      const response = await API.put(`/finance/expense-requests/${data.id}`, {
        status: data.status,
      });
      return response.data;
    },
  });
};

export const useRejectRequestedExpense = () => {
  return useMutation({
    mutationKey: ["reject-request"],
    mutationFn: async (data: { id: string; status: string }) => {
      const response = await API.put(`/finance/expense-requests/${data.id}`, {
        status: data.status,
      });
      return response.data;
    },
  });
};

export const useGetAllVouchers = () => {
  return useQuery({
    queryKey: ["get-vouchers"],
    queryFn: async () => {
      const response = await API.get("/finance/payment-vouchers");
      return response.data;
    },
  });
};

export const useGetSingleVouchersByRequest = (id: string) => {
  return useQuery({
    queryKey: ["get-single-vouchers"],
    queryFn: async () => {
      const response = await API.get(`/finance/payment-vouchers/${id}`);
      return response.data;
    },
  });
};

// received money

export const useGetAllReceivedMoney = () => {
  return useQuery({
    queryKey: ["get-received-money"],
    queryFn: async () => {
      const response = await API.get("/finance/received-money");
      return response.data;
    },
  });
};

const recordReceivedMoney = async (data: ReceivedMoney) => {
  const formData = new FormData();

  formData.append("amount", data.amount.toString());
  formData.append("received_from", data.received_from);
  formData.append("reason", data.reason);
  formData.append("account", data.account);
  formData.append("date", data.date);
  formData.append("approved_by", data.date);

  if (data.signed_document) {
    formData.append("signed_document", data.signed_document);
  }

  const response = await API.post("/finance/received-money", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const useRecordReceivedMoneyMutation = () => {
  return useMutation({
    mutationKey: ["record-received-money"],
    mutationFn: recordReceivedMoney,
  });
};

export const useGetPettyChash = () => {
  return useQuery({
    queryKey: ["get-petty-cash"],
    queryFn: async () => {
      const response = await API.get("/finance/petty-cash");
      return response.data;
    },
  });
};

export const useGetAllPayments = () => {
  return useQuery({
    queryKey: ["get-all-payments"],
    queryFn: async () => {
      const response = await API.get("/finance/payments");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetSinglePayment = (id: string) => {
  return useQuery({
    queryKey: ["get-single-payment", id],
    queryFn: async () => {
      const response = await API.get(`/finance/payments/${id}`);
      return response.data;
    },
  });
};

export const useUploadProofVoucher = () => {
  return useMutation({
    mutationKey: ["upload-signed-voucher"],
    mutationFn: async (data: { signedDocument: any; id: string }) => {
      console.log("dataaaa", data);
      const formData = new FormData();
      if (data.signedDocument) {
        formData.append("signedDocument", data.signedDocument);
      }
      const response = await API.post(
        `/finance/vouchers/${data.id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
  });
};

export const useGetAllPayroll = () => {
  return useQuery({
    queryKey: ["get-all-payroll"],
    queryFn: async () => {
      const response = await API.get("/finance/payroll");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
