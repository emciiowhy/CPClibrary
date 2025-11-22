import { z } from 'zod';

export const issueBookSchema = z.object({
  memberId: z.number().min(1, 'Member is required'),
  bookId: z.number().min(1, 'Book is required'),
  dueDate: z.string().min(1, 'Due date is required').refine((date) => {
    const selectedDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return selectedDate >= tomorrow;
  }, 'Due date must be at least tomorrow'),
});

export const returnBookSchema = z.object({
  borrowId: z.number().min(1, 'Borrow record is required'),
  returnDate: z.string().min(1, 'Return date is required').refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  }, 'Return date cannot be in the future'),
});

export const addBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  author: z.string().min(1, 'Author is required').max(255, 'Author must be less than 255 characters'),
  isbn: z.string().min(1, 'ISBN is required').regex(/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits'),
  description: z.string().optional(),
  year: z.string().optional().refine((val) => !val || /^\d{4}$/.test(val), 'Year must be a valid 4-digit year'),
  copies: z.string().optional().refine((val) => !val || /^\d+$/.test(val), 'Copies must be a number'),
});

export const addMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  studentId: z.string().min(1, 'Student ID is required').max(50, 'Student ID must be less than 50 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

export type IssueBookFormData = z.infer<typeof issueBookSchema>;
export type ReturnBookFormData = z.infer<typeof returnBookSchema>;
export type AddBookFormData = z.infer<typeof addBookSchema>;
export type AddMemberFormData = z.infer<typeof addMemberSchema>;
