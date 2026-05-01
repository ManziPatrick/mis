"use client"
import AdminNavbar from "@/components/navbar/AdminNavbar";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import { useGetAllEmployees } from "@/utlis/hooks/empoyees.hook";
import { useGetRequestedExpenseQuery } from "@/utlis/hooks/expense.hook";
import { useGetAllBookDeleteRequest } from "@/utlis/hooks/library.hook";
import { useGetAllSuppiers } from "@/utlis/hooks/suppliers.hook";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { Toaster } from "sonner";



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname()
    const { data: suppliers, isLoading: supplierLoading} = useGetAllSuppiers()
    const { data: requestedExpenses, isLoading } = useGetRequestedExpenseQuery()
    const { data: requestedEmployee, isLoading:employeeLoading } = useGetAllEmployees()
    const { data: bookRequest, isLoading: bookLoading } = useGetAllBookDeleteRequest()
   

        return (
            <div className="w-full flex flex-col gap-[20px] bg-gray-50">
                <Toaster position='top-right' />
                <div className="flex flex-row gap-[20px] items-center p-3">
                    <Link href={`/admin/requested`} className={`flex border flex-row gap-[10px] text-[13px] p-2 ${pathname === "/admin/requested" ? "bg-blue-900 text-white" : "text-black"}   rounded-[4px] px-4 items-center`}>
                        Expense
                        <span>{!isLoading && requestedExpenses?.filter((ex:any)=> ex.status === "Pending").length || 0}</span>
                    </Link>
                    <Link href={`/admin/requested/supplier`} className={`flex border flex-row gap-[10px] text-[13px] p-2 ${pathname === "/admin/requested/supplier" ? "bg-blue-900 text-white" : "text-black"}   rounded-[4px] px-4 items-center`}>
                        Supplier
                        <span>{!supplierLoading && suppliers?.supplier.filter((sup:any)=> sup.status === "pending" ).length || 0}</span>
                    </Link>
                    <Link href={`/admin/requested/employee`} className={`flex border flex-row gap-[10px] text-[13px] p-2 ${pathname === "/admin/requested/employee" ? "bg-blue-900 text-white" : "text-black"}   rounded-[4px] px-4 items-center`}>
                        Employee
                        <span>{!employeeLoading && requestedEmployee?.filter((sup:any)=> sup.status === "pending" ).length || 0}</span>
                    </Link>
                    <Link href={`/admin/requested/book`} className={`flex border flex-row gap-[10px] text-[13px] p-2 ${pathname === "/admin/requested/book" ? "bg-blue-900 text-white" : "text-black"}   rounded-[4px] px-4 items-center`}>
                        Book
                        <span>{!bookLoading && bookRequest?.filter((data: any) => data.status !== "approved").length || 0}</span>
                    </Link>
                    
                </div>
                {children}
            </div>
        );
    }
