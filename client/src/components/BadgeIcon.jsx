import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BadgeIcon = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { badges } = useSelector((state) => state.rewards);
  const recentBadges = badges.slice(0, 3); // Show last 3 badges

  return (
    <div className="relative">
      <motion.div
        className="cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => navigate('/rewards')}
      >
        <div className="relative">
          <span className="text-2xl">🏆</span>
          {badges.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {badges.length}
            </span>
          )}
        </div>
      </motion.div>

      {/* Tooltip */}
      {isHovered && recentBadges.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-3 z-50">
          <h4 className="text-white text-sm font-semibold mb-2">Recent Badges</h4>
          <div className="space-y-2">
            {recentBadges.map((badge) => (
              <div key={badge._id} className="flex items-center space-x-2">
                <span className="text-xl">{badge.icon}</span>
                <div>
                  <div className="text-white text-sm">{badge.name}</div>
                  <div className="text-gray-400 text-xs">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {badges.length > 3 && (
            <div className="mt-2 text-center text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
              View all {badges.length} badges
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BadgeIcon;
