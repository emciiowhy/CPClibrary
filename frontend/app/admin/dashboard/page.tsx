"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Book,
  Users,
  Clock,
  ChevronRight,
  PanelRightClose,
} from "lucide-react";
import Sidebar from "@/components/layout/admin/SidebarAdmin";
import Header from "@/components/layout/admin/HeaderAdmin";
import api from "@/lib/api";
import { toast } from "sonner";

interface BorrowRecord {
  id: number;
  studentName: string;
  bookTitle: string;
  dateIssued: string;
  dueDate: string;
}

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

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    borrowedBooks: 0,
  });

  const [borrowedHistory, setBorrowedHistory] = useState<BorrowedHistory[]>([]);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const result = await api.get('api/admins/verify-admin');
        if (!result.data.success) {
          toast.error("Login First");
          console.log("error ari sa if");
          router.push('/admin/auth/login');
        }

      } catch (error: any) {
        toast.error(error.response.data.message);
        console.log(error);
        router.push('/admin/auth/login');
        return;
      }
    };

    verifyAdmin();
  });

  useEffect(() => {
    const getBooks = async () => {
      try {
        const books = await api.get('/api/books');
        const students = await api.get('/api/students');
        const borrowed = await api.get('/api/borrowed');
        setBorrowedHistory(borrowed.data.data);

        setStats({
          totalBooks: books.data.length,
          totalMembers: students.data.length,
          borrowedBooks: borrowed.data.data.length,
        });

      } catch (error) {
        toast.error("Error in getting books");
        console.log("Error getting books " + error);
        return;
      }
    }

    getBooks();
  }, [])

  const [recentRecords, setRecentRecords] = useState<BorrowRecord[]>([]);
  const [openSideBar, setOpenSideBar] = useState(true);
  const recentBorrowLimit = 5;

  return (
    <div className="flex-col md:flex-row flex h-screen overflow-hidden">
      <Header />
      {openSideBar && (
        <Sidebar onClickBtnOpenSideBar={() => setOpenSideBar(!openSideBar)} />
      )}

      <main className="flex-1 flex flex-col p-6 bg-gray-100 overflow-y-auto gap-2">
        <div className="flex justify-center items-center flex-row w-fit gap-3 mb-6">
          {!openSideBar && (
            <PanelRightClose
              className="w-6 h-6 hover:cursor-pointer hidden md:block"
              onClick={() => setOpenSideBar(!openSideBar)}
            />
          )}
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-2 rounded-lg shadow flex items-center">
            <Book className="text-blue-500 mr-4" />
            <div>
              <h2 className="text-md font-semibold">Total Books</h2>
              <p className="text-sm">{stats.totalBooks}</p>
            </div>
          </div>
          <div className="bg-white p-2 rounded-lg shadow flex items-center">
            <Users className="text-green-500 mr-4" />
            <div>
              <h2 className="text-md font-semibold">Total Members</h2>
              <p className="text-sm">{stats.totalMembers}</p>
            </div>
          </div>
          <div className="bg-white p-2 rounded-lg shadow flex items-center">
            <Clock className="text-red-500 mr-4" />
            <div>
              <h2 className="text-md font-semibold">Borrowed Books</h2>
              <p className="text-sm">{stats.borrowedBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Recent Borrow Records</h2>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-sm border-b p-2 text-left">Student Name</th>
                <th className="text-sm border-b p-2 text-left">Book Title</th>

                <th className="text-sm border-b p-2 text-left">Date Issued</th>
                <th className="text-sm border-b p-2 text-left">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {borrowedHistory.slice(0, recentBorrowLimit).map((borrowed, i) => (
                <tr key={i}>
                  <td className="text-sm border-b p-2">{borrowed.student_name}</td>
                  <td className="text-sm border-b p-2">{borrowed.book_title}</td>

                  <td className="text-sm border-b p-2">{new Date(borrowed.borrow_date).toLocaleDateString()}</td>
                  <td className="text-sm border-b p-2">{new Date(borrowed.due_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}