import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email role isActive createdAt');
    return res.json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;

    const update = {};
    if (typeof isActive === 'boolean') update.isActive = isActive;
    if (role) update.role = role;

    const updated = await User.findByIdAndUpdate(id, update, { new: true }).select('name email role isActive createdAt');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

