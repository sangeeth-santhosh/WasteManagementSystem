import express from 'express';
import { getSummary } from '../controllers/adminDashboardController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', adminAuth, getSummary);

export default router;

