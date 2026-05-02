"use client";
import SuperAdminNavbar from "@/components/navbar/SuperAdminNavbar";
import FinanceSidebar from "@/components/sidebar/FinanceSidebar";
import StockSidebar from "@/components/sidebar/StockSidebar";
import SuperAdminSidebar from "@/components/sidebar/SuperAdminSidebar";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import { HeadTeacherSidebar, DhtSidebar, LogisticsSidebar, MdSidebar, TeacherSidebar, WorkshopAssistantSidebar } from "@/components/sidebar/RoleSidebars";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import useSocket from "../useUtlis/useSocket";
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
        else if (status == "authenticated") {
            const allowedRoles = ["stock", "admin", "superadmin", "finance", "headteacher", "dht", "logistics", "md", "teacher", "workshopassistant"];
            if (allowedRoles.includes(session.user.role)) {
                setIsLoading(false)
                setIsAllowed(true)
            } else {
                setIsNotAuth(true)
                setIsAllowed(false)
                router.push("/");
            }
        } else {
            setIsNotAuth(true)
            setIsAllowed(false)
            router.push("/");
        }
    }, [status, session, router]);

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <OrbitProgress color="#2E3487" size="small" text="" textColor="" />
            </div>
        );
    } else if (isAllowed) {
        return (
            <div className="w-full flex flex-row bg-gray-50">
                <div className="w-[20%] fixed">
                    {session?.user?.role === 'admin' && <AdminSidebar />}
                    {session?.user?.role === 'superadmin' && <SuperAdminSidebar />}
                    {session?.user?.role === 'finance' && <FinanceSidebar />}
                    {session?.user?.role === 'headteacher' && <HeadTeacherSidebar />}
                    {session?.user?.role === 'dht' && <DhtSidebar />}
                    {session?.user?.role === 'logistics' && <LogisticsSidebar />}
                    {session?.user?.role === 'md' && <MdSidebar />}
                    {session?.user?.role === 'teacher' && <TeacherSidebar />}
                    {session?.user?.role === 'workshopassistant' && <WorkshopAssistantSidebar />}
                    {session?.user?.role === 'stock' && <StockSidebar />}
                </div>
                <div className="w-[80%] flex flex-col gap-[10px] ml-auto">
                    <AdminNavbar />
                    {children}
                </div>
            </div>
        );
    }

    return null; // If not allowed, return nothing
}
