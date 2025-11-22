import { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
  description?: string;
  year?: number;
  copies?: number;
}

interface AddBookData {
  title: string;
  author: string;
  isbn: string;
  description?: string;
  year?: string;
  copies?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/books`);
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData: AddBookData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/books`, bookData);
      setError(null);
      // Refresh books list
      await fetchBooks();
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to add book';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const clearError = () => {
    setError(null);
  };

  return { books, loading, error, addBook, refetchBooks: fetchBooks, clearError };
};
