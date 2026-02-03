import express from 'express';
import { getUserProfile, updateUserProfile, checkIn } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/settings').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/checkin').post(protect, checkIn);

export default router;
