import express from 'express';
import { getGeneratorDetailsByReportId } from '../controllers/generatorDetailsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/report/:reportId', authenticate, getGeneratorDetailsByReportId);

export default router;





