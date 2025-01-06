import express from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import Challenge from '../models/Challenge.js';
import Badge from '../models/Badge.js';

const router = express.Router();

// Get all transactions for a user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new transaction
router.post('/',
  [
    auth,
    body('type').isIn(['income', 'expense']),
    body('amount').isNumeric(),
    body('category').notEmpty(),
    body('date').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, amount, category, description, date } = req.body;

      const transaction = new Transaction({
        user: req.user.id,
        type,
        amount: Number(amount),
        category,
        description,
        date: date || Date.now()
      });

      await transaction.save();

      // Update related challenges
      const activeChallenges = await Challenge.find({
        userId: req.user.id,
        status: { $ne: 'completed' },
        endDate: { $gte: new Date() }
      });

      for (const challenge of activeChallenges) {
        if ((challenge.type === 'savings' && type === 'income' && category === 'Savings') ||
            (challenge.type === 'expense_reduction' && type === 'expense')) {
          
          // Calculate new progress
          const relatedTransactions = await Transaction.find({
            user: req.user.id,
            date: { $gte: challenge.startDate, $lte: challenge.endDate },
            type: challenge.type === 'savings' ? 'income' : 'expense',
            ...(challenge.type === 'savings' ? { category: 'Savings' } : {})
          });

          const currentAmount = relatedTransactions.reduce((sum, t) => sum + t.amount, 0);
          challenge.currentAmount = currentAmount;

          // Check if challenge is completed
          if (currentAmount >= challenge.targetAmount) {
            challenge.status = 'completed';
            
            // Create badge
            const badge = new Badge({
              userId: req.user.id,
              name: `${challenge.title} Champion`,
              description: `Completed the ${challenge.title} challenge`,
              icon: '🏆',
              category: 'challenge',
              completed: true
            });
            
            await badge.save();
          }

          await challenge.save();
        }
      }

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update transaction
router.put('/:id',
  [
    auth,
    body('type').optional().isIn(['income', 'expense']),
    body('amount').optional().isNumeric(),
    body('category').optional().notEmpty(),
    body('date').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user.id
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      const { type, amount, category, description, date } = req.body;

      // Update fields if they exist in the request
      if (type) transaction.type = type;
      if (amount) transaction.amount = Number(amount);
      if (category) transaction.category = category;
      if (description !== undefined) transaction.description = description;
      if (date) transaction.date = date;

      await transaction.save();
      res.json(transaction);
    } catch (error) {
      console.error('Error updating transaction:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
