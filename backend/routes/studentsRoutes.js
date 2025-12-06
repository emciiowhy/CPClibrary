import express from 'express';
import { registerStudentsController } from '../controllers/students/studentsController.js';
import {fetchStudents ,loginStudentController, forgotPasswordStudentsController, registerStudentRequestController, verifyStudentOtpController, finalRegisterStudentController, resetPasswordStudentsController, logoutStudent, findStudent, updateProfile, changePassword } from '../controllers/students/authStudentsController.js';
import { jwtAuthenticate, refreshToken, verifyStudentToken } from '../middleware/authMiddleware.js';
import { uploadProfile } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/students', jwtAuthenticate, fetchStudents);
// router.post('/students/register', registerStudentsController);
router.post('/students/login', loginStudentController);
router.post('/students/register/request', registerStudentRequestController);
router.post('/students/register/verify-otp', verifyStudentOtpController);
router.post('/students/register/final-register', finalRegisterStudentController);
router.post('/students/forgot-password', forgotPasswordStudentsController);
router.post('/students/reset-password', resetPasswordStudentsController);
router.post('/students/update-profile', jwtAuthenticate, uploadProfile.single('profileImage'), updateProfile);
router.post('/students/change-password',jwtAuthenticate, changePassword)

router.get('/students/verify-student', verifyStudentToken);
router.get('/students/logout', logoutStudent);
router.get('/students/find',jwtAuthenticate, findStudent);

export default router;