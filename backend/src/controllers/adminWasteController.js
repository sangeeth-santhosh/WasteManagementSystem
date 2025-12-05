import WasteReport from '../models/WasteReport.js';

export const getAllReports = async (req, res) => {
  try {
    const reports = await WasteReport.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email role');
    return res.json({ success: true, data: reports });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch reports' });
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

    const updated = await WasteReport.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

