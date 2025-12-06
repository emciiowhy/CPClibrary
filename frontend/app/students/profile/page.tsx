"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PanelRightClose, Lock, X, Check, Edit } from "lucide-react";
import Sidebar from "@/components/layout/students/SidebarStudent";
import Header from "@/components/layout/students/HeaderStudent";
import api from "@/lib/api";
import { toast } from "sonner";
import StockProfile from "@/public/StockProfile.jpg";

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

    // Authentication access
    useEffect(() => {
        const verifyStudent = async () => {
            try {
                const result = await api.get('api/students/verify-student');
                if (!result.data.success) {
                    toast.error("Login First");
                    router.push('/students/auth/login');
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Authentication failed");
                console.log(error);
                router.push('/students/auth/login');
            }
        };

        verifyStudent();
    }, [router]);

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
        setSubmitted(true);
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
            setStudent(result.data.student); // Update with fresh data from server
            setConfirm(false); // Exit edit mode
            setProfileImage(null); // Clear preview
            setSubmitted(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Update failed");
            setSubmitted(false);
            console.log(error);
        }
    };

    const handleCancel = () => {
        setConfirm(false);
        setProfileImage(null);
        // Reset to original values by refetching
        const getStudent = async () => {
            try {
                const result = await api.get("/api/students/find");
                setStudent(result.data.student);
            } catch (error: any) {
                toast.error("Failed to reset data");
            }
        };
        getStudent();
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
                        <label htmlFor="profileUploader" className="sr-only">
                            Upload Profile Picture
                        </label>
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
                            disabled={!confirm}
                        />

                        {/* Clickable Image */}
                        <img
                            alt="Student Profile"
                            src={
                                profileImage
                                    ? URL.createObjectURL(profileImage)
                                    : student.profile_url || StockProfile.src
                            }
                            className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 object-cover
                ${confirm ? "cursor-pointer border-indigo-800" : "border-gray-400"}
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
                            { key: "name", label: "Name", value: student.name, editable: true },
                            { key: "student_id", label: "Student ID", value: student.student_id, editable: false },
                            { key: "email", label: "Email", value: student.email, editable: true },
                            { key: "course", label: "Course", value: student.course, editable: true },
                            { key: "section", label: "Section", value: student.section, editable: true },
                        ].map((field) => (
                            <div
                                key={field.label}
                                className="flex flex-col md:flex-row md:items-center gap-2"
                            >
                                <label
                                    htmlFor={`input-${field.key}`}
                                    className="font-semibold text-indigo-800 min-w-[100px]"
                                >
                                    {field.label}
                                </label>
                                <input
                                    id={`input-${field.key}`}
                                    type="text"
                                    value={field.value}
                                    disabled={!confirm || !field.editable}
                                    onChange={(e) =>
                                        field.editable && setStudent((prev) => ({
                                            ...prev,
                                            [field.key]: e.target.value,
                                        }))
                                    }
                                    className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none
                    ${confirm && field.editable
                                            ? "bg-white border-indigo-300 focus:ring-2 focus:ring-indigo-400"
                                            : "bg-gray-100 border-indigo-200 text-gray-600 cursor-not-allowed"
                                        }
                  `}
                                />
                            </div>
                        ))}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            {/* Change Password - Always visible */}
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                                onClick={() => router.push("/students/change-password")}
                            >
                                <Lock className="w-4 h-4" />
                                Change Password
                            </button>

                            {/* Edit/Confirm/Cancel buttons */}
                            {!confirm ? (
                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
                                    onClick={() => setConfirm(true)}
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleEditProfile}
                                        disabled={submitted}
                                    >
                                        <Check className="w-4 h-4" />
                                        {submitted ? "Saving..." : "Confirm"}
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                        onClick={handleCancel}
                                        disabled={submitted}
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}