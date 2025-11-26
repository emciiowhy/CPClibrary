"use client";
import React, { useEffect } from "react";
import Sidebar from "@/components/layout/admin/SidebarAdmin";
import Header from "@/components/layout/admin/HeaderAdmin";
import { ChevronRight } from "lucide-react";

interface BorrowedHistory {
  name: string,
  studentId: string,
  bookBorrowed: string,
  date: string,
  dueDate: string,
  status: string,
}

export default function BorrowBookPage() {
  const [openSideBar, setOpenSideBar] = React.useState(true);

  const [borrowedBook, setBorrowedBook] = React.useState<BorrowedHistory[]>([]);

  useEffect(() => {
    setBorrowedBook([
    {
      name: "Jerson Jay",
      studentId: "20240891",
      bookBorrowed: "BASTA LIBRO",
      date: "10-02-25",
      dueDate: "12-21-25",
      status: "borrowed"
    },
    ])
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
            <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-3 bg-gray-100 border-b text-sm font-semibold text-gray-700">
              <div>Name</div>
              <div>Student ID</div>
              <div>Book Borrowed</div>
              <div>Date</div>
              <div>Due Date</div>
              <div>Status</div>
            </div>

            <div className="divide-y">
              { borrowedBook
                .slice(0, 4)
                .map((book) => (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-6 gap-4 px-4 py-3 hover:bg-gray-50 transition-all text-sm items-center"
                  >
                    <div>{book.name}</div>
                    <div>{book.studentId}</div>
                    <div>{book.bookBorrowed}</div>
                    <div>{book.date}</div>
                    <div>{book.dueDate}</div>
                    <div>{book.status}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


