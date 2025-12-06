import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('getNotifications error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    return res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('getUnreadCount error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to fetch unread count' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: 'Notification not found' });
    }

    return res.json({ success: true, data: notification });
  } catch (error) {
    console.error('markAsRead error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to update notification' });
  }
};

export const createReportStatusNotification = async (oldReport, updatedReport) => {
  try {
    if (!updatedReport?.user) return;
    if (oldReport && oldReport.status === updatedReport.status) return;

    const status = updatedReport.status;
    const title = 'Waste Report Update';
    const statusMessageMap = {
      Pending: 'Your waste report is pending. We will review it shortly.',
      Verified: 'Your waste report has been verified. Thank you for reporting.',
      Collected: 'Your waste report has been collected. Appreciate your patience.',
      Cancelled: 'Your waste report was cancelled. Contact support for questions.',
    };

    const message = statusMessageMap[status] || 'Your waste report was updated.';
    const userId = updatedReport.user._id || updatedReport.user;

    await Notification.create({
      user: userId,
      wasteReport: updatedReport._id,
      zoneId: updatedReport.zoneId || null,
      zoneNameSnapshot: updatedReport.zoneNameSnapshot || updatedReport.zone || '',
      title,
      message,
      type: 'REPORT_STATUS',
    });
  } catch (error) {
    console.error('createReportStatusNotification error:', error);
  }
};
