import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['savings', 'expense_reduction', 'streak', 'custom'],
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed'],
    default: 'active'
  },
  reward: {
    points: {
      type: Number,
      required: true
    }
  }
}, { timestamps: true });

// Add index for better query performance
challengeSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Challenge', challengeSchema);
