import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBadges, fetchChallenges, startChallenge, updateChallengeProgress } from '../store/slices/rewardsSlice';

const calculateEndDate = (days) => {
  if (!days || isNaN(days)) return null;
  const date = new Date();
  date.setDate(date.getDate() + parseInt(days));
  return date.toISOString();
};

const calculateRewardPoints = (targetAmount, type) => {
  if (!targetAmount || isNaN(targetAmount)) return 0;
  const basePoints = {
    savings: 10,
    expense_reduction: 8,
    streak: 5,
    custom: 6
  };
  return Math.floor(parseFloat(targetAmount) * basePoints[type] / 100);
};

const NewChallengeModal = ({ isOpen, onClose, onSubmit, initialValues }) => {
  const [formData, setFormData] = useState(initialValues);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.targetAmount || !formData.duration) {
      setError('Please fill in all required fields');
      return;
    }

    const startDate = new Date().toISOString();
    const endDate = calculateEndDate(formData.duration);
    const points = calculateRewardPoints(formData.targetAmount, formData.type);

    const challengeData = {
      ...formData,
      startDate,
      endDate,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      status: 'active',
      reward: {
        points
      }
    };

    try {
      await onSubmit(challengeData);
    } catch (err) {
      setError(err.message || 'Failed to create challenge');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-lg w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Start New Challenge</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                  Challenge Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                  Challenge Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="savings">Savings Challenge</option>
                  <option value="expense_reduction">Expense Reduction</option>
                  <option value="streak">Streak Challenge</option>
                  <option value="custom">Custom Challenge</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="365"
                  required
                />
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {formData.duration && !isNaN(formData.duration) ? 
                    `Challenge will end on: ${new Date(calculateEndDate(formData.duration)).toLocaleDateString()}` :
                    'Enter duration to see end date'}
                </p>
              </div>

              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Estimated reward points: {calculateRewardPoints(formData.targetAmount, formData.type)}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Start Challenge
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Rewards = () => {
  const dispatch = useDispatch();
  const { badges, challenges, loading } = useSelector((state) => state.rewards);
  const [showNewChallengeModal, setShowNewChallengeModal] = useState(false);
  const initialChallengeValues = {
    title: '',
    description: '',
    type: 'savings',
    targetAmount: '',
    duration: 30
  };

  // Fetch badges and challenges on mount and every 30 seconds
  useEffect(() => {
    dispatch(fetchBadges());
    dispatch(fetchChallenges());

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      dispatch(fetchChallenges());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleStartChallenge = async (challengeData) => {
    try {
      await dispatch(startChallenge(challengeData)).unwrap();
      setShowNewChallengeModal(false);
    } catch (error) {
      throw new Error(error.message || 'Failed to start challenge');
    }
  };

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'savings':
        return '💰';
      case 'expense_reduction':
        return '📉';
      case 'streak':
        return '🔥';
      case 'custom':
        return '🎯';
      default:
        return '🎯';
    }
  };

  const renderBadges = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <motion.div
          key={badge._id}
          className="bg-gray-800 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-4xl mb-2">{badge.icon}</div>
          <h3 className="text-gray-900 dark:text-white font-semibold mb-1">{badge.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{badge.description}</p>
          <div className="mt-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Earned {new Date(badge.earnedAt).toLocaleDateString()}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderChallenges = () => {
    if (!challenges.length) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No active challenges. Start one to begin earning rewards!
        </div>
      );
    }

    return challenges.map((challenge) => (
      <motion.div
        key={challenge._id}
        className="bg-gray-800 p-6 rounded-lg mb-4 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold">{challenge.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{challenge.description}</p>
          </div>
          <span className="text-2xl">{getBadgeIcon(challenge.type)}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round((challenge.currentAmount / challenge.targetAmount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 rounded-full h-2 transition-all duration-500"
              style={{ width: `${(challenge.currentAmount / challenge.targetAmount) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {new Date(challenge.endDate).toLocaleDateString()}
          </span>
          <span className="text-yellow-600 dark:text-yellow-500">🏆 {challenge.reward.points} points</span>
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rewards & Challenges</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewChallengeModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Start New Challenge
        </motion.button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Badges</h2>
        {renderBadges()}
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Active Challenges</h2>
        {renderChallenges()}
      </div>

      <NewChallengeModal
        isOpen={showNewChallengeModal}
        onClose={() => setShowNewChallengeModal(false)}
        onSubmit={handleStartChallenge}
        initialValues={initialChallengeValues}
      />
    </div>
  );
};

export default Rewards;
