import { pool } from '../db.js';
import bcrypt from 'bcryptjs'

export const getAllStudents = async () => {
  const result = await pool.query("SELECT * FROM students");
  return result.rows;
}

export const registerStudents = async (req) => {
  const {name, email, schoolId, password} = req.body;
  const query = `
    INSERT INTO students (name, email, student_id, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const hashedPassword = await bcrypt.hash(password, 10);

  const values = [name, email, schoolId, hashedPassword];
  const result = await pool.query(query, values);

  return result.rows[0];
}
