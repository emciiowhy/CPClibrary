import express from 'express';
import { refreshToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/refresh-token', refreshToken);

export default router;