import { Request, Response } from 'express';
import Contact from '../models/Contact.js';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get all contacts for logged in user
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req: AuthRequest, res: Response) => {
    try {
        const contacts = await Contact.find({ userId: req.user._id });
        res.json(contacts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
export const createContact = async (req: AuthRequest, res: Response) => {
    const { name, email, relationship, phone } = req.body;

    try {
        // Check if contact already exists for this user? (Optional)
        
        const contact = new Contact({
            userId: req.user._id,
            name,
            email,
            relationship,
            phone
        });

        const createdContact = await contact.save();
        res.status(201).json(createdContact);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
