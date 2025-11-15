import { pool } from '../db.js';

export const getAllBooks = async () => {
  const result =  await pool.query("SELECT * FROM books");
  return result.rows;
}