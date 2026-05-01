import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../api/ApiCall";

export const useGetAllBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await API.get("/library/books");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

interface BookType {
  isbn: string;
  book_name: string;
  quantity: number;
  author: string;
  shelf_number: string;
}

export const useCreateBook = () => {
  return useMutation({
    mutationKey: ["create-book"],
    mutationFn: async (bookData: BookType) => {
      const response = await API.post("/library/books", bookData);
      return response.data;
    },
  });
};

export const useDeleteBook = () => {
  return useMutation({
    mutationKey: ["delete-book"],
    mutationFn: async (id: string) => {
      const response = await API.delete(`/library/books/${id}`);
      return response.data;
    },
  });
};

interface deleteType {
  id: any;
  reason: string;
}

export const useSendDeleteBookRequest = () => {
  return useMutation({
    mutationKey: ["send-delete-book"],
    mutationFn: async (data: deleteType) => {
      const response = await API.post(
        `/library/books/${data.id}/deletion-request`,
        { reason: data.reason }
      );
      return response.data;
    },
  });
};

export const useGetAllBookDeleteRequest = () => {
  return useQuery({
    queryKey: ["book-delete-request"],
    queryFn: async () => {
      const response = await API.get("/library/deletion-requests");
      return response.data;
    },
  });
};


interface UpdateBookType {
  isbn: string;
  book_name: string;
  quantity: number;
  author: string;
  shelf_number: string;
  id:string
}

export const useUpdateBook = () => {
  return useMutation({
    mutationKey: ["update-book"],
    mutationFn: async (bookData: UpdateBookType) => {
      const response = await API.put(`/library/books/${bookData.id}`, bookData);
      return response.data;
    },
  });
};

interface ApproveBookRequestType {
  id: string;
  status: string;
}

export const useApproveBookRequest = () => {
  return useMutation({
    mutationKey: ["approve-reject-book-request"],
    mutationFn: async (data: ApproveBookRequestType) => {
      const response = await API.put(`/library/books/${data.id}/deletion-request`, {status: data.status });
      return response.data;
    },
  });
}
