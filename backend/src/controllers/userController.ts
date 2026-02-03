import { Request, Response } from 'express';
import User from '../models/User.js';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get user profile/settings
// @route   GET /api/user/settings
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                checkInFrequency: user.checkInFrequency,
                gracePeriod: user.gracePeriod,
                lastCheckIn: user.lastCheckIn,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user settings
// @route   PUT /api/user/settings
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.checkInFrequency = req.body.checkInFrequency || user.checkInFrequency;
            user.gracePeriod = req.body.gracePeriod || user.gracePeriod;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                checkInFrequency: updatedUser.checkInFrequency,
                gracePeriod: updatedUser.gracePeriod,
                lastCheckIn: updatedUser.lastCheckIn,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    User Check-in
// @route   POST /api/user/checkin
// @access  Private
export const checkIn = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.lastCheckIn = new Date();
            await user.save();
            res.json({ message: 'Check-in successful', lastCheckIn: user.lastCheckIn });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
