import express from 'express';
import { createFeedback, getMyFeedback } from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createFeedback);
router.get('/my', authenticate, getMyFeedback);

export default router;

