"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Mail } from "lucide-react";
import AlertModal from "@/components/alert";
import api from "@/lib/api";

export default function ForgotPasswordAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [disableOtpRequest, setDisableOtpRequest] = useState(false);

  const otpRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/admins/forgot-password", { email });
      if (response.data.success) {
        alert("OTP sent to your email.");
        setDisableOtpRequest(true);

        setTimeout(() => {
          setDisableOtpRequest(false);
        }, 300000);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (newPassword !== confirmNewPassword) {
        alert("Passwords do not match.");
        return;
      }

      const password = newPassword;

      const response = await api.post("/api/admins/reset-password", {
        email,
        otp,
        password,
      });
      alert("here" + response.data.message);

      if (response.data.success) {
        alert("Password reset successful. Redirecting to login...");
        router.push("/admin/auth/login");
      } else {
        alert("Password reset failed.");
      }
    } catch (error) {
      alert("An error occurred during password reset.");
      console.error("Error during password reset submission:", error);
    }
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          {/* === Logo Section === */}
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

            <h1 className="text-2xl font-bold text-gray-800">
              Cordova Public College
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Your Digital Gateway to Learning
            </p>
          </div>

          {/* === Login Form === */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* School ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  One Time Password
                </label>
                <button
                  type="button"
                  className={`block text-sm font-medium ${
                    disableOtpRequest
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-700 mb-2 hover:text-blue-500"
                  }`}
                  onClick={(e) => otpRequest(e)}
                  disabled={disableOtpRequest}
                >
                  Request Otp
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Enter OTP code"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    );
  };
