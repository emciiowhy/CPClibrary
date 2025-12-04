// backend/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import studentsRoutes from './routes/studentsRoutes.js';
import adminsRoutes from './routes/adminsRoutes.js'
import booksRoutes from './routes/booksRoutes.js'
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3001",  // Changed from 3000 to 3001
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send("hi");  // Fixed: changed res("hi") to res.send("hi")
})

app.use('/api', studentsRoutes);
app.use('/api', adminsRoutes);
app.use('/api', booksRoutes);

export default app;