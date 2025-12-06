import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.get('/unread-count', authenticate, getUnreadCount);
router.patch('/:id/read', authenticate, markAsRead);

export default router;
