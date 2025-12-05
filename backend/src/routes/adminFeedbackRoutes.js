import express from 'express';
import { getAllFeedback, resolveFeedback } from '../controllers/adminFeedbackController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', adminAuth, getAllFeedback);
router.patch('/:id/resolve', adminAuth, resolveFeedback);

export default router;

