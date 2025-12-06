import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";
import Sidebar from "@/components/layout/admin/SidebarAdmin";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cordova Public College - Library Management System",
  description: "Digital library management system for Cordova Public College",
  icons: {
    icon: '/cpc-logo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
  );
}