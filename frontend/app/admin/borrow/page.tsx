"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/admin/SidebarAdmin";
import Header from "@/components/layout/admin/HeaderAdmin";
import { ChevronRight, MoreVertical, QrCode } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface BorrowedHistory {
  borrow_id: number;
  borrow_code: string;
  borrow_date: string;
  due_date: string;
  status: string;
  student_name: string;
  student_school_id: string;
  book_title: string;
  book_author: string;
}

export default function BorrowBookPage() {
  const [openSideBar, setOpenSideBar] = React.useState(true);
  const [borrowedHistory, setBorrowedHistory] = useState<BorrowedHistory[]>([]);

  useEffect(() => {
    const getBorrowed = async () => {
      try {
        const response = await api.get('/api/borrowed');

        setBorrowedHistory(response.data.data);
      } catch (error) {
        toast.error("Error in getting all borrowed history");
        console.log(error);
        return;
      }
    }

    getBorrowed();
  }, [])
  return (
    <div className="flex-col md:flex-row flex h-screen overflow-hidden">
      <Header />
      {openSideBar && (
        <Sidebar onClickBtnOpenSideBar={() => setOpenSideBar(!openSideBar)} />
      )}

      <main className="flex-1 flex flex-col p-6 bg-gray-100 overflow-y-auto gap-4">
        <div className="flex justify-center items-center flex-row w-fit gap-3 mb-6">
          {!openSideBar && (
            <ChevronRight
              className="w-6 h-6 hover:cursor-pointer hidden md:block"
              onClick={() => setOpenSideBar(!openSideBar)}
            />
          )}
          <h1 className="text-2xl font-bold">Borrow Records</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex-1 flex flex-col">
          <h1 className="text-md text-gray-700 font-bold my-3">
            Recent
          </h1>

          <div className="w-full overflow-hidden rounded-lg border flex-1 flex flex-col">
            <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-3 bg-gray-100 border-b text-sm font-semibold text-gray-700">
              <div>Name</div>
              <div>Student ID</div>
              <div>Book Borrowed</div>
              <div>Date</div>
              <div>Due Date</div>
              <div>Status</div>
              <div>More</div>
            </div>

            <div className="divide-y">
              { borrowedHistory
                .slice(0, 4)
                .map((book, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-7 gap-4 px-4 py-3 hover:bg-gray-50 transition-all text-sm items-center "
                  >
                    <div className="font-semibold text-gray-800">{book.student_name}</div>
                    <div className="font-semibold text-gray-800">{book.student_school_id}</div>
                    <div className="font-semibold">{book.book_title}</div>
                    <div className="font-semibold text-green-700">{new Date(book.borrow_date).toDateString()}</div>
                    <div className="font-semibold text-red-700">{new Date(book.due_date).toDateString()}</div>
                    <div className={`flex font-semibold text-sm border-b p-2 
                      ${
                        book.status === "pending"
                          ? "text-gray-700"
                          : book.status === "returned"
                          ? "text-green-700"
                          : book.status === "overdue"
                          ? "text-red-700"
                          : "text-blue-700"
                      }
                    `}>{book.status}</div>
                    <div>
                      <button className="text-gray-700">
                        <MoreVertical className="text-xs transition-transform hover:scale-[1.1]"/>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


