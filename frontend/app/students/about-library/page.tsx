"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PanelRightClose } from "lucide-react";
import Sidebar from "@/components/layout/students/SidebarStudent";
import Header from "@/components/layout/students/HeaderStudent";
import api from "@/lib/api";
import { toast } from "sonner";

export default function StudentProfile() {
  const router = useRouter();
  const [openSideBar, setOpenSideBar] = useState(true);

  useEffect(() => {
    const verifyStudent = async () => {
      try {
        const result = await api.get("api/students/verify-student");
        if (!result.data.success) {
          toast.error("Login First");
          router.push("/students/auth/login");
        }
      } catch (error) {
        toast.error("Session expired. Please log in again.");
        router.push("/students/auth/login");
      }
    };
    verifyStudent();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50 text-gray-900">
      <Header />

      {openSideBar && (
        <Sidebar onClickBtnOpenSideBar={() => setOpenSideBar(!openSideBar)} />
      )}

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-indigo-900">Student Profile</h1>
          {!openSideBar && (
            <PanelRightClose
              className="w-6 h-6 text-indigo-700 cursor-pointer hidden md:block"
              onClick={() => setOpenSideBar(!openSideBar)}
            />
          )}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          {/* About the Library */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-2 text-indigo-900">About the Library</h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
              The Cordova Public College Library provides students and faculty with curated learning
              materials, digital resources, and quiet spaces that support academic success and
              lifelong learning.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <h3 className="text-sm font-medium text-gray-700">Location</h3>
                <p className="text-sm mt-1 text-gray-600">
                  Cordova Public College - Main Campus
                </p>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <h3 className="text-sm font-medium text-gray-700">Opening Hours</h3>
                <p className="text-sm mt-1 text-gray-600">Mon - Fri: 8:00 AM - 6:00 PM</p>
                <p className="text-sm text-gray-600">Sat: 8:00 AM - 12:00 NN • Sun: Closed</p>
              </div>
            </div>
          </section>

          {/* Rules */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-indigo-900">Library Rules</h2>
            <ul className="space-y-2 text-sm text-gray-700 max-w-3xl list-disc list-inside">
              <li>Maintain silence in study areas and speak softly in group spaces.</li>
              <li>Food and drinks are restricted near computers; water in covered bottles only.</li>
              <li>Borrowing requires a valid student ID. Follow loan periods strictly.</li>
              <li>Show the generated QR code of borrowed books along with your student ID when borrowing from the website.</li>
              <li>Return books on time to avoid fines or borrowing suspension.</li>
              <li>Handle books and equipment with care; report damages immediately.</li>
              <li>Respect computer-use policies and avoid accessing restricted sites.</li>
              <li>Keep mobile phones on silent; take calls outside study areas.</li>
              <li>Failure to follow rules repeatedly may result in account deactivation or deletion.</li>
              <li>Exceeding the due date for returning borrowed books may result in penalties being applied to your account.</li>
            </ul>
            <p className="mt-4 text-xs text-gray-500">Visit the circulation desk for complete guidelines.</p>
          </section>

          {/* Librarian */}
          <section className="mb-12 grid sm:grid-cols-3 gap-6 items-start">
            <div className="sm:col-span-2">
              <h2 className="text-xl font-semibold mb-2 text-indigo-900">Librarian</h2>
              <div className="p-4 rounded-xl border border-gray-200 bg-white flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg">
                  LR
                </div>
                <div>
                  <p className="font-medium text-gray-800">Ms. Beverly Cañete</p>
                  <p className="text-sm text-gray-600">Head Librarian</p>
                  <p className="text-sm mt-1 text-gray-600">Email: beverly.canete@cordova.edu.ph</p>
                  <p className="text-sm text-gray-600">Ext: 123 • Office: Library 2nd Floor</p>
                </div>
              </div>
            </div>

            <aside className="p-4 rounded-xl border border-gray-200 bg-white">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Services</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Reference assistance</li>
                <li>Interlibrary loan</li>
                <li>Study room reservations</li>
                <li>Computer & printing services</li>
              </ul>
            </aside>
          </section>

          <footer className="text-center py-4 text-xs text-gray-500">
            © {new Date().getFullYear()} Cordova Public College Library • For the Learning Community
          </footer>
        </div>
      </main>
    </div>
  );
}
