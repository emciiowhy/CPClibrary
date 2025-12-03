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
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useBooks } from "@/hooks/useBooks";
import { useMembers } from "@/hooks/useMembers";
import { useBorrow } from "@/hooks/useBorrow";

export default function DashboardPage() {
  const { books } = useBooks();
  const { members } = useMembers();
  const { borrowRecords, borrowStats } = useBorrow();

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    borrowedBooks: 0,
  });

  useEffect(() => {
    setStats({
      totalBooks: books.length,
      totalMembers: members.length,
      borrowedBooks: borrowStats.totalBorrowed,
    });
  }, [books.length, members.length, borrowStats.totalBorrowed]);

  // Get recent borrow records (last 5)
  const recentRecords = borrowRecords.slice(0, 5);

  const [openSideBar, setOpenSideBar] = useState(true);

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
              {recentRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-sm text-center py-4 text-gray-500">
                    No recent borrow records
                  </td>
                </tr>
              ) : (
                recentRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="text-sm border-b p-2">{record.memberName}</td>
                    <td className="text-sm border-b p-2">{record.bookTitle}</td>
                    <td className="text-sm border-b p-2">
                      {new Date(record.issueDate).toLocaleDateString()}
                    </td>
                    <td className="text-sm border-b p-2">
                      {new Date(record.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
