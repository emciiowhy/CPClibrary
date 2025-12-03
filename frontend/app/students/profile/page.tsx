"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PanelRightClose, Lock, X, Check } from "lucide-react";
import Sidebar from "@/components/layout/students/SidebarStudent";
import Header from "@/components/layout/students/HeaderStudent";
import api from "@/lib/api";
import { toast } from "sonner";
import StockProfile from "@/public/StockProfile.jpg";
import { ButtonSubmit } from "@/components/button";

interface StudentType {
  name: string;
  email: string;
  student_id: string;
  course: string;
  section: string;
  profile_url: string;
}

export default function StudentProfile() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentType>({
    name: "",
    email: "",
    student_id: "",
    course: "",
    section: "",
    profile_url: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [openSideBar, setOpenSideBar] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  //authentication access
  useEffect(() => {
    const verifyStudent = async () => {
      try {
        const result = await api.get('api/students/verify-student');
        if (!result.data.success) {
          toast.error("Login First");
          router.push('/students/auth/login');
        }

      } catch (error: any) {
        toast.error(error.response.data.message);
        console.log(error);
        router.push('/students/auth/login');
        return;
      }
    };

    verifyStudent();
  }, []);

  useEffect(() => {
    const getStudent = async () => {
      try {
        const result = await api.get("/api/students/find");
        setStudent(result.data.student);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch student");
      }
    };
    getStudent();
  }, []);

  const handleEditProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", student.name);
      formData.append("email", student.email);
      formData.append("course", student.course);
      formData.append("section", student.section);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const result = await api.post("/api/students/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(result.data.message);
      console.log(result.data.student);
      setConfirm(!confirm);
    } catch (error: any) {
      toast.error(error.response.message + "error");
      setSubmitted(false);
      console.log(error);
      return;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-100">
      <Header />
      {openSideBar && (
        <Sidebar onClickBtnOpenSideBar={() => setOpenSideBar(!openSideBar)} />
      )}

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-900">
            Student Profile
          </h1>
          {!openSideBar && (
            <PanelRightClose
              className="w-6 h-6 text-indigo-700 cursor-pointer hidden md:block"
              onClick={() => setOpenSideBar(!openSideBar)}
            />
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Profile Image */}
          <div className="flex-shrink-0 relative">
            <input
              type="file"
              accept="image/*"
              id="profileUploader"
              className="hidden"
              onChange={(e) =>
                setProfileImage(
                  (e.target as HTMLInputElement).files?.[0] || null
                )
              }
            />

            {/* Clickable Image */}
            <img
              alt="Student Profile"
              src={
                profileImage
                  ? URL.createObjectURL(profileImage) // preview new upload
                  : student.profile_url || StockProfile.src // use DB image or fallback
              }
              className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 object-cover
              ${
                confirm ? "cursor-pointer border-indigo-800" : "border-gray-400"
              }
            `}
              onClick={() =>
                confirm && document.getElementById("profileUploader")?.click()
              }
            />

            {confirm && (
              <p className="text-xs text-indigo-600 mt-1 text-center">
                Click image to change
              </p>
            )}
          </div>

          {/* Student Info */}
          <div className="flex-1 w-full flex flex-col gap-4">
            {[
              { key: "name", label: "Name", value: student.name },
              {
                key: "student_id",
                label: "Student ID",
                value: student.student_id,
              },
              { key: "email", label: "Email", value: student.email },
              { key: "course", label: "Course", value: student.course },
              { key: "section", label: "Section", value: student.section },
            ].map((field) => (
              <div
                key={field.label}
                className="flex flex-col md:flex-row md:items-center gap-2"
              >
                <label className="font-semibold text-indigo-800 min-w-[100px]">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value}
                  disabled={!confirm}
                  onChange={(e) =>
                    setStudent((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className={`flex-1 px-3 py-2 rounded-lg focus:outline-none
                    ${
                      confirm
                        ? "bg-white border-inigo-300 focus:ring-2 focus:ring-indigo-400"
                        : "bg-gray-100 border-indigo-200 text-gray-600 cursor-not-allowed"
                    }
                  `}
                />
              </div>
            ))}

            {/* Change Password Button */}
            <div className={`flex flex-row gap-4`}>
              <button
                className="mt-4 w-fit flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                onClick={() => router.push("/students/change-password")}
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
              {confirm && (
                <button
                  className="mt-4 w-fit flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  onClick={() => {
                    setConfirm(false);
                  }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
              {confirm ? (
                <button
                  className="mt-4 w-fit flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                  onClick={() => {
                    setConfirm(true);
                    handleEditProfile();
                  }}
                >
                  <Check className="w-4 h-4" />
                  Confirm
                </button>
              ) : (
                <button
                  className="mt-4 w-fit flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
                  onClick={() => {
                    setConfirm(true);
                  }}
                >
                  <Lock className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}