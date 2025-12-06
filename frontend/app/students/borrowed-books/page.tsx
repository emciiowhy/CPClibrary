"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCode, PanelRightClose } from "lucide-react";
import Sidebar from "@/components/layout/students/SidebarStudent";
import Header from "@/components/layout/students/HeaderStudent";
import api from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import BorrowQrCode from "@/components/borrow/BorrowQrCode";

interface BorrowedBooks {
    book_title: string;
    borrow_date: string;
    due_date: string;
    status: string;
    qr_code: string;
}

export default function BorrowedBooks() {
    const router = useRouter();
    //authentication access
    useEffect(() => {
        const verifyStudent = async () => {
            try {
                const result = await api.get('api/students/verify-student');
                if (!result.data.success) {
                    toast.error("Login First");
                    router.push('/students/auth/login');
                }

            } catch (error: any) {
                toast.error(error.response.data.message);
                console.log(error);
                router.push('/students/auth/login');
                return;
            }
        };

        verifyStudent();
    }, []);

    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBooks[]>([]);
    const [openSideBar, setOpenSideBar] = useState(true);

    useEffect(() => {
        const getMyBorrowed = async () => {
            try {
                const response = await api.get("/api/books/my-borrowed");
                setBorrowedBooks(response.data.borrowed);
                console.log(response.data.borrowed);
            } catch (error: any) {
                console.log("Error in getting your borrowed books " + error);
                toast.error(error.response.data.message);
                return;
            }
        };

        getMyBorrowed();
    }, []);

    return (
        <div className="flex-col md:flex-row flex h-screen overflow-hidden">
            <Header />
            {openSideBar && (
                <Sidebar onClickBtnOpenSideBar={() => setOpenSideBar(!openSideBar)} />
            )}

            <main className="flex-1 flex flex-col p-6 bg-gray-100 overflow-y-auto gap-2">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-indigo-900">Borrowed Books</h1>
                    {!openSideBar && (
                        <PanelRightClose
                            className="w-6 h-6 text-indigo-700 cursor-pointer hidden md:block"
                            onClick={() => setOpenSideBar(!openSideBar)}
                        />
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow h-full">
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th className="text-sm border-b p-2 text-left">Book Title</th>
                                <th className="text-sm border-b p-2 text-left">Borrow Date</th>

                                <th className="text-sm border-b p-2 text-left">Due Date</th>
                                <th className="text-sm border-b p-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowedBooks.map((borrowed) => (
                                <tr>
                                    <td className="text-sm border-b p-2 font-semibold">
                                        {borrowed.book_title}
                                    </td>
                                    <td className="text-sm border-b p-2">
                                        {new Date(borrowed.borrow_date).toDateString()}
                                    </td>

                                    <td className="text-sm border-b p-2">
                                        {new Date(borrowed.due_date).toDateString()}
                                    </td>
                                    <td
                                        className={`flex font-semibold text-sm border-b p-2 
                      ${borrowed.status === "pending"
                                                ? "text-gray-700"
                                                : borrowed.status === "returned"
                                                    ? "text-green-700"
                                                    : borrowed.status === "overdue"
                                                        ? "text-red-700"
                                                        : "text-blue-700"
                                            }
                    `}
                                    >
                                        {borrowed.status}
                                        {
                                            borrowed.status === "pending" &&
                                            <td className="px-5">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <button aria-label="Show QR Code">
                                                            <QrCode className="transition-transform duration-100 hover:scale-[1.05] hover:text-blue-700" />
                                                        </button>
                                                    </DialogTrigger>

                                                    <BorrowQrCode img={borrowed.qr_code} />
                                                </Dialog>
                                            </td>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}