'use client';

import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center w-32 h-32 bg-indigo-600 rounded-full mb-8 shadow-lg">
          <BookOpen className="w-20 h-20 text-white" />
        </div>

        <h1 className="text-5xl font-extrabold text-gray-800 mb-3">
          Cordova Public College
        </h1>
        <p className="text-lg text-gray-600 mb-10 tracking-wide">
          Library Management System
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/login')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-indigo-600 shadow-md hover:shadow-lg"
          >
            Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
}
