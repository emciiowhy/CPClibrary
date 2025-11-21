import { pool } from "../db.js";
import bcrypt from "bcryptjs";

export const getAllAdmins = async () => {
  const result = await pool.query("SELECT * FROM admins");
  return result.rows;
};

export const registerAdmins = async (req) => {
  const {name, email, password} = req.body;
  const query = `
    INSERT INTO admins (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const hashedPassword = await bcrypt.hash(password, 10);

  const values = [name, email, hashedPassword];
  const result = await pool.query(query, values);

  return result.rows[0];
};
