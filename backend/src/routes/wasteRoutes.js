import express from 'express';
import {
  createReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
  getPendingCount,
  getWeeklySummary,
  getMonthlySummary,
  getMonthlyHistory,
} from '../controllers/wasteReportController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/report', authenticate, createReport);
router.get('/my-reports', authenticate, getMyReports);
router.get('/all', authenticate, authorize('admin'), getAllReports);
router.patch('/:id/status', authenticate, authorize('admin'), updateReportStatus);
router.get('/pending-count', authenticate, getPendingCount);
router.get('/weekly-summary', authenticate, getWeeklySummary);
router.get('/monthly-summary', authenticate, getMonthlySummary);
router.get('/monthly-history', authenticate, getMonthlyHistory);

export default router;

