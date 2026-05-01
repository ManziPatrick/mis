"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { Toaster } from "sonner";
import useSocket from "./useUtlis/useSocket";
import { joinRoom } from "./useUtlis/socket";
import { IntlProvider } from "react-intl";

// Define fonts with variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased mx-auto max-w-[2000px]`}>
          <Toaster position="top-right" />
          <IntlProvider locale="en" defaultLocale="en">
          <QueryClientProvider client={queryClient}>
            <InnerLayout>{children}</InnerLayout>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
          </IntlProvider>
        </body>
      </html>
    </SessionProvider>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  // Call useSocket hook unconditionally, but only run its logic when token is available
  useSocket();
  return <>{children}</>;
}
