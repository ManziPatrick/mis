"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const getSocketURL = () => {
  const url = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").trim();
  // Ensure the URL has a protocol
  return url.includes('://') ? url : `https://${url}`;
};

const socket = typeof window !== "undefined" 
  ? io(getSocketURL(), { autoConnect: false })
  : {} as any;

export const joinRoom = async () => {
  if (typeof window !== "undefined" && socket.emit) {
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
