import axios from 'axios';
import { BorrowRecord, IssueBookRequest, ReturnBookRequest, BorrowStats } from '@/types/borrow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const borrowApi = {
  issueBook: async (data: IssueBookRequest): Promise<BorrowRecord> => {
    const response = await axiosInstance.post('/borrow/issue', data);
    return response.data;
  },

  returnBook: async (data: ReturnBookRequest): Promise<BorrowRecord> => {
    const response = await axiosInstance.post('/borrow/return', data);
    return response.data.record;
  },

  getBorrowRecords: async (): Promise<BorrowRecord[]> => {
    const response = await axiosInstance.get('/borrow');
    return response.data;
  },

  getBorrowStats: async (): Promise<BorrowStats> => {
    const response = await axiosInstance.get('/borrow/stats');
    return response.data;
  },

  getBorrowRecord: async (id: number): Promise<BorrowRecord> => {
    const response = await axiosInstance.get(`/borrow/${id}`);
    return response.data;
  },
};

export const authApi = {
  register: async (userData: { fullName: string; schoolId: string; email: string; password: string }) => {
    // Change fullName to name before sending
    const response = await axiosInstance.post('/students/register/request', {
      name: userData.fullName,  // Convert fullName to name
      schoolId: userData.schoolId,
      email: userData.email,
      password: userData.password
    });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string, schoolId: string) => {
    const response = await axiosInstance.post('/students/register/verify-otp', { email, otp, schoolId });
    return response.data;
  },

  finalRegister: async (userData: { name: string; schoolId: string; email: string; password: string }) => {
    const response = await axiosInstance.post('/students/register/final-register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await axiosInstance.post('/students/auth/login', credentials);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post('/students/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await axiosInstance.post('/students/auth/reset-password', { token, newPassword });
    return response.data;
  },
};

export const adminApi = {
  register: async (email: string) => {
    const response = await axiosInstance.post('/admins/register/request', { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await axiosInstance.post('/admins/register/verify-otp', { email, otp });
    return response.data;
  },

  finalRegister: async (userData: { name: string; email: string; password: string }) => {
    const response = await axiosInstance.post('/admins/register/final-register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await axiosInstance.post('/admins/login', credentials);
    return response.data;
  },
};

// Default export
const api = {
  get: axiosInstance.get.bind(axiosInstance),
  post: axiosInstance.post.bind(axiosInstance),
  put: axiosInstance.put.bind(axiosInstance),
  delete: axiosInstance.delete.bind(axiosInstance),
  borrow: borrowApi,
  auth: authApi,
  admin: adminApi,
};

export default api;