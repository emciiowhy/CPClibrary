import { pool } from '../db.js';

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
  const values = [name, email, schoolId, password];
  const result = await pool.query(query, values);

  return result.rows[0];
}
