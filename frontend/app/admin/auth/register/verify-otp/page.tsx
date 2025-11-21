'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import api from '@/lib/api';
import { useAdmin } from '@/app/context/AdminContext';
import AlertModal from '@/components/alert';

export default function VerifyOtpPageAdmin() {
  const router = useRouter();
  const { admin, clearAdminData } = useAdmin();
  const [otp, setOtp] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if admin data exists
    if (!admin || !admin.email || !admin.name || !admin.password) {
      setAlertType('error');
      setAlertMessage('Missing registration data. Please start registration again.');
      setAlertOpen(true);
      
      setTimeout(() => {
        setAlertOpen(false);
        router.push('/admin/auth/register');
      }, 2000);
      return;
    }
    
    const { email, name, password } = admin;

    try {
      // Step 1: Verify OTP
      const result = await api.post('/api/admins/register/verify-otp', {email, otp});
      
      if (result.data.success) {
        // Step 2: Complete final registration
        const result2 = await api.post('/api/admins/register/final-register', {name, email, password});
        
        if (result2.data.success) {
          setAlertType('success');
          setAlertMessage('Registration successful! Redirecting to login...');
          setAlertOpen(true);
          
          
          // Clear admin data and navigate after showing message
          setTimeout(() => {
            router.push('/admin/auth/login');
            clearAdminData(); 
          }, 1500);

        } else {
          setAlertType('error');
          setAlertMessage(result2.data.message || 'Final registration failed.');
          setAlertOpen(true);
          setTimeout(() => {
            setAlertOpen(false);
          }, 3000);
        }
      } else {
        setAlertType('error');
        setAlertMessage(result.data.message || 'OTP verification failed.');
        setAlertOpen(true);
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
    } catch (error: any) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Network error. Please try again.');
      setAlertOpen(true);
      setTimeout(() => {
        setAlertOpen(false);
      }, 3000);
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

          <h1 className="text-2xl font-bold text-gray-800">Verify OTP</h1>
          <p className="text-gray-600 mt-2 text-sm">Enter OTP we sent to your email</p>
        </div>

        {/* === Login Form === */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">One Time Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="number"
                placeholder="00000000"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>

      <AlertModal 
        isOpen={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => {setAlertOpen(false);}}
      />
    </div>
  );
}
