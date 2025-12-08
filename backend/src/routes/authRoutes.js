import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getCurrentUser,
  logout,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { runValidation } from "../middleware/validate.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  [
    body("name").isLength({ min: 1, max: 120 }).withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6, max: 100 })
      .withMessage("Password must be at least 6 characters"),
  ],
  runValidation,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6, max: 100 })
      .withMessage("Password is required"),
  ],
  runValidation,
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get("/me", authenticate, getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", authenticate, logout);

/**
 * @route   PUT /api/auth/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  "/me",
  authenticate,
  [
    body("name")
      .optional()
      .isLength({ min: 1, max: 120 })
      .withMessage("Name must be between 1 and 120 characters"),
  ],
  runValidation,
  updateProfile
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  "/change-password",
  authenticate,
  [
    body("currentPassword")
      .isLength({ min: 6, max: 100 })
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6, max: 100 })
      .withMessage("New password must be at least 6 characters"),
  ],
  runValidation,
  changePassword
);

export default router;
