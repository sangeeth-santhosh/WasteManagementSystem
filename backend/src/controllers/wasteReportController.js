import WasteReport from '../models/WasteReport.js';

export const createReport = async (req, res) => {
  try {
    const { wetKg, dryKg, plasticKg, eWasteKg, zone, details } = req.body;

    if (!zone) {
      return res.status(400).json({ success: false, message: 'Zone is required' });
    }

    const report = await WasteReport.create({
      user: req.user._id,
      wetKg: Number(wetKg) || 0,
      dryKg: Number(dryKg) || 0,
      plasticKg: Number(plasticKg) || 0,
      eWasteKg: Number(eWasteKg) || 0,
      zone,
      details: details || '',
      status: 'Pending',
    });

    return res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error('createReport error', error);
    return res.status(500).json({ success: false, message: 'Failed to create report' });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await WasteReport.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: reports });
  } catch (error) {
    console.error('getMyReports error', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await WasteReport.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email role');

    return res.json({ success: true, data: reports });
  } catch (error) {
    console.error('getAllReports error', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;
    const allowed = ['Pending', 'Verified', 'Collected', 'Cancelled'];

    if (!allowed.includes(newStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = await WasteReport.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('updateReportStatus error', error);
    return res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

export const getPendingCount = async (req, res) => {
  try {
    const query = { status: 'Pending' };
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const count = await WasteReport.countDocuments(query);
    return res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('getPendingCount error', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch pending count' });
  }
};

