'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Lock } from 'lucide-react';
import { ButtonSubmit } from '@/components/button';
import { useStudent } from '@/app/context/StudentContext';
import api from '@/lib/api';
import { ToastContainer, toast } from 'react-toastify';

export default function LoginPage() {
  const router = useRouter();

  const [schoolId, setSchoolId] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { setStudentData} = useStudent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);
    try {
      const response = await api.post('/api/students/login', {schoolId, password});
      if (response.data.success) {
        setStudentData({
          name: response.data.student.name,
          schoolId: schoolId,
          email: response.data.student.name,
          password: response.data.student.password
        });

        toast.success('Login successfully! Redirecting to dashboard!');
        router.push('/students/dashboard');
      }

    } catch(error: any) {
      toast.error(error.response?.data?.message || error.message || "Network error. Please try again.");
      setSubmitted(false);
      return;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <ToastContainer position='top-center'/>
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

          <h1 className="text-2xl font-bold text-gray-800">Cordova Public College</h1>
          <p className="text-gray-600 mt-2 text-sm">Your Digital Gateway to Learning</p>
        </div>

        {/* === Login Form === */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* School ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School ID</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                inputMode='numeric'
                pattern="\d{1,8}"
                placeholder="Enter your School ID"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                maxLength={8}
                minLength={1}
                value={schoolId}
                onChange={(e) => {setSchoolId(e.target.value)}}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <a onClick={() => router.push('/students/auth/forgot-password')} className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <ButtonSubmit
            props={{
              submitted,
              buttonType: "submit",
              className:
                "text-md w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors",
              btnText: "Login",
              btnLoadingText: "Logging in",
            }}
          />

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-gray-600 text-sm">Don’t have an account? </span>
            <button
              type="button"
              onClick={() => router.push('/students/auth/register')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
