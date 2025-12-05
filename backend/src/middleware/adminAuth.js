import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Admin token missing' });
    }

    const payload = jwt.verify(token, config.adminJwtSecret);

    if (payload.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    req.admin = payload;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
};

