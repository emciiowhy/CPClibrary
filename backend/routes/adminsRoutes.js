import express from 'express';
import { finalRegisterAdminController, loginAdminController, registerAdminRequestController, verifyAdminOtpController, fetchAdmins, forgotPasswordAdminController, resetPasswordAdminController } from '../controllers/admins/authAdminsController.js';
import { jwtAuthenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admins', jwtAuthenticate, fetchAdmins);
// router.post('/admins/register', registerAdminsController);
router.post('/admins/login', loginAdminController);
router.post('/admins/register/request', registerAdminRequestController);
router.post('/admins/register/verify-otp', verifyAdminOtpController);
router.post('/admins/register/final-register', finalRegisterAdminController);
router.post('/admins/forgot-password', forgotPasswordAdminController);
router.post('/admins/reset-password', resetPasswordAdminController);

export default router;
