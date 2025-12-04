"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/admin/SidebarAdmin";
import Header from "@/components/layout/admin/HeaderAdmin";
import { ChevronRight, MoreVertical, PanelRightClose, QrCode, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import MemberRestoreModal from "@/components/members/MemberRestoreModal";
import StockProfile from "@/public/StockProfile.jpg"

interface DeletedStudentsType {
  id: number;
  name: string;
  email: string;
  student_id: string;
  status: string;
  section: string;
  course: string;
  profile_url: string;
}

export default function DeletedStudents() {
  const [openSideBar, setOpenSideBar] = React.useState(true);
  const [deletedStudent, setDeletedStudents] = useState<DeletedStudentsType[]>([]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const getDeletedStudents = async () => {
      try {
        const response = await api.get('/api/admins/get-deleted-students');

        setDeletedStudents(response.data.students);
      } catch (error) {
        toast.error("Error in getting all borrowed history");
        console.log(error);
        return;
      }
    }

    getDeletedStudents();
  }, []);

  const handleRestore = async (reason: string) => {
    setSubmitted(true);
    try {
      const result = await api.post('/api/admins/restore-student', {email, reason});

      toast.success(result.data.message);
      setSubmitted(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      setSubmitted(false);
      toast.error(error?.response?.data?.message || "Restoring student failed");
      console.log(error);
    }
  }

  return (
    <div className="flex-col md:flex-row flex h-screen overflow-hidden">
      <Header />
      {openSideBar && (
        <Sidebar onClickBtnOpenSideBar={() => setOpenSideBar(!openSideBar)} />
      )}

      <main className="flex-1 flex flex-col p-6 bg-gray-100 overflow-y-auto gap-4 h-screen">
        <div className="flex justify-center items-center flex-row w-fit gap-3 mb-6">
          {!openSideBar && (
            <PanelRightClose
              className="w-6 h-6 hover:cursor-pointer hidden md:block"
              onClick={() => setOpenSideBar(!openSideBar)}
            />
          )}
          <h1 className="text-2xl font-bold">Deleted Students</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex-1 flex flex-col">
          <h1 className="text-md text-gray-700 font-bold my-3">
            All Registered Students
          </h1>

          <div className="w-full overflow-hidden rounded-lg border flex-1 flex flex-col">
            <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-3 bg-gray-100 border-b text-sm font-semibold text-gray-700">
              <div>Profile</div>
              <div>Name</div>
              <div>School ID</div>
              <div>Course</div>
              <div>Section</div>
              <div>Status</div>
              <div>Restore</div>
            </div>

            <table>
              <tbody className="divide-y">
                {deletedStudent.map((student, i) => (
                    <tr
                      key={student.id}
                      className="grid grid-cols-1 sm:grid-cols-7 gap-4 px-4 py-3 hover:bg-gray-50 transition-all text-sm items-center"
                    >
                      <td className="flex md:block justify-start md:text-center">
                        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-medium text-gray-700">
                          <img
                            src={student.profile_url || StockProfile.src} 
                            alt="student profile" 
                            className="w-20 rounded-full"
                          />
                        </div>
                      </td>
                      <td>{student.name}</td>
                      <td>{student.student_id}</td>
                      <td className={`font-semibold text-blue-600`}>
                        {student.course}
                      </td>
                      <td className={`font-semibold ${student.section === 'not set' ? 'text-gray-400' : 'text-blue-600'}`}>
                        {student.section}
                      </td>
                      <td className={`font-semibold ${student.status === "active" ? "text-green-600" : "text-gray-400"}`}>{student.status}</td>
                      <td>
                        <Dialog>
                          <DialogTrigger onClick={() => setEmail(student.email)}>
                              <RotateCcw className="text-blue-700 transition-transform hover:scale-[1.05] hover:text-blue-900"/>
                          </DialogTrigger>

                          <MemberRestoreModal 
                            restoreOnSubmit={(reason: string) => handleRestore(reason)}
                            submitted={submitted}
                          />
                        </Dialog>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}


