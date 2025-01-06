import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BadgePopup = ({ badge, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed bottom-4 right-4 bg-gray-800 rounded-lg p-4 shadow-lg max-w-sm"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <span className="text-4xl">{badge.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{badge.name}</h3>
            <p className="text-gray-300 text-sm">{badge.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            Earned {new Date(badge.earnedAt).toLocaleDateString()}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BadgePopup;
