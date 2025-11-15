import { pool } from '../db.js';

export const getAllAdmins = async () => {
    const result = await pool.query("SELECT * FROM admins");
    return result.rows;
}