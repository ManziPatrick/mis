import { signOut } from "next-auth/react";
import socket from "@/app/useUtlis/socket";
import API from "../api/ApiCall";

const Logout = async () => {
    const callbackUrl = process.env.NEXT_PUBLIC_BASE_URL || "/";
    try {
        socket.disconnect()
        try {
            await API.post("/auth/logout");
        } catch (err) {
            console.error("Backend logout failed:", err);
        }
        await signOut({ redirect: false });
        localStorage.removeItem("userToken");
    } catch (error) {
        console.error("Error during logout:", error);
    } finally {
        window.location.href = callbackUrl;
    }
};

export default Logout;
