import WasteReport from '../models/WasteReport.js';
import { getGeneratorDetailsForReports } from './generatorDetailsController.js';
// Notification helper for report status changes
import { createReportStatusNotification } from './notificationController.js';

export const getAllReports = async (req, res) => {
  try {
    const reports = await WasteReport.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email role')
      .populate('generatorDetailsId');

    const reportIds = reports.map((r) => r._id);
    const generatorDetailsMap = await getGeneratorDetailsForReports(reportIds);

    const reportsWithDetails = reports.map((report) => {
      const reportObj = report.toObject();
      const genDetails = generatorDetailsMap[report._id.toString()];
      if (genDetails) {
        reportObj.generatorDetails = genDetails.details;
        reportObj.generatorType = genDetails.generatorType;
      }
      return reportObj;
    });

    return res.json({ success: true, data: reportsWithDetails });
  } catch (error) {
    console.error('getAllReports error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to fetch reports' });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['Pending', 'Verified', 'Collected', 'Cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // 🔥 get the old report first
    const oldReport = await WasteReport.findById(id);

    if (!oldReport) {
      return res
        .status(404)
        .json({ success: false, message: 'Report not found' });
    }

    // If status is same, no need to update or send notification
    if (oldReport.status === status) {
      return res.json({
        success: true,
        data: oldReport,
        message: 'Status is already set to this value',
      });
    }

    // ✅ update & save
    oldReport.status = status;
    const updatedReport = await oldReport.save();

    // 🔔 create notification for the user (auto)
    await createReportStatusNotification(oldReport, updatedReport);

    return res.json({ success: true, data: updatedReport });
  } catch (error) {
    console.error('updateReportStatus error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to update status' });
  }
};
