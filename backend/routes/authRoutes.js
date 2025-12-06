import express from 'express';
import { redirectUser, refreshToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/refresh-token', refreshToken);
router.get('/check-token', redirectUser);

export default router;