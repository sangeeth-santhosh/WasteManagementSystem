import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const matches =
      email === config.adminEmail &&
      password === config.adminPassword &&
      config.adminEmail &&
      config.adminPassword;

    if (!matches) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = jwt.sign({ role: 'admin', email }, config.adminJwtSecret, {
      expiresIn: config.jwtExpiresIn || '7d',
    });

    return res.json({ success: true, data: { token, role: 'admin' } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Admin login failed' });
  }
};

