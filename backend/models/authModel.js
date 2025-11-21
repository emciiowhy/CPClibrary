import { pool } from "../db.js";

export const findStudentsByEmail = async (email) => {
  const query = `
    SELECT * FROM students
    WHERE email = $1
    LIMIT 1;
  `

  const result = await pool.query(query, [email]);
  return result.rows[0];
}

export const findStudentsBySchoolId = async (schoolId) => {
  const query = `
    SELECT * FROM students
    WHERE student_id = $1
    LIMIT 1;
  `

  const result = await pool.query(query, [schoolId]);
  return result.rows[0];
}

export const findAdminsByEmail = async (email) => {
  const query = `
    SELECT * FROM admins
    WHERE email = $1
    LIMIT 1;
  `
  const result = await pool.query(query, [email]);
  return result.rows[0];
}