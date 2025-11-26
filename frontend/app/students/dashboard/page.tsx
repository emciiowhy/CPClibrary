"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book, Users, Clock, ChevronRight, PanelRightClose, BookOpen, AlertCircle, CheckCircle, CreditCard} from "lucide-react";
import Sidebar from "@/components/layout/students/SidebarStudent";
import Header from "@/components/layout/students/HeaderStudent";
import api from "@/lib/api";
import { toast } from "sonner";
import { StatsCardModal } from "@/components/dashboard/StatsCard";

interface RecentBorrowedBooks {
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  // useEffect(() => {
  //   const verifyAdmin = async () => {
  //     try {
  //       const result = await api.get('api/admins/verify-admin');
  //       if (!result.data.success) {
  //         toast.error("Login First");
  //         router.push('/admin/auth/login');
  //       }

  //     } catch (error: any) {
  //       toast.error(error.response.data.message);
  //       console.log(error);
  //       router.push('/admin/auth/login');
  //       return;
  //     }
  //   };

  //   verifyAdmin();
  // });

  const [stats, setStats] = useState([
    {
      title: "BookBorrowed",
      text: "1",
      icon: <BookOpen />,
      bookClassName: "text-blue-700",
    },
    {
      title: "Overdue",
      text: "1",
      icon: <AlertCircle />,
      bookClassName: "text-red-700",
    },
    {
      title: "Returned",
      text: "15",
      icon: <CheckCircle />,
      bookClassName: "text-green-700",
    },
    {
      title: "Fines",
      text: "₱50",
      icon: <CreditCard />,
      bookClassName: "text-yellow-700",
    }
  ]);


  const [recentBorrowed, setRecentBorrowed] = useState<RecentBorrowedBooks[]>([]);

  useEffect(() => {
    setRecentBorrowed([
      {
        bookTitle: "Introduction to Computer Science",
        borrowDate: "26/8/2025",
        dueDate: "26/9/2025",
        status: "Borrowed",
      },
      {
        bookTitle: "Database Management Systems",
        borrowDate: "23/7/2025",
        dueDate: "23/8/2025",
        status: "Returned",
      },
      {
        bookTitle: "Ang Alamat Ni John",
        borrowDate: "10/8/2025",
        dueDate: "10/9/2025",
        status: "Overdue",  
      }
    ]);
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* <div className="bg-white p-2 rounded-lg shadow flex items-center">
            <Book className="text-blue-500 mr-4" />
            <div>
              <h2 className="text-md font-semibold">Total Books</h2>
              <p className="text-sm">{stats.totalBooks}</p>
            </div>
          </div> */}
          {stats.map((value, index) => (
            <StatsCardModal 
              title={value.title}
              text={value.text}
              icon={value.icon}
              bookClassName={value.bookClassName}
              titleClassName={value.bookClassName}
            />
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Recent Borrow Books</h2>
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
              {recentBorrowed.map((record) => (
                <tr>
                  <td className="text-sm border-b p-2 font-semibold">{record.bookTitle}</td>
                  <td className="text-sm border-b p-2">{record.borrowDate}</td>

                  <td className="text-sm border-b p-2">{record.dueDate}</td>
                  <td className={`font-semibold text-sm border-b p-2 text-blue-700 
                    ${ record.status == "Returned" ? "text-green-700" : "text-blue-700"} 
                    ${ record.status == "Overdue" ? "text-red-700" : "text-blue-700"}`}>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
