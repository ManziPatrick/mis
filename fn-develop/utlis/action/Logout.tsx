import { signOut } from "next-auth/react";
import socket, { joinRoom } from "@/app/useUtlis/socket";
import { redirect } from "next/navigation";

const Logout = async () => {
    try {
        localStorage.removeItem("userToken");
        const callbackUrl = process.env.NEXT_PUBLIC_BASE_URL || "/";
        socket.disconnect()
        await signOut();
        return redirect(callbackUrl);

    } catch (error) {
        console.error("Error during logout:", error);
    }
};

export default Logout;
