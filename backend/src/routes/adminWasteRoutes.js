import express from 'express';
import { getAllReports, updateReportStatus } from '../controllers/adminWasteController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', adminAuth, getAllReports);
router.patch('/:id/status', adminAuth, updateReportStatus);

export default router;

