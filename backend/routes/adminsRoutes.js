import express from 'express';
import { fetchAdmins } from '../controllers/admins/adminsController.js';

const router = express.Router();

router.get('/admins', fetchAdmins);

export default router;
