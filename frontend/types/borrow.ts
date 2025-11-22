export interface BorrowRecord {
  id: number;
  memberId: number;
  bookId: number;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  memberName: string;
  bookTitle: string;
  studentId: string;
}

export interface IssueBookRequest {
  memberId: number;
  bookId: number;
  dueDate: string;
}

export interface ReturnBookRequest {
  borrowId: number;
  returnDate: string;
}

export interface BorrowStats {
  totalBorrowed: number;
  overdueBooks: number;
  returnedBooks: number;
}
