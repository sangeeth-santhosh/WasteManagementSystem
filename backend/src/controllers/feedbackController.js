import Feedback from '../models/Feedback.js';

export const createFeedback = async (req, res) => {
  try {
    const { message, subject } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      message,
      subject: subject || '',
    });

    return res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    console.error('createFeedback error', error);
    return res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
};

export const getMyFeedback = async (req, res) => {
  try {
    const items = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error('getMyFeedback error', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
};

