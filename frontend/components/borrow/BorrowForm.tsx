"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import MemberSearch from '@/components/members/MemberSearch';
import BookSearch from '@/components/books/BookSearch';
import { useBorrow } from '@/hooks/useBorrow';
import { IssueBookRequest, ReturnBookRequest } from '@/types/borrow';
import { issueBookSchema, returnBookSchema, IssueBookFormData, ReturnBookFormData } from '@/lib/validations';

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

interface BorrowFormProps {
  onSuccess?: () => void;
}

type Mode = 'issue' | 'return';

export default function BorrowForm({ onSuccess }: BorrowFormProps) {
  const { issueBook, returnBook, loading, error, clearError } = useBorrow();

  const [mode, setMode] = useState<Mode>('issue');
  const [selectedMember, setSelectedMember] = useState<StudentType | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [date, setDate] = useState('');
  const [borrowId, setBorrowId] = useState<number | null>(null);
  const [borrowRecords, setBorrowRecords] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch borrow records when member and book are selected for return
  useEffect(() => {
    if (mode === 'return' && selectedMember && selectedBook) {
      fetchBorrowRecordsForReturn();
    }
  }, [mode, selectedMember, selectedBook]);

  const fetchBorrowRecordsForReturn = async () => {
    if (!selectedMember || !selectedBook) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/borrow`);
      const records = await response.json();
      const matchingRecord = records.find((record: any) =>
        record.memberId === selectedMember.id &&
        record.bookId === selectedBook.id &&
        record.status === 'borrowed'
      );
      setBorrowRecords(matchingRecord ? [matchingRecord] : []);
      setBorrowId(matchingRecord ? matchingRecord.id : null);
    } catch (error) {
      console.error('Error fetching borrow records:', error);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (mode === 'issue') {
      const result = issueBookSchema.safeParse({
        memberId: selectedMember?.id || 0,
        bookId: selectedBook?.id || 0,
        dueDate: date,
      });

      if (!result.success) {
        result.error.issues.forEach((error) => {
          errors[error.path[0] as string] = error.message;
        });
      }
    } else {
      const result = returnBookSchema.safeParse({
        borrowId: borrowId || 0,
        returnDate: date,
      });

      if (!result.success) {
        result.error.issues.forEach((error) => {
          errors[error.path[0] as string] = error.message;
        });
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (mode === 'issue') {
      const issueData: IssueBookRequest = {
        memberId: selectedMember!.id,
        bookId: selectedBook!.id,
        dueDate: date,
      };

      const result = await issueBook(issueData);
      if (result) {
        setSuccess(true);
        resetForm();
        onSuccess?.();
        setTimeout(() => setSuccess(false), 3000);
      }
    } else {
      const returnData: ReturnBookRequest = {
        borrowId: borrowId!,
        returnDate: date,
      };

      const result = await returnBook(returnData);
      if (result) {
        setSuccess(true);
        resetForm();
        onSuccess?.();
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  };

  const resetForm = () => {
    setSelectedMember(null);
    setSelectedBook(null);
    setDate('');
    setBorrowId(null);
    setValidationErrors({});
  };

  const isFormValid = mode === 'issue'
    ? selectedMember && selectedBook && date && Object.keys(validationErrors).length === 0
    : selectedMember && selectedBook && date && borrowId && Object.keys(validationErrors).length === 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Borrow Management</h2>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={mode === 'issue' ? 'default' : 'outline'}
          onClick={() => setMode('issue')}
          className="flex-1"
        >
          Issue Book
        </Button>
        <Button
          variant={mode === 'return' ? 'default' : 'outline'}
          onClick={() => setMode('return')}
          className="flex-1"
        >
          Return Book
        </Button>
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
          <span className="text-sm text-green-700">
            Book {mode === 'issue' ? 'issued' : 'returned'} successfully!
          </span>
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
            {validationErrors.memberId && (
              <p className="text-xs text-red-500">{validationErrors.memberId}</p>
            )}
          </div>

          {/* Book Selection */}
          <div className="flex flex-col gap-2">
            <BookSearch
              onBookSelect={setSelectedBook}
              selectedBook={selectedBook}
            />
            {validationErrors.bookId && (
              <p className="text-xs text-red-500">{validationErrors.bookId}</p>
            )}
          </div>

          {/* Date Input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="block text-sm font-medium text-gray-700">
              {mode === 'issue' ? 'Due Date' : 'Return Date'}
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={mode === 'issue' ? getMinDate() : undefined}
                max={mode === 'return' ? getMaxDate() : undefined}
                className="pl-10"
                required
              />
            </div>
            {validationErrors.dueDate && (
              <p className="text-xs text-red-500">{validationErrors.dueDate}</p>
            )}
            {validationErrors.returnDate && (
              <p className="text-xs text-red-500">{validationErrors.returnDate}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {mode === 'issue'
                ? 'Books must be returned by this date'
                : 'Date when the book is being returned'
              }
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
                {mode === 'issue' ? 'Issuing Book...' : 'Returning Book...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {mode === 'issue' ? 'Issue Book' : 'Return Book'}
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Summary */}
      {selectedMember && selectedBook && date && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            {mode === 'issue' ? 'Issue Summary' : 'Return Summary'}
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>Member:</strong> {selectedMember.name} ({selectedMember.studentId})</div>
            <div><strong>Book:</strong> {selectedBook.title} by {selectedBook.author}</div>
            <div><strong>{mode === 'issue' ? 'Due Date' : 'Return Date'}:</strong> {new Date(date).toLocaleDateString()}</div>
            {mode === 'return' && borrowId && (
              <div><strong>Borrow Record ID:</strong> {borrowId}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
