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

export const getEcoPointsDistribution = async (req, res) => {
  try {
    const days = 7;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const results = await WasteReport.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          positivePoints: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'Collected'] },
                { $add: ['$wetKg', '$dryKg', '$plasticKg', '$eWasteKg'] },
                0,
              ],
            },
          },
          negativePoints: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'Cancelled'] },
                { $add: ['$wetKg', '$dryKg', '$plasticKg', '$eWasteKg'] },
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dateMap = new Map();
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { positive: 0, negative: 0 });
    }

    results.forEach((r) => {
      dateMap.set(r._id, {
        positive: r.positivePoints || 0,
        negative: r.negativePoints || 0,
      });
    });

    const distribution = Array.from(dateMap.entries()).map(([date, points]) => ({
      date,
      positive: points.positive,
      negative: points.negative,
    }));

    return res.json({ success: true, data: distribution });
  } catch (error) {
    console.error('getEcoPointsDistribution error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch eco points distribution' });
  }
};

export const getTopWasteCategories = async (req, res) => {
  try {
    const totals = await WasteReport.aggregate([
      {
        $group: {
          _id: null,
          totalWet: { $sum: '$wetKg' },
          totalDry: { $sum: '$dryKg' },
          totalPlastic: { $sum: '$plasticKg' },
          totalEWaste: { $sum: '$eWasteKg' },
        },
      },
    ]);

    if (!totals.length) {
      return res.json({
        success: true,
        data: [
          { name: 'E-Waste', percentage: 0 },
          { name: 'Plastic', percentage: 0 },
          { name: 'Dry Waste', percentage: 0 },
          { name: 'Wet Waste', percentage: 0 },
        ],
      });
    }

    const t = totals[0];
    const total = (t.totalWet || 0) + (t.totalDry || 0) + (t.totalPlastic || 0) + (t.totalEWaste || 0);

    const categories = [
      { name: 'E-Waste', value: t.totalEWaste || 0 },
      { name: 'Plastic', value: t.totalPlastic || 0 },
      { name: 'Dry Waste', value: t.totalDry || 0 },
      { name: 'Wet Waste', value: t.totalWet || 0 },
    ];

    const withPercentage = categories.map((cat) => ({
      name: cat.name,
      percentage: total > 0 ? Math.round((cat.value / total) * 100) : 0,
      value: cat.value,
    }));

    withPercentage.sort((a, b) => b.percentage - a.percentage);

    return res.json({ success: true, data: withPercentage });
  } catch (error) {
    console.error('getTopWasteCategories error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch top waste categories' });
  }
};

