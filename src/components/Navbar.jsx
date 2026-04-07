import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 z-50 transition-colors duration-500">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🏒</span>
          <span className="text-xl font-heading font-bold bg-gradient-to-r from-brand-primary to-blue-500 dark:to-blue-400 bg-clip-text text-transparent">
            HockeyHub
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            title="Toggle Light/Dark Mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Auth Display */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{user.name}</span>
                <span className="text-xs text-gray-500 dark:text-white/50">{user.role === 'admin' ? 'Admin' : 'Player'}</span>
              </div>
              <button onClick={handleLogout} className="btn-secondary px-4 py-1.5 text-sm">
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="hidden md:inline-flex items-center text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white font-medium">
                Log In
              </Link>
              <Link to="/register" className="btn-primary px-5 py-1.5 text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
