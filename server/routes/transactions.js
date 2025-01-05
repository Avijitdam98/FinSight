import express from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

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

      const { type, amount, category, description, date, tags } = req.body;

      const transaction = new Transaction({
        user: req.user.id,
        type,
        amount,
        category,
        description,
        date: date || Date.now(),
        tags
      });

      await transaction.save();
      res.status(201).json(transaction);
    } catch (error) {
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

      const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user.id
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      const updateFields = ['type', 'amount', 'category', 'description', 'date', 'tags'];
      updateFields.forEach(field => {
        if (req.body[field] !== undefined) {
          transaction[field] = req.body[field];
        }
      });

      await transaction.save();
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
