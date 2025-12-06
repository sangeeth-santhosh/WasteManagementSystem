import express from 'express';
import {
  createZone,
  getAllZones,
  getZoneById,
  updateZone,
  deleteZone,
} from '../controllers/zoneController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', adminAuth, createZone);
router.get('/', adminAuth, getAllZones);
router.get('/:id', adminAuth, getZoneById);
router.put('/:id', adminAuth, updateZone);
router.delete('/:id', adminAuth, deleteZone);

export default router;




