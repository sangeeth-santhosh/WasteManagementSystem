import express from 'express';
import { getAllUsers, updateUserStatus } from '../controllers/adminUserController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', adminAuth, getAllUsers);
router.patch('/:id/status', adminAuth, updateUserStatus);

export default router;

