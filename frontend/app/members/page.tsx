"use client";
import React, { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ChevronRight, Search } from "lucide-react";

interface StudentType {
  id: number;
  name: string;
  schoolId: string;
  course: string;
  section: string;
}

export default function MembersPage() {
  const [openSideBar, setOpenSideBar] = React.useState(true);

  const [recentRegisteredStudents, setRecentRegisteredStudents] =
    React.useState<StudentType[]>([]);

  useEffect(() => {
    setRecentRegisteredStudents([
      {
        id: 1,
        name: "Jerson Jay C. Bonghanoy",
        schoolId: "2021001",
        course: "BSIT",
        section: "A",
      },
      {
        id: 2,
        name: "Goku Son Gohan",
        schoolId: "2021002",
        course: "BEED",
        section: "B",
      },
      {
        id: 3,
        name: "Naruto Uzumaki",
        schoolId: "2021003",
        course: "BSHM",
        section: "A",
      },
      {
        id: 4,
        name: "Ninja Picollo",
        schoolId: "2021004",
        course: "BSIT",
        section: "A",
      },
    ]);
  }, []);

  return (
    <div className="flex-col md:flex-row flex h-screen overflow-hidden">
      <Header />
      {openSideBar && (
        <Sidebar onClickBtnOpenSideBar={() => setOpenSideBar(!openSideBar)} />
      )}

      <main className="flex-1 flex flex-col p-6 bg-gray-100 overflow-y-auto gap-4 h-screen">
        <div className="flex justify-center items-center flex-row w-fit gap-3 mb-6">
          {!openSideBar && (
            <ChevronRight
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
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
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
              >
                <option value="" className="text-gray-500">
                  Choose
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
            <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 bg-gray-100 border-b text-sm font-semibold text-gray-700">
              <div>Profile</div>
              <div>Name</div>
              <div>School ID</div>
              <div>Course</div>
              <div>Section</div>
            </div>

            <div className="divide-y">
              {recentRegisteredStudents
                .slice(0, recentRegisteredStudents.length)
                .map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-3 hover:bg-gray-50 transition-all text-sm items-center"
                  >
                    <div className="flex md:block justify-start md:text-center">
                      <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-medium text-gray-700">
                        {student.name.charAt(0)}
                      </div>
                    </div>

                    <div>{student.name}</div>
                    <div>{student.schoolId}</div>
                    <div className="font-semibold text-blue-600">
                      {student.course}
                    </div>
                    <div>{student.section}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex-1 flex flex-col">
          <h1 className="text-md text-gray-700 font-bold my-3">
            Previously Registered Students
          </h1>

          <div className="w-full overflow-hidden rounded-lg border flex-1 flex flex-col">
            <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 bg-gray-100 border-b text-sm font-semibold text-gray-700">
              <div>Profile</div>
              <div>Name</div>
              <div>School ID</div>
              <div>Course</div>
              <div>Section</div>
            </div>

            <div className="divide-y h-full overflow-y-auto">
              {recentRegisteredStudents
                .slice(0, recentRegisteredStudents.length)
                .map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-3 hover:bg-gray-50 transition-all text-sm items-center"
                  >
                    <div className="flex md:block justify-start md:text-center">
                      <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-medium text-gray-700">
                        {student.name.charAt(0)}
                      </div>
                    </div>

                    <div>{student.name}</div>
                    <div>{student.schoolId}</div>
                    <div className="font-semibold text-blue-600">
                      {student.course}
                    </div>
                    <div>{student.section}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
