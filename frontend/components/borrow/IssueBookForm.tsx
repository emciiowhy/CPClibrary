"use client";

import React, { useState } from 'react';
import { Calendar, BookOpen, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import MemberSearch from '@/components/members/MemberSearch';
import BookSearch from '@/components/books/BookSearch';
import { useBorrow } from '@/hooks/useBorrow';
import { IssueBookRequest } from '@/types/borrow';

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

interface IssueBookFormProps {
  onSuccess?: () => void;
}

export default function IssueBookForm({ onSuccess }: IssueBookFormProps) {
  const { issueBook, loading, error, clearError } = useBorrow();

  const [selectedMember, setSelectedMember] = useState<StudentType | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [success, setSuccess] = useState(false);

  // Calculate minimum due date (tomorrow)
  const getMinDueDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMember || !selectedBook || !dueDate) {
      return;
    }

    const issueData: IssueBookRequest = {
      memberId: selectedMember.id,
      bookId: selectedBook.id,
      dueDate,
    };

    const result = await issueBook(issueData);

    if (result) {
      setSuccess(true);
      setSelectedMember(null);
      setSelectedBook(null);
      setDueDate('');
      onSuccess?.();

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  const isFormValid = selectedMember && selectedBook && dueDate;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Issue Book</h2>
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
          <span className="text-sm text-green-700">Book issued successfully!</span>
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

          {/* Due Date */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={getMinDueDate()}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Books must be returned by this date
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
                Issuing Book...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Issue Book
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Summary */}
      {selectedMember && selectedBook && dueDate && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Issue Summary</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>Member:</strong> {selectedMember.name} ({selectedMember.studentId})</div>
            <div><strong>Book:</strong> {selectedBook.title} by {selectedBook.author}</div>
            <div><strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
