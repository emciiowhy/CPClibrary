'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock } from 'lucide-react';
import api from '@/lib/api';
import { useAdmin } from '@/app/context/AdminContext';
import {AlertModal} from '@/components/alert';
import { ButtonSubmit } from '@/components/button';
import { button } from 'framer-motion/client';
import { ToastContainer, toast } from 'react-toastify';

export default function LoginPageAdmin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {admin, setAdminData, clearAdminData} = useAdmin();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitted(true);
      const result = await api.post('/api/admins/login', {email, password});
      if (result.data.success) {
        const name = result.data.admin.name;
        setAdminData({name: name, email: email});

        toast.success('Login successful! Redirecting to dashboard...');
        router.push('/admin/dashboard');
      }

    } catch (error: any) {
      setSubmitted(false);
      toast.error(error.response.data.message || 'Login failed. Please try again.');
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
          <p className="text-gray-600 mt-2 text-sm">Login as admin</p>
        </div>

        {/* === Login Form === */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* School ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
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
            <a onClick={() => router.push('/admin/auth/forgot-password')} className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <ButtonSubmit props={{
            submitted: submitted,
            buttonType: 'submit',
            className: 'text-md w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors',
            btnText: 'Login',
            btnLoadingText: 'Logging in',
          }} />

          

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-gray-600 text-sm">Don’t have an account? </span>
            <button
              type="button"
              onClick={() => router.push('/admin/auth/register')}
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
