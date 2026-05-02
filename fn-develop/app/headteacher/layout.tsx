"use client";
import { HeadTeacherSidebar } from "@/components/sidebar/RoleSidebars";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import AdminNavbar from "@/components/navbar/AdminNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isAllowed, setIsAllowed] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") setIsLoading(true);
        else if (status === "unauthenticated") router.push("/");
        else if (status === "authenticated" && session.user.role === "headteacher") {
            setIsLoading(false);
            setIsAllowed(true);
        } else router.push("/");
    }, [status, session, router]);

    if (isLoading) return <div className="w-full h-screen flex items-center justify-center"><OrbitProgress color="#2E3487" size="small" text="" textColor="" /></div>;
    if (isAllowed) return (
        <div className="w-full flex flex-row bg-gray-50">
            <div className="w-[20%] fixed"><HeadTeacherSidebar /></div>
            <div className="w-[80%] flex flex-col gap-[10px] ml-auto">
                <AdminNavbar />
                {children}
            </div>
        </div>
    );
    return null;
}
