'use client';

import { useState, useEffect } from 'react';
import { Book, Users, Clock } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

// ✅ Define type for your recent records
interface BorrowRecord {
  id: number;
  studentName: string;
  bookTitle: string;
  dateIssued: string;
  dueDate: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    borrowedBooks: 0,
  });

  // ✅ Explicitly type your useState array
  const [recentRecords, setRecentRecords] = useState<BorrowRecord[]>([]);

  useEffect(() => {
    setStats({
      totalBooks: 4,
      totalMembers: 3,
      borrowedBooks: 2,
    });

    // ✅ Now TypeScript knows the array’s shape
    setRecentRecords([
      {
        id: 1,
        studentName: 'Juan Dela Cruz',
        bookTitle: 'Introduction to Computer Science',
        dateIssued: '2024-10-15',
        dueDate: '2024-10-29',
      },
      {
        id: 2,
        studentName: 'Maria Santos',
        bookTitle: 'Database Management Systems',
        dateIssued: '2024-10-16',
        dueDate: '2024-10-30',
      },
    ]);
  }, []);
}
