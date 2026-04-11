import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-md border-b border-white/5 z-50 transition-all ease-apple-fluid duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-heading font-black bg-gradient-to-r from-brand-primary to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,212,255,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(0,212,255,0.7)] transition-all duration-300">
            HockeyHub
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Auth Display */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-white leading-tight drop-shadow-md">{user.name}</span>
                <span className="text-xs text-brand-primary/80 font-medium">{user.role === 'admin' ? 'Admin' : 'Player'}</span>
              </div>
              <button onClick={handleLogout} className="btn-secondary px-6 py-1.5 text-sm">
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex gap-5 items-center">
              <Link to="/login" className="hidden md:inline-flex items-center text-white/80 hover:text-white font-semibold transition-colors duration-300">
                Log In
              </Link>
              <Link to="/register" className="btn-primary px-6 py-2 text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
