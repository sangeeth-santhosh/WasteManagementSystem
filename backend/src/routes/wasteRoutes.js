import express from 'express';
import {
  createReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
  getPendingCount,
} from '../controllers/wasteReportController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/report', authenticate, createReport);
router.get('/my-reports', authenticate, getMyReports);
router.get('/all', authenticate, authorize('admin'), getAllReports);
router.patch('/:id/status', authenticate, authorize('admin'), updateReportStatus);
router.get('/pending-count', authenticate, getPendingCount);

export default router;

