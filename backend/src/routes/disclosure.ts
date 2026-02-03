import express from 'express';
import Contact from '../models/Contact';
import User from '../models/User';
import Asset from '../models/Asset';

const router = express.Router();

// @desc    Get disclosed assets for a contact
// @route   GET /api/disclosure/:id?key=userId
// @access  Public (Secured by ID + Key + Logic)
router.get('/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    const userId = req.query.key;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Missing access key' });
    }

    // Validate Contact and User link
    const contact = await Contact.findById(contactId);
    const user = await User.findById(userId);

    if (!contact || !user || contact.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Access Denied' });
    }

    // Check if assets are released
    if (!user.assetsReleased) {
      return res.status(403).json({ success: false, error: 'Disclosure Not Authorized' });
    }

    // Fetch Assets
    const assets = await Asset.find({ userId: user._id });

    res.json({
      success: true,
      data: {
        contact: { name: contact.name },
        user: { name: user.name },
        assets
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
