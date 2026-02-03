import { Request, Response } from 'express';
import Asset from '../models/Asset.js';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get all assets for logged in user
// @route   GET /api/assets
// @access  Private
export const getAssets = async (req: AuthRequest, res: Response) => {
    try {
        const assets = await Asset.find({ userId: req.user._id });
        res.json(assets);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new asset
// @route   POST /api/assets
// @access  Private
export const createAsset = async (req: AuthRequest, res: Response) => {
    const { name, type, value, description, accessInstructions, accessKey, sensitivity } = req.body;

    try {
        const asset = new Asset({
            userId: req.user._id,
            name,
            type,
            value,
            description,
            accessInstructions,
            accessKey, // In real app, encrypt this!
            sensitivity
        });

        const createdAsset = await asset.save();
        res.status(201).json(createdAsset);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private
export const deleteAsset = async (req: AuthRequest, res: Response) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (asset) {
            if (asset.userId.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }
            await asset.deleteOne();
            res.json({ message: 'Asset removed' });
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
