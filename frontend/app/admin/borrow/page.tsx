"use client";
import React, { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ChevronRight, BookOpen, AlertCircle } from "lucide-react";
import { useBorrow } from "@/hooks/useBorrow";
import { BorrowRecord } from "@/types/borrow";

export default function BorrowBookPage() {
  const [openSideBar, setOpenSideBar] = React.useState(true);
  const { borrowRecords, loading, error, fetchBorrowRecords } = useBorrow();

  useEffect(() => {
    fetchBorrowRecords();
  }, []);
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
              {loading ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  Loading borrow records...
                </div>
              ) : error ? (
                <div className="px-4 py-8 text-center text-red-500 flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              ) : borrowRecords.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No borrow records found
                </div>
              ) : (
                borrowRecords
                  .slice(0, 10)
                  .map((record: BorrowRecord) => (
                    <div
                      key={record.id}
                      className="grid grid-cols-1 sm:grid-cols-6 gap-4 px-4 py-3 hover:bg-gray-50 transition-all text-sm items-center"
                    >
                      <div>{record.memberName}</div>
                      <div>{record.studentId}</div>
                      <div>{record.bookTitle}</div>
                      <div>{new Date(record.issueDate).toLocaleDateString()}</div>
                      <div>{new Date(record.dueDate).toLocaleDateString()}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'borrowed'
                            ? 'bg-blue-100 text-blue-800'
                            : record.status === 'returned'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


