import User from '../models/User.js';
import WasteReport from '../models/WasteReport.js';
import Feedback from '../models/Feedback.js';

export const getSummary = async (req, res) => {
  try {
    const [
      totalUsers,
      totalReports,
      pendingReports,
      verifiedReports,
      collectedReports,
      cancelledReports,
      feedbackCount,
    ] = await Promise.all([
      User.countDocuments(),
      WasteReport.countDocuments(),
      WasteReport.countDocuments({ status: 'Pending' }),
      WasteReport.countDocuments({ status: 'Verified' }),
      WasteReport.countDocuments({ status: 'Collected' }),
      WasteReport.countDocuments({ status: 'Cancelled' }),
      Feedback.countDocuments(),
    ]);

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalReports,
        pendingReports,
        verifiedReports,
        collectedReports,
        cancelledReports,
        feedbackCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load summary' });
  }
};

