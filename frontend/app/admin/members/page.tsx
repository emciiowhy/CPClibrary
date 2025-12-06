"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/admin/SidebarAdmin";
import Header from "@/components/layout/admin/HeaderAdmin";
import { Search, PanelRightClose, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MemberMoreInfoMenu from "@/components/members/MemberMoreInfoModal";
import StockProfile from "@/public/StockProfile.jpg"

interface StudentType {
  id: number;
  name: string;
  email: string;
  student_id: string;
  status: string;
  section: string;
  course: string;
  profile_url: string;
  penalty: number;
}

export default function MembersPage() {
  const [openSideBar, setOpenSideBar] = React.useState(true);

  const [recentRegisteredStudents, setRecentRegisteredStudents] = React.useState<StudentType[]>([]);
  const [recentLimit, setRecentLimit] = useState(3);
  const [students, setStudents] = React.useState<StudentType[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [deleteModalOpen, setDeleteModal] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchStudentStatus, setSearchStudentStatus] = useState('');

  useEffect(() => {
    const getStudents = async () => {
      try {
        const response = await api.get('/api/students');

        setStudents(response.data);
        console.log(students);
      } catch (error) {
        toast.error("Error getting students");
        console.log("Error getting students member page " + error);
        return;
      }
    }

    getStudents();
  }, [])

  const handleDeact = async (email: string) => {
    try {
      const status = 'inactive';
      const result = await api.post('/api/admins/change-status', {status, email});
      toast.success(result.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      toast.error(error);
      console.log(error);
    }
  }

  const handleActivate = async (email: string) => {
    try {
      const status = 'active';
      const result = await api.post('/api/admins/change-status', {status, email});
      toast.success(result.data.message);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response.data.message || "Error");
      console.log(error);
    }
  }

  const handleDelete = async (email: string, reason: string) => {
    try {
      const result = await api.post('/api/admins/delete-student', {reason, email});

      toast.success(result.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response.message || "Error");
      console.log(error);
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
                        student.student_id.toLowerCase().includes(searchStudent.toLowerCase());

    const matchesCourseCategory = searchCategory === "" || student.course === searchCategory;
    const matchesStudentStatus = searchStudentStatus === "" || student.status === searchStudentStatus;

    return matchesSearch && matchesStudentStatus && matchesCourseCategory;
  })

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
          <h1 className="text-2xl font-bold">Registered Students</h1>
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
                Student Status
              </label>
              <select
                name="course_category"
                id="course_category"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm min-w-[140px] cursor-pointer hover:bg-gray-100"
                value={searchStudentStatus}
                onChange={(e) => setSearchStudentStatus(e.target.value)}
              >
                <option value="" className="text-gray-500">
                  All Statuses
                </option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <label
                htmlFor="course_category"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Course
              </label>
              <select
                name="course_category"
                id="course_category"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm min-w-[140px] cursor-pointer hover:bg-gray-100"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="" className="text-gray-500">
                  All Courses
                </option>
                <option value="BSIT">BSIT</option>
                <option value="BSED">BSED</option>
                <option value="BEED">BEED</option>
                <option value="BSHM">BSHM</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex-1 flex flex-col">
          <h1 className="text-md text-gray-700 font-bold my-3">
            Recent Registered
          </h1>

          <div className="w-full overflow-hidden rounded-lg border flex-1 flex flex-col">
            <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-3 bg-gray-100 border-b text-sm font-semibold text-gray-700">
              <div>Profile</div>
              <div>Name</div>
              <div>School ID</div>
              <div>Course</div>
              <div>Section</div>
              <div>Status</div>
              <div>Fines</div>
            </div>

            <table>
              <tbody className="divide-y">
                {filteredStudents
                  .slice(0, recentLimit)
                .map((student) => (
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
                      <td className="font-semibold text-gray-800">{student.name}</td>
                      <td className="font-semibold text-gray-800">{student.student_id}</td>
                      <td className="font-semibold text-blue-600">
                        {student.course}
                      </td>
                      <td className={`font-semibold ${student.section === 'not set' ? 'text-gray-400' : 'text-blue-600'}`}>
                        {student.section}
                      </td>
                      <td className={`font-semibold ${student.status === "active" ? "text-green-600" : "text-gray-400"}`}>{student.status}</td>
                      <td className={`font-semibold ${student.penalty > 0 ? "text-red-600" : "text-gray-400"}`}>{student.penalty > 0 ? "₱" + student.penalty : "none"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex-1 flex flex-col">
          <h1 className="text-md text-gray-700 font-bold my-3">
            All Registered Students
          </h1>

          <div className="w-full overflow-hidden rounded-lg border flex-1 flex flex-col">
            <div className="hidden md:grid grid-cols-8 gap-4 px-4 py-3 bg-gray-100 border-b text-sm font-semibold text-gray-700">
              <div>Profile</div>
              <div>Name</div>
              <div>School ID</div>
              <div>Course</div>
              <div>Section</div>
              <div>Status</div>
              <div>Penalty</div>
              <div>More</div>
            </div>

            <table>
              <tbody className="divide-y">
                {filteredStudents.map((student, i) => (
                    <tr
                      key={student.id}
                      className="grid grid-cols-1 sm:grid-cols-8 gap-4 px-4 py-3 hover:bg-gray-50 transition-all text-sm items-center"
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
                      <td className="font-semibold text-gray-800">{student.name}</td>
                      <td className="font-semibold text-gray-800">{student.student_id}</td>
                      <td className={`font-semibold text-blue-600`}>
                        {student.course}
                      </td>
                      <td className={`font-semibold ${student.section === 'not set' ? 'text-gray-400' : 'text-blue-600'}`}>
                        {student.section}
                      </td>
                      <td className={`font-semibold ${student.status === "active" ? "text-green-600" : "text-gray-400"}`}>{student.status}</td>
                      <td className={`font-semibold ${student.penalty ? "text-red-600" : "text-gray-400"}`}>{student.penalty > 0 ? "₱" + student.penalty : "none"}</td>
                      <td>
                        <MemberMoreInfoMenu 
                          submitted={submitted}
                          studentStatus={student.status}
                          deacOnClick={() => handleDeact(student.email)}
                          activateOnClick={() => handleActivate(student.email)}
                          deleteOnClick={(reason: string) => handleDelete(student.email, reason)}
                        />
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


