'use client';

import { X } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export default function AlertModal({ isOpen, type = 'info', message, onClose }: AlertModalProps) {
  if (!isOpen) return null;

  let bgColor = 'bg-blue-100 text-blue-800';
  if (type === 'success') bgColor = 'bg-green-100 text-green-800';
  if (type === 'error') bgColor = 'bg-red-100 text-red-800';

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 ${bgColor} relative`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-sm sm:text-base">{message}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
