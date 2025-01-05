import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                FinSight
              </span>
            </Link>
            {isAuthenticated && (
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Dashboard
                </Link>
                <Link
                  to="/transactions"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Transactions
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
