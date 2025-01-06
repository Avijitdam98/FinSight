import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* This div adds space below the fixed navbar */}
      <div className="pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default Layout;
