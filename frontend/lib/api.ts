import axios from 'axios';
import { BorrowRecord, IssueBookRequest, ReturnBookRequest, BorrowStats } from '@/types/borrow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const borrowApi = {
  // Issue a book
  issueBook: async (data: IssueBookRequest): Promise<BorrowRecord> => {
    const response = await axios.post(`${API_BASE_URL}/borrow/issue`, data);
    return response.data;
  },

  // Return a book
  returnBook: async (data: ReturnBookRequest): Promise<BorrowRecord> => {
    const response = await axios.post(`${API_BASE_URL}/borrow/return`, data);
    return response.data.record;
  },

  // Get borrow records
  getBorrowRecords: async (): Promise<BorrowRecord[]> => {
    const response = await axios.get(`${API_BASE_URL}/borrow`);
    return response.data;
  },

  // Get borrow stats
  getBorrowStats: async (): Promise<BorrowStats> => {
    const response = await axios.get(`${API_BASE_URL}/borrow/stats`);
    return response.data;
  },

  // Get borrow record by ID
  getBorrowRecord: async (id: number): Promise<BorrowRecord> => {
    const response = await axios.get(`${API_BASE_URL}/borrow/${id}`);
    return response.data;
  },
};
