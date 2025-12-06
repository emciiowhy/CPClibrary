"use client";

import React, { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/layout/admin/SidebarAdmin";
import Header from "@/components/layout/admin/HeaderAdmin";
import {
  ChevronRight,
  MoreVertical,
  ScanQrCode,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import BorrowMoreModal from "@/components/borrow/BorrowMoreModal";
import ScanBorrowQr, { ScanBorrowQrHandles } from "@/components/ScanBorrowQr";

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
  penalty?: number;
  qr_code: string;
  totalPenalty?: number;

}

export default function BorrowBookPage() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const [borrowedHistory, setBorrowedHistory] = useState<BorrowedHistory[]>([]);
  const [extendSubmitted, setExtendSubmitted] = useState(false);
  const [borrowedSubmitted, setBorrowedSubmitted] = useState(false);
  const [returnedSubmitted, setReturnedSubmitted] = useState(false);
  const [overdueSubmitted, setOverdueSubmitted] = useState(false);
  const [extendDueDateValue, setExtendDueDateValue] = useState("");
  const [open, setOpen] = useState(false);

  const scannerRef = useRef<ScanBorrowQrHandles>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");
  const [searchBookStatusCategory, setSearchBookStatusCategory] = useState('');

  // Fetch borrowed history
  useEffect(() => {
    const getBorrowed = async () => {
      try {
        const response = await api.get("/api/borrowed");
        const data: BorrowedHistory[] = response.data.data;

        const updatedData = data.map((record) => {
          const dueDate = new Date(record.due_date);
          const today = new Date();

          const diffTime = today.getTime() - dueDate.getTime();
          const overdueDays =
            diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 0;

          // determine status
          let status = record.status;
          if (status !== "returned" && overdueDays > 0) {
            status = "overdue";
          }

          // calculate penalty ONLY IF OVERDUE & NOT RETURNED
          let penalty = 0;
          if (status === "overdue") {
            penalty = overdueDays * 30;
          }

          return { ...record, penalty, status };
        });

        // total penalty per student
        const penaltyPerStudent: Record<string, number> = {};
        updatedData.forEach((record) => {
          if (!penaltyPerStudent[record.student_school_id]) {
            penaltyPerStudent[record.student_school_id] = 0;
          }

          // Only add penalty if the book is overdue
          if (record.status === "overdue") {
            penaltyPerStudent[record.student_school_id] += record.penalty;
          }
        });

        const finalData = updatedData.map((record) => ({
          ...record,
          totalPenalty: penaltyPerStudent[record.student_school_id] || 0,
        }));

        setBorrowedHistory(finalData);

        // send to backend
        for (const studentId in penaltyPerStudent) {
          const studentPenalty = penaltyPerStudent[studentId];

          await api
            .post("/api/admins/add-penalty", {
              studentId,
              penalty: studentPenalty,
            })
            .catch((err) => {
              console.log(
                `Error sending penalty for student ${studentId}:`,
                err
              );
            });
        }
      } catch (error) {
        toast.error("Error in getting all borrowed history");
        console.log(error);
      }
    };

    getBorrowed();
  }, []);

  const setStudentBorrowedStatus = async (
    borrowId: number,
    borrowedStatus: string
  ) => {
    if (borrowedStatus === "borrowed") setBorrowedSubmitted(true);
    if (borrowedStatus === "returned") setReturnedSubmitted(true);
    if (borrowedStatus === "overdue") setOverdueSubmitted(true);

    try {
      const result = await api.post("/api/admins/set-student-borrowed-status", {
        borrowedStatus,
        borrowId,
      });

      toast.success(result.data.message);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      if (borrowedStatus === "borrowed") setBorrowedSubmitted(false);
      if (borrowedStatus === "returned") setReturnedSubmitted(false);
      if (borrowedStatus === "overdue") setOverdueSubmitted(false);

      toast.error("Error in setting book status");
      console.log(error);
    }
  };

  const extendDueDate = async (borrowId: number) => {
    if (!extendDueDateValue) {
      toast.error("Please select a new due date");
      return;
    }
    setExtendSubmitted(true);
    try {
      const result = await api.post("/api/admins/extend-duedate", {
        borrowId,
        extendDueDateValue,
      });
      toast.success(result.data.message);

      setBorrowedHistory((prev) =>
        prev.map((record) =>
          record.borrow_id === borrowId
            ? { ...record, due_date: extendDueDateValue }
            : record
        )
      );
      setExtendDueDateValue("");
      setExtendSubmitted(false);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      setExtendSubmitted(false);
      toast.error("Extending due date failed");
      console.log(error);
    }
  };

  const filteredStudents = borrowedHistory.filter((student) => {
    const matchesSearch = student.student_name.toLowerCase().includes(searchStudent.toLowerCase()) || 
                          student.student_school_id.toLowerCase().includes(searchStudent.toLowerCase()) ||
                          student.book_title.toLowerCase().includes(searchStudent.toLowerCase());

    const matchesBorrowStatusCategory = searchBookStatusCategory === "" || student.status === searchBookStatusCategory;

    return matchesSearch && matchesBorrowStatusCategory;
  })

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

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search student by name or ID"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <label
                htmlFor="course_category"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Borrow Status
              </label>
              <select
                name="course_category"
                id="course_category"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm min-w-[140px] cursor-pointer hover:bg-gray-100"
                value={searchBookStatusCategory}
                onChange={(e) => setSearchBookStatusCategory(e.target.value)}
              >
                <option value="" className="text-gray-500">
                  All Statuses
                </option>
                <option value="pending">Pending</option>
                <option value="borrowed">Borrowed</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex-1 flex flex-col">
          {/* <h1 className="text-md text-gray-700 font-bold my-3">All Borrowed Records</h1> */}

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
              {filteredStudents.map((book) => (
                <div
                  key={book.borrow_id}
                  className="grid grid-cols-1 sm:grid-cols-7 gap-4 px-4 py-3 hover:bg-gray-50 transition-all text-sm items-center"
                >
                  <div className="font-semibold text-gray-800">
                    {book.student_name}
                  </div>
                  <div className="font-semibold text-gray-800">
                    {book.student_school_id}
                  </div>
                  <div className="font-semibold text-gray-800">
                    {book.book_title}
                  </div>
                  <div className="text-gray-700">
                    {new Date(book.borrow_date).toDateString()}
                  </div>
                  <div className="font-semibold text-red-700">
                    {new Date(book.due_date).toDateString()}
                  </div>
                  <div
                    className={`flex font-semibold text-sm ${
                      book.status === "pending"
                        ? "text-gray-700"
                        : book.status === "returned"
                        ? "text-green-700"
                        : book.status === "overdue"
                        ? "text-red-700"
                        : "text-blue-700"
                    }`}
                  >
                    {book.status}
                  </div>

                  <div className="flex flex-row justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <MoreHorizontal className="text-xs transition-transform hover:scale-[1.1] cursor-pointer" />
                      </DialogTrigger>

                      <BorrowMoreModal
                        extendSubmitted={extendSubmitted}
                        borrowedSubmitted={borrowedSubmitted}
                        returnedSubmitted={returnedSubmitted}
                        overdueSubmitted={overdueSubmitted}
                        BorrowedOnClick={() => {
                          if (book.status === "borrowed") {
                            toast.error(
                              "This book is already marked as borrowed."
                            );
                            return;
                          }
                          setStudentBorrowedStatus(book.borrow_id, "borrowed");
                        }}
                        ReturnedOnClick={() => {
                          if (book.status === "returned") {
                            toast.error(
                              "This book is already marked as returned."
                            );
                            return;
                          }
                          setStudentBorrowedStatus(book.borrow_id, "returned");
                        }}
                        OverdueOnClick={() => {
                          if (book.status === "overdue") {
                            toast.error(
                              "This book is already marked as overdue."
                            );
                            return;
                          }
                          setStudentBorrowedStatus(book.borrow_id, "overdue");
                        }}
                        dueDateValue={extendDueDateValue}
                        onDueDateChange={setExtendDueDateValue}
                        ExtendOnClick={() => extendDueDate(book.borrow_id)}
                        penaltyValue={book.totalPenalty || 0}
                        isOverDue={book.status === "overdue"}
                      />
                    </Dialog>

                    {book.status === "pending" && (
                      <Dialog
                        onOpenChange={(isOpen) => {
                          if (!isOpen) {
                            // modal closed → stop camera
                            scannerRef.current?.clearScanner();
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <ScanQrCode
                            className="w-5 h-5 cursor-pointer transition-transform hover:text-indigo-700 hover:scale-[1.05]"
                            onClick={() => {
                              setTimeout(() => {
                                scannerRef.current?.startScanner();
                              }, 100);
                            }}
                          />
                        </DialogTrigger>

                        <ScanBorrowQr
                          ref={scannerRef}
                          onScan={(record) => {
                            console.log("Borrow record:", record);
                          }}
                        />
                      </Dialog>
                    )}
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
