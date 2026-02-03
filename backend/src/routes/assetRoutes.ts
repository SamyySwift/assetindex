import express from 'express';
import { getAssets, createAsset, deleteAsset } from '../controllers/assetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getAssets).post(protect, createAsset);
router.route('/:id').delete(protect, deleteAsset);

export default router;
