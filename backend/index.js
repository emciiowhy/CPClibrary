// backend/index.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { members, books, borrowRecords, librarians } = require('./schema');
const { eq, and } = require('drizzle-orm');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Database connection
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Middleware
app.use(cors());
app.use(express.json());

// Note: Mock data removed - now using real database

// API Routes

// Get borrow records
app.get('/api/borrow', async (req, res) => {
  try {
    const records = await db.select({
      id: borrowRecords.id,
      memberId: borrowRecords.memberId,
      bookId: borrowRecords.bookId,
      fee: borrowRecords.fee,
      issueDate: borrowRecords.issueDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      memberName: members.name,
      bookTitle: books.title,
      studentId: members.studentId,
    })
    .from(borrowRecords)
    .leftJoin(members, eq(borrowRecords.memberId, members.id))
    .leftJoin(books, eq(borrowRecords.bookId, books.id))
    .orderBy(borrowRecords.issueDate);

    // Update overdue status for borrowed records
    const now = new Date();
    for (const record of records) {
      if (record.status === 'borrowed' && new Date(record.dueDate) < now) {
        await db.update(borrowRecords)
          .set({ status: 'overdue' })
          .where(eq(borrowRecords.id, record.id));
        record.status = 'overdue'; // Update in response
      }
    }

    res.json(records);
  } catch (error) {
    console.error('Error fetching borrow records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get borrow stats
app.get('/api/borrow/stats', async (req, res) => {
  try {
    const records = await db.select().from(borrowRecords);
    const stats = {
      totalBorrowed: records.filter(r => r.status === 'borrowed').length,
      overdue: records.filter(r => new Date(r.dueDate) < new Date() && r.status === 'borrowed').length,
      returned: records.filter(r => r.status === 'returned').length
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching borrow stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Issue book
app.post('/api/borrow/issue', async (req, res) => {
  try {
    const { memberId, bookId, dueDate } = req.body;

    // Validate input
    if (!memberId || !bookId || !dueDate) {
      return res.status(400).json({ error: 'Member ID, Book ID, and Due Date are required' });
    }

    // Check if member exists
    const memberResult = await db.select().from(members).where(eq(members.id, parseInt(memberId)));
    if (memberResult.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Check if book exists and is available
    const bookResult = await db.select().from(books).where(eq(books.id, parseInt(bookId)));
    if (bookResult.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const book = bookResult[0];
    if (!book.available) {
      return res.status(400).json({ error: 'Book is not available' });
    }

    // Check if member already has this book borrowed
    const existingBorrow = await db.select().from(borrowRecords).where(
      and(
        eq(borrowRecords.memberId, parseInt(memberId)),
        eq(borrowRecords.bookId, parseInt(bookId)),
        eq(borrowRecords.status, 'borrowed')
      )
    );
    if (existingBorrow.length > 0) {
      return res.status(400).json({ error: 'Member already has this book borrowed' });
    }

    // Create new borrow record
    const newRecord = await db.insert(borrowRecords).values({
      memberId: parseInt(memberId),
      bookId: parseInt(bookId),
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      status: 'borrowed'
    }).returning();

    // Mark book as unavailable
    await db.update(books).set({ available: false }).where(eq(books.id, parseInt(bookId)));

    res.status(201).json({
      message: 'Book issued successfully',
      record: newRecord[0]
    });
  } catch (error) {
    console.error('Error issuing book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Return book
app.post('/api/borrow/return', async (req, res) => {
  try {
    const { borrowId, returnDate } = req.body;

    if (!borrowId || !returnDate) {
      return res.status(400).json({ error: 'Borrow ID and return date are required' });
    }

    // Check if borrow record exists
    const recordResult = await db.select().from(borrowRecords).where(eq(borrowRecords.id, parseInt(borrowId)));
    if (recordResult.length === 0) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    const record = recordResult[0];
    if (record.status === 'returned') {
      return res.status(400).json({ error: 'Book already returned' });
    }

    // Update borrow record
    const updatedRecord = await db.update(borrowRecords)
      .set({
        status: 'returned',
        returnDate: new Date(returnDate)
      })
      .where(eq(borrowRecords.id, parseInt(borrowId)))
      .returning();

    // Mark book as available
    await db.update(books).set({ available: true }).where(eq(books.id, record.bookId));

    res.json({
      message: 'Book returned successfully',
      record: updatedRecord[0]
    });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get members
app.get('/api/members', async (req, res) => {
  try {
    const membersList = await db.select().from(members);
    res.json(membersList);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add member
app.post('/api/members', async (req, res) => {
  try {
    const { name, studentId, email } = req.body;

    // Validate input
    if (!name || !studentId || !email) {
      return res.status(400).json({ error: 'Name, Student ID, and Email are required' });
    }

    // Check if student ID already exists
    const existingMember = await db.select().from(members).where(eq(members.studentId, studentId));
    if (existingMember.length > 0) {
      return res.status(400).json({ error: 'Student ID already exists' });
    }

    // Check if email already exists
    const existingEmail = await db.select().from(members).where(eq(members.email, email));
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new member
    const newMember = await db.insert(members).values({
      name,
      studentId,
      email,
    }).returning();

    res.status(201).json({
      message: 'Member added successfully',
      member: newMember[0]
    });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get books
app.get('/api/books', async (req, res) => {
  try {
    const booksList = await db.select().from(books);
    res.json(booksList);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add book
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn, description, year, copies } = req.body;

    // Validate input
    if (!title || !author || !isbn) {
      return res.status(400).json({ error: 'Title, Author, and ISBN are required' });
    }

    // Check if book with same ISBN already exists
    const existingBook = await db.select().from(books).where(eq(books.isbn, isbn));
    if (existingBook.length > 0) {
      return res.status(400).json({ error: 'Book with this ISBN already exists' });
    }

    // Create new book
    const newBook = await db.insert(books).values({
      title,
      author,
      isbn,
      description: description || '',
      year: year ? parseInt(year) : null,
      available: true,
      copies: copies ? parseInt(copies) : 1,
    }).returning();

    res.status(201).json({
      message: 'Book added successfully',
      book: newBook[0]
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Librarian login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { schoolId, password } = req.body;

    if (!schoolId || !password) {
      return res.status(400).json({ error: 'School ID and password are required' });
    }

    // Find librarian by school ID
    const librarianResult = await db.select().from(librarians).where(eq(librarians.schoolId, schoolId));
    if (librarianResult.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const librarian = librarianResult[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, librarian.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: librarian.id, schoolId: librarian.schoolId, name: librarian.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      librarian: {
        id: librarian.id,
        name: librarian.name,
        schoolId: librarian.schoolId,
        email: librarian.email
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Librarian signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, schoolId, email, password } = req.body;

    if (!name || !schoolId || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if school ID already exists
    const existingSchoolId = await db.select().from(librarians).where(eq(librarians.schoolId, schoolId));
    if (existingSchoolId.length > 0) {
      return res.status(400).json({ error: 'School ID already exists' });
    }

    // Check if email already exists
    const existingEmail = await db.select().from(librarians).where(eq(librarians.email, email));
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new librarian
    const newLibrarian = await db.insert(librarians).values({
      name,
      schoolId,
      email,
      password: hashedPassword,
    }).returning();

    // Generate JWT token
    const token = jwt.sign(
      { id: newLibrarian[0].id, schoolId: newLibrarian[0].schoolId, name: newLibrarian[0].name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      librarian: {
        id: newLibrarian[0].id,
        name: newLibrarian[0].name,
        schoolId: newLibrarian[0].schoolId,
        email: newLibrarian[0].email
      }
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    librarian: req.user
  });
});

// Apply authentication middleware to protected routes
// app.use('/api/borrow', authenticateToken);
// app.use('/api/members', authenticateToken);
// app.use('/api/books', authenticateToken);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Library API is running' });
});

app.listen(port, () => {
  console.log(`Library API server running on port ${port}`);
});
