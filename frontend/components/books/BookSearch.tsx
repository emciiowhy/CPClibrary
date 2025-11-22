"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';

interface BookType {
  id: number;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
}

interface BookSearchProps {
  onBookSelect: (book: BookType) => void;
  selectedBook?: BookType | null;
}

export default function BookSearch({ onBookSelect, selectedBook }: BookSearchProps) {
  const { books, loading, error } = useBooks();
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter books based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, books]);

  const handleBookSelect = (book: BookType) => {
    onBookSelect(book);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Book
      </label>

      {/* Selected book display / trigger */}
      <div
        className="w-full p-3 border border-gray-200 rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-blue-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {selectedBook ? (
            <>
              <div className="w-10 h-12 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">📖</span>
              </div>
              <div>
                <div className="font-medium text-sm">{selectedBook.title}</div>
                <div className="text-xs text-gray-500">by {selectedBook.author} • ISBN: {selectedBook.isbn}</div>
              </div>
            </>
          ) : (
            <span className="text-gray-500">Select a book...</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Books list */}
          <div className="py-1">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading books...
              </div>
            ) : error ? (
              <div className="px-3 py-2 text-sm text-red-500 text-center">
                Error loading books
              </div>
            ) : filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                  onClick={() => handleBookSelect(book)}
                >
                  <div className="w-8 h-10 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xs">📖</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{book.title}</div>
                    <div className="text-xs text-gray-500">by {book.author} • ISBN: {book.isbn}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No books found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
