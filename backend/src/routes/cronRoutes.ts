import express from 'express';
import { runMonitor } from '../controllers/cronController.js';

const router = express.Router();

router.get('/monitor', runMonitor);

export default router;
