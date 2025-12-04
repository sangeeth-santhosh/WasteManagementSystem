// TODO: Install jsonwebtoken package: npm install jsonwebtoken
// import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Generate JWT token for user
 * @param {Object} payload - Token payload (usually user ID)
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  // TODO: Implement JWT token generation
  // return jwt.sign(payload, config.jwtSecret, {
  //   expiresIn: config.jwtExpiresIn,
  // });
  
  // Placeholder: Return a simple token (NOT SECURE - TODO: implement JWT)
  // In production, use the commented code above
  return `token_${payload.userId}_${Date.now()}`;
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  // TODO: Implement JWT token verification
  // return jwt.verify(token, config.jwtSecret);
  
  // Placeholder: Simple token parsing (NOT SECURE - TODO: implement JWT)
  // In production, use the commented code above
  if (token && token.startsWith('token_')) {
    const parts = token.split('_');
    return { userId: parts[1] };
  }
  throw new Error('Invalid token');
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    return null;
  }

  // Format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  return null;
};

