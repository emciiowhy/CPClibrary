const { pgTable, serial, text, integer, timestamp, boolean } = require('drizzle-orm/pg-core');

// Members table
const members = pgTable('members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  studentId: text('student_id').notNull().unique(),
  email: text('email').notNull(),
});

// Books table
const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  isbn: text('isbn').notNull().unique(),
  available: boolean('available').notNull().default(true),
});

// Borrow records table
const borrowRecords = pgTable('borrow_records', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id').notNull().references(() => members.id),
  bookId: integer('book_id').notNull().references(() => books.id),
  issueDate: timestamp('issue_date').notNull().defaultNow(),
  dueDate: timestamp('due_date').notNull(),
  returnDate: timestamp('return_date'),
  status: text('status').notNull().default('borrowed'), // 'borrowed', 'returned', 'overdue'
});

// Librarians table
const librarians = pgTable('librarians', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  schoolId: text('school_id').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

module.exports = { members, books, borrowRecords, librarians };
