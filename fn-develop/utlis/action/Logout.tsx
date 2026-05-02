import { signOut } from "next-auth/react";
import socket from "@/app/useUtlis/socket";
import API from "../api/ApiCall";

const Logout = async () => {
    try {
        // 1. Disconnect socket
        socket.disconnect();

        // 2. Notify backend of logout
        try {
            await API.post("/auth/logout");
        } catch (err) {
            console.error("Backend logout failed:", err);
        }

        // 3. Clear all local storage
        localStorage.removeItem("userToken");
        localStorage.removeItem("currentUserId");
        // Clear any other relevant storage if needed
        // localStorage.clear(); // Uncomment if you want a complete wipe

        // 4. Sign out and redirect using NextAuth
        await signOut({ callbackUrl: "/" });

    } catch (error) {
        console.error("Error during logout:", error);
        // Fallback redirect if signOut fails
        window.location.href = "/";
    }
};

export default Logout;
