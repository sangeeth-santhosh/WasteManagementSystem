import GeneratorDetails from '../models/GeneratorDetails.js';
import WasteReport from '../models/WasteReport.js';

export const getGeneratorDetailsByReportId = async (req, res) => {
  try {
    const { reportId } = req.params;
    const generatorDetails = await GeneratorDetails.findOne({ reportId });

    if (!generatorDetails) {
      return res.json({ success: true, data: null });
    }

    return res.json({ success: true, data: generatorDetails });
  } catch (error) {
    console.error('getGeneratorDetailsByReportId error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch generator details' });
  }
};

export const getGeneratorDetailsForReports = async (reportIds) => {
  try {
    const details = await GeneratorDetails.find({ reportId: { $in: reportIds } });
    const detailsMap = {};
    details.forEach((detail) => {
      detailsMap[detail.reportId.toString()] = detail;
    });
    return detailsMap;
  } catch (error) {
    console.error('getGeneratorDetailsForReports error:', error);
    return {};
  }
};





