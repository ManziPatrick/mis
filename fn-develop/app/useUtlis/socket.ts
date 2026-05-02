"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000", {
  autoConnect: false,
});

export const joinRoom = async () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("userToken");
    if (token) {
      socket.emit("join", token);
    } else {
      console.error("Token not found.");
    }
  }
};



export const disconnect = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const useSocket = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined" && session?.user) {
      if (socket.disconnected) {
        socket.connect();
      }

      joinRoom();  

      return () => {
        socket.disconnect();
      };
    }
  }, [session]);

  return socket;
};

export default socket;
