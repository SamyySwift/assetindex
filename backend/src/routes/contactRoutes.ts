import express from 'express';
import { getContacts, createContact } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getContacts).post(protect, createContact);

export default router;
