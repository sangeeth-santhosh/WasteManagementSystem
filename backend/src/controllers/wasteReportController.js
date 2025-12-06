import WasteReport from '../models/WasteReport.js';
import Zone from '../models/Zone.js';
import GeneratorDetails from '../models/GeneratorDetails.js';
import { createReportStatusNotification } from './notificationController.js';

export const createReport = async (req, res) => {
  try {
    const {
      wetKg,
      dryKg,
      plasticKg,
      eWasteKg,
      zone,
      details,
      zoneId,
      placeId,
      generatorType,
      generatorDetails,
    } = req.body;

    let zoneNameSnapshot = '';
    let placeNameSnapshot = '';

    if (zoneId) {
      const zoneDoc = await Zone.findById(zoneId);
      if (zoneDoc) {
        zoneNameSnapshot = zoneDoc.name;
        if (placeId) {
          const place = zoneDoc.places.find((p) => p._id.toString() === placeId);
          if (place) {
            placeNameSnapshot = place.name;
          }
        }
      }
    }

    const report = await WasteReport.create({
      user: req.user._id,
      wetKg: Number(wetKg) || 0,
      dryKg: Number(dryKg) || 0,
      plasticKg: Number(plasticKg) || 0,
      eWasteKg: Number(eWasteKg) || 0,
      zone: zone || zoneNameSnapshot || '',
      details: details || '',
      zoneId: zoneId || null,
      zoneNameSnapshot: zoneNameSnapshot || zone || '',
      placeId: placeId || '',
      placeNameSnapshot: placeNameSnapshot || '',
      generatorType: generatorType || null,
      generatorDetails: generatorDetails || {},
      status: 'Pending',
    });

    let generatorDetailsDoc = null;
    if (generatorType && generatorDetails) {
      try {
        generatorDetailsDoc = await GeneratorDetails.create({
          reportId: report._id,
          userId: req.user._id,
          generatorType,
          zoneId: zoneId || null,
          placeId: placeId || '',
          details: generatorDetails || {},
        });

        report.generatorDetailsId = generatorDetailsDoc._id;
        await report.save();
      } catch (genError) {
        console.error('Failed to create GeneratorDetails:', genError);
      }
    }

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

    const oldReport = await WasteReport.findById(id);

    if (!oldReport) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (oldReport.status === newStatus) {
      return res.json({
        success: true,
        data: oldReport,
        message: 'Status is already set to this value',
      });
    }

    oldReport.status = newStatus;
    const updatedReport = await oldReport.save();

    await createReportStatusNotification(oldReport, updatedReport);

    return res.json({ success: true, data: updatedReport });
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

export const getWeeklySummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const reports = await WasteReport.find({
      user: req.user._id,
      createdAt: { $gte: startOfWeek },
    });

    const totalWaste = reports.reduce((sum, r) => {
      return sum + (r.wetKg || 0) + (r.dryKg || 0) + (r.plasticKg || 0) + (r.eWasteKg || 0);
    }, 0);

    return res.json({
      success: true,
      data: {
        totalWaste: totalWaste.toFixed(2),
        reportCount: reports.length,
        reports,
      },
    });
  } catch (error) {
    console.error('getWeeklySummary error', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch weekly summary' });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const reports = await WasteReport.find({
      user: req.user._id,
      createdAt: { $gte: startOfMonth },
    });

    const totalWaste = reports.reduce((sum, r) => {
      return sum + (r.wetKg || 0) + (r.dryKg || 0) + (r.plasticKg || 0) + (r.eWasteKg || 0);
    }, 0);

    return res.json({
      success: true,
      data: {
        totalWaste: totalWaste.toFixed(2),
        reportCount: reports.length,
        reports,
      },
    });
  } catch (error) {
    console.error('getMonthlySummary error', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch monthly summary' });
  }
};

export const getMonthlyHistory = async (req, res) => {
  try {
    const reports = await WasteReport.find({ user: req.user._id }).sort({ createdAt: -1 });

    const monthlyData = {};
    reports.forEach((report) => {
      const date = new Date(report.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          monthKey,
          totalWaste: 0,
          reportCount: 0,
        };
      }

      monthlyData[monthKey].totalWaste +=
        (report.wetKg || 0) + (report.dryKg || 0) + (report.plasticKg || 0) + (report.eWasteKg || 0);
      monthlyData[monthKey].reportCount += 1;
    });

    const monthlyArray = Object.values(monthlyData).map((item) => ({
      ...item,
      totalWaste: parseFloat(item.totalWaste.toFixed(2)),
    }));

    const allTimeTotal = reports.reduce((sum, r) => {
      return sum + (r.wetKg || 0) + (r.dryKg || 0) + (r.plasticKg || 0) + (r.eWasteKg || 0);
    }, 0);

    return res.json({
      success: true,
      data: {
        monthlyHistory: monthlyArray,
        allTimeTotal: parseFloat(allTimeTotal.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('getMonthlyHistory error', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch monthly history' });
  }
};

