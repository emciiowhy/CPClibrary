"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

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
        {/* === Logo Section === */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <Image
              src="/cpc logo.png"
              alt="Cordova Public College Logo"
              width={120}
              height={120}
              className="rounded-full object-contain"
              priority
            />
          </div>
        </div>

        {/* === Title & Tagline === */}
        <h1 className="text-5xl font-extrabold text-gray-800 mb-3">
          Cordova Public College
        </h1>
        <p className="text-lg text-gray-600 mb-10 tracking-wide">
          Library System Management
        </p>

        {/* === Buttons === */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/students/auth/login")}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/students/auth/register")}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-indigo-600 shadow-md hover:shadow-lg"
          >
            Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
}