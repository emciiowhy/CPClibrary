import express from 'express';
import { fetchStudents, registerStudentsController } from '../controllers/studentsController.js';

const router = express.Router();

router.get('/students', fetchStudents);
router.post('/students/register', registerStudentsController);

export default router;