import express from 'express';
import { registerStudentsController } from '../controllers/students/studentsController.js';
import {fetchStudents ,loginStudentController, forgotPasswordStudentsController, registerStudentRequestController, verifyStudentOtpController, finalRegisterStudentController, resetPasswordStudentsController, logoutStudent } from '../controllers/students/authStudentsController.js';
import { jwtAuthenticate, refreshToken, verifyStudentToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/students', jwtAuthenticate, fetchStudents);
// router.post('/students/register', registerStudentsController);
router.post('/students/login', loginStudentController);
router.post('/students/register/request', registerStudentRequestController);
router.post('/students/register/verify-otp', verifyStudentOtpController);
router.post('/students/register/final-register', finalRegisterStudentController);
router.post('/students/forgot-password', forgotPasswordStudentsController);
router.post('/students/reset-password', resetPasswordStudentsController);

router.get('/students/verify-student', refreshToken);
router.get('/students/logout', logoutStudent);

export default router;