import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const {PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGCHANNELBINDING} = process.env;

export const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  ssl: {rejectUnauthorized: false},
  user: PGUSER,
  password: PGPASSWORD,
  channel_binding: PGCHANNELBINDING,
});

