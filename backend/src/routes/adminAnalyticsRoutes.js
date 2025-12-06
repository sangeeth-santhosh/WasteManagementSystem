import express from 'express';
import {
  getZoneTotals,
  getCategoryByZone,
  getTopZones,
  getCategoryHighLow,
} from '../controllers/adminAnalyticsController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/zone-totals', adminAuth, getZoneTotals);
router.get('/category-by-zone', adminAuth, getCategoryByZone);
router.get('/top-zones', adminAuth, getTopZones);
router.get('/category-high-low', adminAuth, getCategoryHighLow);

export default router;




