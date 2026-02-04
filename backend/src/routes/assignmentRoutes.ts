import express from 'express';
import { 
    assignAssets, 
    getContactAssignments, 
    updateAssignment, 
    removeAssignment,
    getAllAssignments
} from '../controllers/assignmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, assignAssets)
    .get(protect, getAllAssignments);

router.route('/contact/:contactId')
    .get(protect, getContactAssignments);

router.route('/:id')
    .put(protect, updateAssignment)
    .delete(protect, removeAssignment);

export default router;
