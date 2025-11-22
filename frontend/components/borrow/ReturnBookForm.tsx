"use client";

import React, { useState } from 'react';
import { Calendar, BookOpen, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import MemberSearch from '@/components/members/MemberSearch';
import BookSearch from '@/components/books/BookSearch';
import { useBorrow } from '@/hooks/useBorrow';
import { ReturnBookRequest } from '@/types/borrow';
import { borrowApi } from '@/lib/api';

interface StudentType {
  id: number;
  name: string;
  studentId: string;
  email: string;
}

interface BookType {
  id: number;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
}

interface ReturnBookFormProps {
  onSuccess?: () => void;
}

export default function ReturnBookForm({ onSuccess }: ReturnBookFormProps) {
  const { returnBook, loading, error, clearError } = useBorrow();

  const [selectedMember, setSelectedMember] = useState<StudentType | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [returnDate, setReturnDate] = useState('');
  const [borrowId, setBorrowId] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  // Set default return date to today
  const getDefaultReturnDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Find borrow record when member and book are selected
  React.useEffect(() => {
    if (selectedMember && selectedBook) {
      // Find the borrow record for this member and book
      const findBorrowRecord = async () => {
        try {
          const records = await borrowApi.getBorrowRecords();
          const record = records.find((r: any) =>
            r.memberId === selectedMember.id &&
            r.bookId === selectedBook.id &&
            r.status === 'borrowed'
          );
          if (record) {
            setBorrowId(record.id);
          } else {
            setBorrowId(null);
          }
        } catch (error) {
          console.error('Error finding borrow record:', error);
          setBorrowId(null);
        }
      };
      findBorrowRecord();
    } else {
      setBorrowId(null);
    }
  }, [selectedMember, selectedBook]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!borrowId || !returnDate) {
      return;
    }

    const returnData: ReturnBookRequest = {
      borrowId,
      returnDate,
    };

    const result = await returnBook(returnData);

    if (result) {
      setSuccess(true);
      setSelectedMember(null);
      setSelectedBook(null);
      setReturnDate('');
      setBorrowId(null);
      onSuccess?.();

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  const isFormValid = selectedMember && selectedBook && returnDate && borrowId;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Return Book</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
          <button
            onClick={clearError}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-700">Book returned successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 md:gap-6">
          {/* Member Selection */}
          <div className="flex flex-col gap-2">
            <MemberSearch
              onMemberSelect={setSelectedMember}
              selectedMember={selectedMember}
            />
          </div>

          {/* Book Selection */}
          <div className="flex flex-col gap-2">
            <BookSearch
              onBookSelect={setSelectedBook}
              selectedBook={selectedBook}
            />
          </div>

          {/* Return Date */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
              Return Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="returnDate"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                max={getDefaultReturnDate()}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Date when the book is being returned
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-10">
          <Button
            type="submit"
            disabled={!isFormValid || loading}
            className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Returning Book...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Return Book
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Summary */}
      {selectedMember && selectedBook && returnDate && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Return Summary</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>Member:</strong> {selectedMember.name} ({selectedMember.studentId})</div>
            <div><strong>Book:</strong> {selectedBook.title} by {selectedBook.author}</div>
            <div><strong>Return Date:</strong> {new Date(returnDate).toLocaleDateString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
