import express from 'express';
import { getAllZones } from '../controllers/zoneController.js';

const router = express.Router();

router.get('/', getAllZones);

export default router;



