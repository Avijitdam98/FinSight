import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import BadgePopup from './BadgePopup';

const BadgeNotification = () => {
  const [currentBadge, setCurrentBadge] = useState(null);
  const [queue, setQueue] = useState([]);
  const { badges } = useSelector((state) => state.rewards);

  useEffect(() => {
    // Check for new badges
    const newBadges = badges.filter(
      (badge) => new Date(badge.earnedAt) > new Date(Date.now() - 5000)
    );

    if (newBadges.length > 0) {
      setQueue((prev) => [...prev, ...newBadges]);
    }
  }, [badges]);

  useEffect(() => {
    if (queue.length > 0 && !currentBadge) {
      // Show next badge in queue
      setCurrentBadge(queue[0]);
      setQueue((prev) => prev.slice(1));

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setCurrentBadge(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [queue, currentBadge]);

  return (
    <AnimatePresence>
      {currentBadge && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <BadgePopup
            badge={currentBadge}
            onClose={() => setCurrentBadge(null)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeNotification;
