"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ChevronRight, Search, PanelRightClose, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMembers } from "@/hooks/useMembers";
import Link from "next/link";

export default function MembersPage() {
  const [openSideBar, setOpenSideBar] = React.useState(true);
  const { members, loading, error } = useMembers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Filter members based on search
  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            <Link href="/members/add">
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add Member
              </Button>
            </Link>

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
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-md text-gray-700 font-bold">All Members</h1>
            <span className="text-sm text-gray-500">{filteredMembers.length} members</span>
          </div>

          <div className="w-full overflow-hidden rounded-lg border flex-1 flex flex-col">
            <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-3 bg-gray-100 border-b text-sm font-semibold text-gray-700">
              <div>Profile</div>
              <div>Name</div>
              <div>Student ID</div>
              <div>Email</div>
            </div>

            <div className="divide-y flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-gray-500">Loading members...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8">
                  <span className="text-red-500">{error}</span>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <span className="text-gray-500">No members found</span>
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-4 py-3 hover:bg-gray-50 transition-all text-sm items-center"
                  >
                    <div className="flex md:block justify-start md:text-center">
                      <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-medium text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="font-medium">{member.name}</div>
                    <div className="text-blue-600 font-semibold">{member.studentId}</div>
                    <div className="text-gray-600">{member.email}</div>
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
