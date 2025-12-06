import Notification from '../models/Notification.js';
import WasteReport from '../models/WasteReport.js';
import Zone from '../models/Zone.js';
// import User if you need advanced queries
import User from '../models/User.js';

/**
 * Admin: create/send notification manually
 * Supports:
 *  - Direct userIds (array)
 *  - Zone + date filters using WasteReport
 *
 * Body expected:
 * {
 *   title: string,
 *   message: string,
 *   type?: 'SYSTEM' | 'REPORT_STATUS' | 'REMINDER' | 'ZONE_ALERT',
 *   deliveryMethod?: 'IN_APP' | 'IN_APP_EMAIL',
 *   userIds?: [userId1, userId2...],
 *   zoneId?: '...',
 *   startDate?: '2025-12-01',
 *   endDate?: '2025-12-31',
 *   status?: 'Pending' | 'Collected' | 'Verified' | 'Cancelled'
 * }
 */
export const createAdminNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type = 'SYSTEM',
      deliveryMethod = 'IN_APP',
      userIds,
      zoneId,
      startDate,
      endDate,
      status,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    let targetUserIds = [];

    // 1) If explicit userIds array given, use that
    if (Array.isArray(userIds) && userIds.length > 0) {
      targetUserIds = userIds;
    } else {
      // 2) Else derive users from WasteReport filters (zone + date + status)
      const query = {};

      if (zoneId) {
        query.zoneId = zoneId;
      }

      if (status) {
        query.status = status; // 'Pending', 'Verified', 'Collected', 'Cancelled'
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          // include full end day
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          query.createdAt.$lte = end;
        }
      }

      const reports = await WasteReport.find(query).select('user');

      targetUserIds = [
        ...new Set(reports.map((report) => report.user?.toString()).filter(Boolean)),
      ];
    }

    if (targetUserIds.length === 0) {
      return res.status(400).json({
        message:
          'No target users found for this notification. Check filters or userIds.',
      });
    }

    // If zoneId is passed, snapshot its name for display
    let zoneNameSnapshot = '';
    if (zoneId) {
      const zone = await Zone.findById(zoneId);
      zoneNameSnapshot = zone?.name || '';
    }

    const notificationsToInsert = targetUserIds.map((userId) => ({
      user: userId,
      title,
      message,
      type,
      deliveryMethod,
      zoneId: zoneId || undefined,
      zoneNameSnapshot: zoneNameSnapshot || '',
    }));

    const createdNotifications = await Notification.insertMany(
      notificationsToInsert
    );

    // TODO: if deliveryMethod === 'IN_APP_EMAIL', trigger email sending here

    return res.status(201).json({
      message: 'Notifications created successfully',
      count: createdNotifications.length,
      notifications: createdNotifications,
    });
  } catch (error) {
    console.error('Error creating admin notification:', error);
    return res
      .status(500)
      .json({ message: 'Failed to create notifications', error: error.message });
  }
};

/**
 * User: get notifications (for header bell + notifications page)
 * Query params:
 *  - limit (optional, default 20)
 */
export const getMyNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;

    // If admin is calling the admin route, return recent notifications
    if (req.admin) {
      const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(limit);
      return res.status(200).json(notifications);
    }

    // Otherwise, expect an authenticated user
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

/**
 * User: get unread notifications count (for the red dot in header)
 */
export const getMyUnreadNotificationCount = async (req, res) => {
  try {
    // Admin can query overall unread count
    if (req.admin) {
      const count = await Notification.countDocuments({ isRead: false });
      return res.status(200).json({ unreadCount: count });
    }

    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const count = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    return res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return res.status(500).json({
      message: 'Failed to fetch unread notification count',
      error: error.message,
    });
  }
};

/**
 * User: mark a notification as read
 * Route: PATCH /api/notifications/:id/read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id } = req.params;

    // Admin can mark any notification
    if (!userId && !req.admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const query = req.admin ? { _id: id } : { _id: id, user: userId };

    const notification = await Notification.findOneAndUpdate(
      query,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
};

/**
 * Helper: Create a notification when waste report status changes.
 * Call this from your WasteReport controller after you change status.
 *
 * Example usage:
 *   await createReportStatusNotification(oldReport, updatedReport);
 */
export const createReportStatusNotification = async (
  oldReport,
  updatedReport
) => {
  try {
    if (!updatedReport || !updatedReport.user) return;

    const oldStatus = oldReport?.status;
    const newStatus = updatedReport.status;

    if (oldStatus === newStatus) {
      return;
    }

    let statusMessagePart = '';
    switch (newStatus) {
      case 'Pending':
        statusMessagePart = 'is now pending.';
        break;
      case 'Verified':
        statusMessagePart = 'has been verified.';
        break;
      case 'Collected':
        statusMessagePart = 'has been collected.';
        break;
      case 'Cancelled':
        statusMessagePart = 'has been cancelled.';
        break;
      default:
        statusMessagePart = `status changed to ${newStatus}.`;
    }

    const title = 'Waste report status updated';
    const message = `
Your waste collection report ${statusMessagePart}

Date: ${updatedReport.createdAt?.toLocaleDateString?.() || ''}
Zone: ${updatedReport.zoneNameSnapshot || updatedReport.zone || ''}
Wet: ${updatedReport.wetKg || 0} kg
Dry: ${updatedReport.dryKg || 0} kg
Plastic: ${updatedReport.plasticKg || 0} kg
E-waste: ${updatedReport.eWasteKg || 0} kg

Please check your "Collect Waste" section for the full details and updated record.
    `.trim();

    await Notification.create({
      user: updatedReport.user,
      wasteReport: updatedReport._id,
      zoneId: updatedReport.zoneId || null,
      zoneNameSnapshot: updatedReport.zoneNameSnapshot || '',
      title,
      message,
      type: 'REPORT_STATUS',
      deliveryMethod: 'IN_APP', // change to 'IN_APP_EMAIL' if you also send email
    });

    // TODO: trigger email here if you want to send mail as well
  } catch (error) {
    console.error('Error creating report status notification:', error);
  }
};
