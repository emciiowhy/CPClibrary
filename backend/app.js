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
  origin: "http://localhost:3000",
  credentials: true,
}));

app.get('/', (req, res) => {
  res("hi");
})

app.use('/api', studentsRoutes);
app.use('/api', adminsRoutes, booksRoutes);

export default app;
