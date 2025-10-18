'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    schoolId: '',
    password: '',
    rememberMe: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    router.push('/dashboard');
  };

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
                width={80}
                height={80}
                className="rounded-full object-contain"
                priority
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">Cordova Public College</h1>
          <p className="text-gray-600 mt-2">Your Digital Gateway to Learning</p>
        </div>

        {/* === Login Form === */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* School ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School ID</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.schoolId}
                onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                placeholder="Enter your School ID"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="mr-2"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-gray-600">Don’t have an account? </span>
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
