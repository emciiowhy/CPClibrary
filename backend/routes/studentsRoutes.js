import express from 'express';
import { fetchStudents, registerStudentsController } from '../controllers/students/studentsController.js';
import { loginStudentController, forgotPasswordController } from '../controllers/students/authStudentsController.js';
import { jwtAuthenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/students', jwtAuthenticate, fetchStudents);
router.post('/students/register', registerStudentsController);
router.post('/students/login', loginStudentController); // once na mo login ka kay matek generate token each account
router.post('/students/forgot-password', jwtAuthenticate, forgotPasswordController);

export default router;