"use client"
import SuperAdminNavbar from "@/components/navbar/SuperAdminNavbar";
import SuperAdminSidebar from "@/components/sidebar/SuperAdminSidebar";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import AdminNavbar from "@/components/navbar/AdminNavbar";



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isNotAuth, setIsNotAuth] = useState<boolean>(false)
    const [isAllowed, setIsAllowed] = useState<boolean>(false)
    const router = useRouter();
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status == "loading") {
            setIsLoading(true)

        }
        else if (status == "unauthenticated") {
            setIsNotAuth(true)
            router.push("/");

        }
        else if (status == "authenticated" && session.user.role == "superadmin") {
            setIsLoading(false)
            setIsAllowed(true)
        }else{
            setIsNotAuth(true)
            setIsAllowed(false)
            router.push("/");

        }
    }, [status, session, router])

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
            </div>
        )
    } else if (isAllowed) {
        return (
            <div className="w-full flex flex-row bg-gray-50">
                <div className="w-[20%] fixed">
                    <SuperAdminSidebar />
                </div>
                <div className="w-[80%] ml-auto flex flex-col gap-[10px]">
                    <AdminNavbar />
                    {children}

                </div>
            </div>
        );
    }
}
