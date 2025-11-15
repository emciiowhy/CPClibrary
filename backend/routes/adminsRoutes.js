import express from 'express';
import { fetchAdmins } from '../controllers/adminsController.js';

const router = express.Router();

router.get('/admins', fetchAdmins);

export default router;
