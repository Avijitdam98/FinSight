import express from 'express';
import Badge from '../models/Badge.js';
import Challenge from '../models/Challenge.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all badges for a user
router.get('/badges', auth, async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.user.id });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all challenges for a user
router.get('/challenges', auth, async (req, res) => {
  try {
    const challenges = await Challenge.find({ userId: req.user.id });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start a new challenge
router.post('/challenges', auth, async (req, res) => {
  try {
    const { title, description, type, targetAmount, startDate, endDate } = req.body;
    
    const challenge = new Challenge({
      userId: req.user.id,
      title,
      description,
      type,
      targetAmount,
      startDate,
      endDate,
      reward: {
        points: calculateRewardPoints(targetAmount, type)
      }
    });

    const savedChallenge = await challenge.save();
    res.status(201).json(savedChallenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update challenge progress
router.patch('/challenges/:id/progress', auth, async (req, res) => {
  try {
    const { currentAmount } = req.body;
    const challenge = await Challenge.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    challenge.currentAmount = currentAmount;

    // Check if challenge is completed
    if (currentAmount >= challenge.targetAmount) {
      challenge.status = 'completed';
      
      // Award badge
      const badge = new Badge({
        userId: req.user.id,
        name: `${challenge.title} Champion`,
        description: `Completed the ${challenge.title} challenge`,
        icon: getBadgeIcon(challenge.type),
        category: 'challenge',
        completed: true
      });
      
      await badge.save();
    }

    const updatedChallenge = await challenge.save();
    res.json(updatedChallenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper functions
function calculateRewardPoints(targetAmount, type) {
  const basePoints = {
    savings: 10,
    expense_reduction: 8,
    streak: 5,
    custom: 6
  };
  
  return Math.floor(targetAmount * basePoints[type] / 100);
}

function getBadgeIcon(type) {
  const icons = {
    savings: '💰',
    expense_reduction: '📉',
    streak: '🔥',
    custom: '🎯'
  };
  
  return icons[type] || '🏆';
}

export default router;
