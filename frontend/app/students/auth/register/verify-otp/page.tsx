// frontend/app/students/auth/register/verify-otp/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock } from "lucide-react";
import api from "@/lib/api";
import { useStudent } from "@/app/context/StudentContext";
import { ButtonSubmit } from "@/components/button";
import { toast } from "sonner";

export default function VerifyOtpPageStudent() {
  const router = useRouter();
  const { student, clearStudentData } = useStudent();

  const [otp, setOtp] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);

    // Check if admin registration data exists
    if (!student?.email || !student?.name || !student?.password) {
      toast.error("Missing registration data. Redirecting to registration page...");
      setSubmitted(false);
      router.push("/admin/auth/register");
      return;
    }

    const { email, name, password, schoolId } = student;

    try {
      // Step 1: Verify OTP
      const verifyResponse = await api.post("/api/students/register/verify-otp", { email, otp, schoolId });

      // Axios treats status >= 400 as error, so this only runs for 2xx
      if (!verifyResponse.data.success) {
        toast.error("OTP verification failed: " + (verifyResponse.data.message || "Please try again."));
        setSubmitted(false);
        return;
      }

      // Step 2: Final registration
      const finalResponse = await api.post("/api/students/register/final-register", { name, email, password, schoolId });

      if (finalResponse.data.success) {
        toast.success("Registration successful! Redirecting to login...");
        clearStudentData();
        router.push("/students/auth/login");
      } else {
        toast.error("Final registration failed: " + (finalResponse.data.message || "Please try again."));
        setSubmitted(false);
      }
    } catch (error: any) {
      // Axios error handling
      toast.warning(error.response?.data?.message || error.message || "Network error. Please try again.");
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-2 rounded-full shadow-md">
              <Image
                src="/cpc logo.png"
                alt="Cordova Public College Logo"
                width={70}
                height={70}
                className="rounded-full object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Verify OTP</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Enter the OTP sent to your email
          </p>
        </div>

        {/* OTP Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              One Time Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="number"
                placeholder="000000"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          <ButtonSubmit
            props={{
              submitted,
              buttonType: "submit",
              className:
                "text-md w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors",
              btnText: "Verify",
              btnLoadingText: "Verifying",
            }}
          />
        </form>
      </div>
    </div>
  );
}
