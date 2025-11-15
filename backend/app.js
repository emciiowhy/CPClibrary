import express from "express";
import cors from "cors";
import morgan from "morgan";
import studentsRoutes from './routes/studentsRoutes.js';
import adminsRoutes from './routes/adminsRoutes.js'
import booksRoutes from './routes/booksRoutes.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get('/', (req, res) => {
  res("hi");
})

app.use('/api', studentsRoutes);
app.use('/api', adminsRoutes, booksRoutes);

export default app;
