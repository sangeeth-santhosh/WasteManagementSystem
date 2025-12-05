import Feedback from '../models/Feedback.js';

export const getAllFeedback = async (req, res) => {
  try {
    const items = await Feedback.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    return res.json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
};

export const resolveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Feedback.findByIdAndUpdate(
      id,
      { resolved: true, resolvedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to resolve feedback' });
  }
};

