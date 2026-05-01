"use client";
import { useEffect, useCallback, useState } from "react";
import { toast } from "sonner";
import socket, { joinRoom } from "@/app/useUtlis/socket";
import { useQuery } from "@tanstack/react-query";
import API from "@/utlis/api/ApiCall";


const fetchNotifications = async () => {
  const response = await API.get("/notification");
  return response.data;
};

const useSocket = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("userToken");
      setToken(storedToken);
    }
  }, []);

  const {
    data: notifications,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 0,
    enabled: !!token,
  });

  const handleNotification = useCallback(
    (event: string) => {
      const audio = new Audio("/audio/notification.wav");
      audio.play();
      toast.success(event);
      refetch();
    },
    [refetch]
  );

  useEffect(() => {
    if (!token) return;

    if (socket.disconnected) {
      socket.connect();
    }

    joinRoom();

    const events = [
      "expense-request",
      "expense-approved",
      "expense-rejected",
      "book-requested",
      "book-approved",
      "book-rejected",
      "supplier-created",
      "supplier-approved",
      "supplier-rejected",
      "uniform-purchase",
    ];

    // Set up event listeners
    events.forEach((event) => {
      socket.on(event, () => handleNotification(event));
    });

    return () => {
      events.forEach((event) => {
        socket.off(event);
      });
    };
  }, [token, handleNotification]);

  return { notifications, isLoading };
};

export default useSocket;
