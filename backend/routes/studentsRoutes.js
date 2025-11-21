import express from 'express';
import { registerStudentsController } from '../controllers/students/studentsController.js';
import {fetchStudents ,loginStudentController, forgotPasswordStudentsController, registerStudentRequestController, verifyStudentOtpController, finalRegisterStudentController } from '../controllers/students/authStudentsController.js';
import { jwtAuthenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/students', jwtAuthenticate, fetchStudents);
// router.post('/students/register', registerStudentsController);
router.post('/students/login', loginStudentController);
router.post('/students/register/request', registerStudentRequestController);
router.post('/students/register/verify-otp', verifyStudentOtpController);
router.post('/students/register/final-register', finalRegisterStudentController);
router.post('/students/forgot-password', forgotPasswordStudentsController);

export default router;