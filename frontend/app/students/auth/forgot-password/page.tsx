"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Mail } from "lucide-react";
import { ButtonSubmit } from "@/components/button";
import api from "@/lib/api";
import { useStudent } from "@/app/context/StudentContext";
import { toast } from "sonner";

export default function ForgotPasswordStudent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [disableOtpRequest, setDisableOtpRequest] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [otpMessage, setOtpMessage] = useState("Request OTP");
  const [secondsLeft, setSecondsLeft] = useState(0);

  //authentication access
  useEffect(() => {
    const verifyStudent = async () => {
      try {
        const result = await api.get('api/check-token');
        if (result.data.decoded.role === "student") {
          toast.success(result.data.message);
          router.push('/students/dashboard');
        }

        if (result.data.decoded.role === "admin") {
          toast.success(result.data.message);
          router.push('/admin/dashboard');
        }

      } catch (error: any) {
        console.log(error);
        return;
      }
    };

    verifyStudent();
  }, []);

  useEffect(() => {
    if (!disableOtpRequest) return;
    if (secondsLeft <= 0) {
      setDisableOtpRequest(false);
      setOtpMessage("Request OTP");
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [disableOtpRequest, secondsLeft]);

  const formatTime = () => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const otpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/students/forgot-password", { email });
      if (response.data.success) {
        toast.success("OTP sent to your email.");
        setDisableOtpRequest(true);
        setOtpMessage("OTP sent");
        setSecondsLeft(300);
        setTimeout(() => {
          setDisableOtpRequest(false);
          setOtpMessage("Request OTP");
        }, 300000);
      }

    } catch (error: any) {
      console.error("Error during password reset:", error);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      setSubmitted(false);
      return;
    }
    
    try {
      const password = newPassword;
      const response = await api.post("/api/students/reset-password", {
        email,
        otp,
        password,
      });

      if (response.data.success) {
        toast.success("Password reset successful. Redirecting to login...");
        router.push("/students/auth/login");
      } else {
        toast.error("Password reset failed.");
        setSubmitted(false);
      }

    } catch (error: any) {
      setSubmitted(false);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.warning("Invalid OTP");
        console.error("Error during password reset submission:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
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

        <form className="space-y-4" onSubmit={handleSubmit}>
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
                {disableOtpRequest ? formatTime() : otpMessage}
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
                type="password"
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
                type="password"
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>

          <ButtonSubmit
            props={{
              submitted: submitted,
              buttonType: "submit",
              className:
                "text-md w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors",
              btnText: "Change Password",
              btnLoadingText: "Changing Password",
            }}
          />
        </form>
      </div>
    </div>
  );
}