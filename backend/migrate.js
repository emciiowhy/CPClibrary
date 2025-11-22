const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { members, books, borrowRecords } = require('./schema');
require('dotenv').config();

async function migrate() {
  console.log('Starting database migration...');

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  try {
    // Create tables
    console.log('Creating tables...');

    // Create members table
    await sql`CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      student_id TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL
    )`;

    // Create books table
    await sql`CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT NOT NULL UNIQUE,
      available BOOLEAN NOT NULL DEFAULT true
    )`;

    // Create borrow_records table
    await sql`CREATE TABLE IF NOT EXISTS borrow_records (
      id SERIAL PRIMARY KEY,
      member_id INTEGER NOT NULL REFERENCES members(id),
      book_id INTEGER NOT NULL REFERENCES books(id),
      issue_date TIMESTAMP NOT NULL DEFAULT NOW(),
      due_date TIMESTAMP NOT NULL,
      return_date TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'borrowed'
    )`;

    console.log('Tables created successfully!');

    // Seed data
    console.log('Seeding initial data...');

    // Insert members
    await sql`INSERT INTO members (name, student_id, email) VALUES
      ('Jerson Jay', '20240891', 'jerson@example.com'),
      ('John Doe', '20240892', 'john@example.com'),
      ('Jane Smith', '20240893', 'jane@example.com')
      ON CONFLICT (student_id) DO NOTHING`;

    // Insert books
    await sql`INSERT INTO books (title, author, isbn, available) VALUES
      ('Introduction to Computer Science', 'John Smith', '1234567890', true),
      ('Database Management Systems', 'Jane Doe', '0987654321', true),
      ('Principles of Teaching 1', 'Prof. Johnson', '1122334455', true),
      ('Principles of Teaching 2', 'Prof. Johnson', '5566778899', true),
      ('Introduction to Tourism and Hospitality in BC', 'Dr. Williams', '6677889900', true)
      ON CONFLICT (isbn) DO NOTHING`;

    // Insert initial borrow record
    await sql`INSERT INTO borrow_records (member_id, book_id, issue_date, due_date, status) VALUES
      (1, 1, NOW(), NOW() + INTERVAL '14 days', 'borrowed')
      ON CONFLICT DO NOTHING`;

    console.log('Data seeded successfully!');
    console.log('Migration completed!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
