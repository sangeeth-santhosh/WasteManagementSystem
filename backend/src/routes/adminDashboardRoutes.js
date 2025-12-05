import express from 'express';
import { getSummary, getEcoPointsDistribution, getTopWasteCategories } from '../controllers/adminDashboardController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', adminAuth, getSummary);
router.get('/eco-points-distribution', adminAuth, getEcoPointsDistribution);
router.get('/top-categories', adminAuth, getTopWasteCategories);

export default router;

