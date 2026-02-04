import { Request, Response } from 'express';
import AssetAssignment from '../models/AssetAssignment.js';
import Asset from '../models/Asset.js';
import Contact from '../models/Contact.js';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Assign assets to a contact
// @route   POST /api/assignments
// @access  Private
export const assignAssets = async (req: AuthRequest, res: Response) => {
    const { contactId, assignments } = req.body;
    // assignments: [{ assetId, permissionLevel }]

    console.log('=== ASSIGN ASSETS REQUEST ===');
    console.log('User ID:', req.user?._id);
    console.log('Contact ID:', contactId);
    console.log('Assignments:', JSON.stringify(assignments, null, 2));

    try {
        // Verify contact belongs to user
        const contact = await Contact.findOne({ _id: contactId, userId: req.user._id });
        if (!contact) {
            console.log('Contact not found');
            res.status(404).json({ message: 'Contact not found' });
            return;
        }
        console.log('Contact found:', contact.name);

        // Verify all assets belong to user
        const assetIds = assignments.map((a: any) => a.assetId);
        const assets = await Asset.find({ _id: { $in: assetIds }, userId: req.user._id });
        
        console.log('Assets found:', assets.length, 'Expected:', assetIds.length);
        
        if (assets.length !== assetIds.length) {
            console.log('Asset count mismatch');
            res.status(404).json({ message: 'One or more assets not found' });
            return;
        }

        // Create assignments (will update if already exists due to unique index)
        const createdAssignments = [];
        for (const assignment of assignments) {
            console.log('Creating assignment for asset:', assignment.assetId);
            const newAssignment = await AssetAssignment.findOneAndUpdate(
                { contactId, assetId: assignment.assetId },
                {
                    userId: req.user._id,
                    contactId,
                    assetId: assignment.assetId,
                    permissionLevel: assignment.permissionLevel
                },
                { upsert: true, new: true }
            );
            console.log('Assignment created/updated:', newAssignment._id);
            createdAssignments.push(newAssignment);
        }

        console.log('Total assignments created:', createdAssignments.length);
        res.status(201).json(createdAssignments);
    } catch (error: any) {
        console.error('Assignment error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all asset assignments for a contact
// @route   GET /api/assignments/contact/:contactId
// @access  Private
export const getContactAssignments = async (req: AuthRequest, res: Response) => {
    try {
        const { contactId } = req.params;

        // Verify contact belongs to user
        const contact = await Contact.findOne({ _id: contactId, userId: req.user._id });
        if (!contact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }

        const assignments = await AssetAssignment.find({ contactId, userId: req.user._id })
            .populate('assetId')
            .populate('contactId');

        res.json(assignments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update assignment permission level
// @route   PUT /api/assignments/:id
// @access  Private
export const updateAssignment = async (req: AuthRequest, res: Response) => {
    const { permissionLevel } = req.body;

    try {
        const assignment = await AssetAssignment.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });

        if (!assignment) {
            res.status(404).json({ message: 'Assignment not found' });
            return;
        }

        assignment.permissionLevel = permissionLevel;
        const updatedAssignment = await assignment.save();

        res.json(updatedAssignment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remove asset assignment
// @route   DELETE /api/assignments/:id
// @access  Private
export const removeAssignment = async (req: AuthRequest, res: Response) => {
    try {
        const assignment = await AssetAssignment.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });

        if (!assignment) {
            res.status(404).json({ message: 'Assignment not found' });
            return;
        }

        await assignment.deleteOne();
        res.json({ message: 'Assignment removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all assignments for the logged in user (all contacts)
// @route   GET /api/assignments
// @access  Private
export const getAllAssignments = async (req: AuthRequest, res: Response) => {
    try {
        const assignments = await AssetAssignment.find({ userId: req.user._id })
            .populate('assetId')
            .populate('contactId');

        res.json(assignments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
