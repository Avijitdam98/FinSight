import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { BiMoney } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const logoVariants = {
    hover: { 
      rotate: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md' : 'bg-white dark:bg-gray-800'
      } shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover="hover"
                variants={logoVariants}
                className="flex items-center"
              >
                <BiMoney className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
                  FinSight AI
                </span>
              </motion.div>
            </Link>
            
            <div className="hidden md:flex ml-10 items-center space-x-4">
              {isAuthenticated && (
                <>
                  <Link
                    to="/"
                    className="relative group px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>Dashboard</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                  <Link
                    to="/transactions"
                    className="relative group px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>Transactions</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                  <Link
                    to="/settings"
                    className="relative group px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>Settings</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors"
            >
              {darkMode ? '🌞' : '🌙'}
            </motion.button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  {user?.name || user?.email}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {/* Dark Mode Toggle for Mobile */}
              <div className="px-3 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors"
                >
                  {darkMode ? '🌞' : '🌙'}
                </button>
              </div>
              {isAuthenticated && (
                <>
                  <Link
                    to="/"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/transactions"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Transactions
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                </>
              )}
              {isAuthenticated ? (
                <div className="px-3 py-2">
                  <span className="block text-gray-700 dark:text-gray-300 mb-2">
                    {user?.name || user?.email}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-4 py-2 text-center rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
