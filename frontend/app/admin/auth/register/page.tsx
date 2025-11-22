'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Lock, BookOpen } from 'lucide-react';
import { useAdmin } from '@/app/context/AdminContext';
import {AlertModal} from '@/components/alert';
import { ButtonSubmit } from '@/components/button';


export default function SignUpPageAdmin() {
  const router = useRouter();
  const { setAdminData } = useAdmin();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');
  const [alertMessage, setAlertMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      setSubmitted(false);
      return;
    }

    try {
      const result = await api.post('/api/admins/register/request', {email});

      if (result.data.success) {
        alert(result.data.message || 'Registration successful! Please check your email for OTP.');

        setAdminData({ 
          name: name,
          email: email,
          password: password,
          schoolId: ''
        });
        
        router.push('/admin/auth/register/verify-otp');
      } else {
        setSubmitted(false);
        alert(result.data.message || 'Registration failed.')
      }
    } catch (error: any) {
      setSubmitted(false);
      alert(error.response?.data?.message || 'Network error. Please try again.')
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/cpc logo.png"
              alt="CPC Logo"
              width={70}
              height={70}
              className="rounded-full shadow-md object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Cordova Public College</h1>
          <p className="text-gray-600 mt-2 text-sm">Create your CPC eLibrary account as admin</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                // required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <ButtonSubmit props={{
            submitted: submitted,
            buttonType: 'submit',
            className: 'text-md w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors',
            btnText: 'Register',
            btnLoadingText: 'Registiring',
          }} />

          {/* Already have an account */}
          <div className="text-center">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
