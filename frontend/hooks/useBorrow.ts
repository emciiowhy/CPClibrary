import { useState, useEffect } from 'react';
import { BorrowRecord, IssueBookRequest, ReturnBookRequest, BorrowStats } from '@/types/borrow';
import { borrowApi } from '@/lib/api';

export const useBorrow = () => {
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [borrowStats, setBorrowStats] = useState<BorrowStats>({
    totalBorrowed: 0,
    overdueBooks: 0,
    returnedBooks: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch borrow records
  const fetchBorrowRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const records = await borrowApi.getBorrowRecords();
      setBorrowRecords(records);
    } catch (err) {
      setError('Failed to fetch borrow records');
      console.error('Error fetching borrow records:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch borrow stats
  const fetchBorrowStats = async () => {
    try {
      const stats = await borrowApi.getBorrowStats();
      setBorrowStats(stats);
    } catch (err) {
      console.error('Error fetching borrow stats:', err);
    }
  };

  // Issue a book
  const issueBook = async (data: IssueBookRequest): Promise<BorrowRecord | null> => {
    try {
      setLoading(true);
      setError(null);
      const newRecord = await borrowApi.issueBook(data);
      setBorrowRecords(prev => [newRecord, ...prev]);
      await fetchBorrowStats(); // Refresh stats
      return newRecord;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to issue book';
      setError(errorMessage);
      console.error('Error issuing book:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Return a book
  const returnBook = async (data: ReturnBookRequest): Promise<BorrowRecord | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedRecord = await borrowApi.returnBook(data);
      setBorrowRecords(prev =>
        prev.map(record =>
          record.id === updatedRecord.id ? updatedRecord : record
        )
      );
      await fetchBorrowStats(); // Refresh stats
      return updatedRecord;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to return book';
      setError(errorMessage);
      console.error('Error returning book:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchBorrowRecords();
    fetchBorrowStats();
  }, []);

  return {
    borrowRecords,
    borrowStats,
    loading,
    error,
    issueBook,
    returnBook,
    fetchBorrowRecords,
    fetchBorrowStats,
    clearError: () => setError(null),
  };
};
