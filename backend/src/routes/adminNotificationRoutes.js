import express from 'express';
import {
  createAdminNotification,
  getMyNotifications,
  getMyUnreadNotificationCount,
  markNotificationAsRead,
} from '../controllers/adminNotificationController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Admin: send notification (manual, zone/date filtered, etc.)
// POST /api/admin/notifications
router.post('/', adminAuth, createAdminNotification);

// Admin: get notifications list (recent)
// GET /api/admin/notifications?limit=20
router.get('/', adminAuth, getMyNotifications);

// User: get my unread count (for red dot in header)
// GET /api/admin/notifications/unread-count
router.get('/unread-count', adminAuth, getMyUnreadNotificationCount);

// User: mark specific notification as read
// PATCH /api/admin/notifications/:id/read
router.patch('/:id/read', adminAuth, markNotificationAsRead);

export default router;
