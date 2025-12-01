"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, PanelRightClose } from "lucide-react";
import IntComSciBook from "@/app/admin/books/images/IntComSciBook.jpg";
import DatabaseManagementBook from "@/app/admin/books/images/DatabaseManagementSystem.png";
import IntroductionToTourismAndHospitalityInBC from "@/app/admin/books/images/IntroductionToTourismAndHospitalityinBC.jpg";
import PrincipleOfTeaching1 from "@/app/admin/books/images/PrincipleOfTeaching1.jpg";
import PrincipleOfTeaching2 from "@/app/admin/books/images/PrincipleOfTeaching2.jpg";
import Sidebar from "@/components/layout/students/SidebarStudent";
import Header from "@/components/layout/students/HeaderStudent";
import api from "@/lib/api";
import { toast } from "sonner";
import { StatsCardModal } from "@/components/dashboard/StatsCard";
import BookCardModal from "@/components/books/BookCardModal"
import BookDialog from "@/components/books/BookCardModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import BookCard from "@/components/books/BookCard";


interface BorrowedBooks {
  book_title: string;
  borrow_date: string;
  due_date: string;
  status: string;
}

export default function BorrowedBooks() {
  const router = useRouter();
  // useEffect(() => {
  //   const verifyAdmin = async () => {
  //     try {
  //       const result = await api.get('api/students/verify-student');
  //       if (!result.data.success) {
  //         toast.error("Login First");
  //         router.push('/students/auth/login');
  //       }

  //     } catch (error: any) {
  //       toast.error(error.response.data.message);
  //       console.log(error);
  //       router.push('/students/auth/login');
  //       return;
  //     }
  //   };

  //   verifyAdmin();
  // });
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBooks[]>([]);
  const [openSideBar, setOpenSideBar] = useState(true);

  useEffect(() => {
    const getMyBorrowed = async () => {
      try {
        const response = await api.get('/api/books/my-borrowed');
        setBorrowedBooks(response.data.borrowed);
        console.log(response.data.borrowed);
      } catch (error: any) {
        console.log("Error in getting your borrowed books " + error);
        toast.error(error.response.data.message);
        return;
      }
    }

    getMyBorrowed();
  }, [])

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
                  <td className="text-sm border-b p-2">{new Date(borrowed.borrow_date).toLocaleDateString()}</td>

                  <td className="text-sm border-b p-2">{new Date(borrowed.due_date).toLocaleDateString()}</td>
                  <td
                    className={`font-semibold text-sm border-b p-2 text-blue-700 
                    ${
                      borrowed.status == "Returned"
                        ? "text-green-700"
                        : "text-blue-700"
                    } 
                    ${
                      borrowed.status == "Overdue"
                        ? "text-red-700"
                        : "text-blue-700"
                    }`}
                  >
                    {borrowed.status}
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
