"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-gray-200"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Image
            src="/cpc logo.png"
            alt="Cordova Public College Logo"
            width={110}
            height={110}
            className="rounded-full shadow-md"
            priority
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 text-center"
        >
          Cordova Public College
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-gray-600 text-center mb-8"
        >
          Library Management System
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="w-full flex flex-col gap-4"
        >
          <button
            onClick={() => router.push("/students/auth/login")}
            className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold 
                       shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/students/auth/register")}
            className="w-full px-6 py-3 rounded-xl border border-indigo-500 
                       text-indigo-600 bg-white font-semibold shadow-md 
                       hover:bg-gray-50 hover:shadow-lg transition-all"
          >
            Sign Up
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
