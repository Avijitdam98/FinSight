import express from 'express';
import Settings from '../models/Settings.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user settings
router.get('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        userId: req.user.id
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user settings
router.put('/', auth, async (req, res) => {
  try {
    const { preferences, security } = req.body;
    
    let settings = await Settings.findOne({ userId: req.user.id });
    
    if (!settings) {
      settings = new Settings({
        userId: req.user.id,
        preferences,
        security
      });
    } else {
      if (preferences) {
        settings.preferences = {
          ...settings.preferences.toObject(),
          ...preferences
        };
      }
      if (security) {
        settings.security = {
          ...settings.security.toObject(),
          ...security
        };
      }
    }
    
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
