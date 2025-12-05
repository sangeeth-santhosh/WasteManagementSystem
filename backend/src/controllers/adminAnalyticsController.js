import WasteReport from '../models/WasteReport.js';

export const getZoneTotals = async (req, res) => {
  try {
    const { from, to, zone, generatorType } = req.query;
    const match = {};

    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    if (zone) {
      match.zone = zone;
    }

    if (generatorType) {
      match.generatorType = generatorType;
    }

    const results = await WasteReport.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$zone',
          totalWet: { $sum: '$wetKg' },
          totalDry: { $sum: '$dryKg' },
          totalPlastic: { $sum: '$plasticKg' },
          totalEWaste: { $sum: '$eWasteKg' },
          totalWaste: { $sum: { $add: ['$wetKg', '$dryKg', '$plasticKg', '$eWasteKg'] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalWaste: -1 } },
    ]);

    const formatted = results.map((r) => ({
      zone: r._id,
      totalWet: r.totalWet || 0,
      totalDry: r.totalDry || 0,
      totalPlastic: r.totalPlastic || 0,
      totalEWaste: r.totalEWaste || 0,
      totalWaste: r.totalWaste || 0,
      count: r.count || 0,
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('getZoneTotals error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch zone totals' });
  }
};

export const getCategoryByZone = async (req, res) => {
  try {
    const { from, to, zone, generatorType } = req.query;
    const match = {};

    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    if (zone) {
      match.zone = zone;
    }

    if (generatorType) {
      match.generatorType = generatorType;
    }

    const results = await WasteReport.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$zone',
          wetKg: { $sum: '$wetKg' },
          dryKg: { $sum: '$dryKg' },
          plasticKg: { $sum: '$plasticKg' },
          eWasteKg: { $sum: '$eWasteKg' },
        },
      },
    ]);

    const formatted = results.map((r) => ({
      zone: r._id,
      wetKg: r.wetKg || 0,
      dryKg: r.dryKg || 0,
      plasticKg: r.plasticKg || 0,
      eWasteKg: r.eWasteKg || 0,
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('getCategoryByZone error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch category by zone' });
  }
};

export const getTopZones = async (req, res) => {
  try {
    const { from, to, limit = 5, generatorType } = req.query;
    const match = {};

    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    if (generatorType) {
      match.generatorType = generatorType;
    }

    const results = await WasteReport.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$zone',
          totalWaste: { $sum: { $add: ['$wetKg', '$dryKg', '$plasticKg', '$eWasteKg'] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalWaste: -1 } },
      { $limit: parseInt(limit) },
    ]);

    const formatted = results.map((r) => ({
      zone: r._id,
      totalWaste: r.totalWaste || 0,
      count: r.count || 0,
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('getTopZones error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch top zones' });
  }
};

export const getCategoryHighLow = async (req, res) => {
  try {
    const { from, to, generatorType } = req.query;
    const match = {};

    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    if (generatorType) {
      match.generatorType = generatorType;
    }

    const results = await WasteReport.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$zone',
          wetKg: { $sum: '$wetKg' },
          dryKg: { $sum: '$dryKg' },
          plasticKg: { $sum: '$plasticKg' },
          eWasteKg: { $sum: '$eWasteKg' },
        },
      },
    ]);

    const formatted = results.map((r) => {
      const categories = [
        { name: 'Wet Waste', value: r.wetKg || 0 },
        { name: 'Dry Waste', value: r.dryKg || 0 },
        { name: 'Plastic', value: r.plasticKg || 0 },
        { name: 'E-Waste', value: r.eWasteKg || 0 },
      ];

      const sorted = categories.sort((a, b) => b.value - a.value);
      const highest = sorted[0];
      const lowest = sorted[sorted.length - 1];

      return {
        zone: r._id,
        highest: highest,
        lowest: lowest,
        breakdown: categories,
      };
    });

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('getCategoryHighLow error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch category high/low' });
  }
};

