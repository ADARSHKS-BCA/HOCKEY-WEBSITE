import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative w-full min-h-screen">
      {/* Hero Section (100vh) */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-block bg-white/70 border border-gray-200 dark:bg-white/10 dark:border-white/20 rounded-full px-5 py-2 text-brand-primary text-sm font-bold mb-6 shadow-lg backdrop-blur-md">
            🏒 The Ultimate Hockey Manager
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight text-gray-900 dark:text-white drop-shadow-xl">
            Dominate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Ice.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 dark:text-white/90 font-medium mb-12 max-w-2xl mx-auto drop-shadow-md">
            Manage your teams and automatically matchmake directly from our portal.
          </p>
        </div>
      </section>

      {/* Main Single Page Content Flow - Transparent to merge with video */}
      <section className="relative w-full pb-32 pt-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Dashboard Card */}
            <div className="glass-card p-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform drop-shadow-sm">📊</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white drop-shadow-sm">My Dashboard</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-8 flex-grow font-medium">
                View your personal statistics, upcoming scheduled matches, and your active team roster.
              </p>
              <Link to={user ? "/dashboard" : "/login"} className="btn-primary w-full shadow-lg">
                {user ? "Enter Dashboard" : "Log in to Access"}
              </Link>
            </div>

            {/* Teams Registry Card */}
            <div className="glass-card p-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform drop-shadow-sm">👥</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white drop-shadow-sm">Teams Registry</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-8 flex-grow font-medium">
                Browse all active registered teams. Create a new franchise or use an invite code to join one.
              </p>
              <Link to="/teams" className="btn-primary w-full shadow-lg">
                View Teams
              </Link>
            </div>

            {/* Matchmaking Card */}
            <div className="glass-card p-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform drop-shadow-sm">🎲</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white drop-shadow-sm">Solo Matchmaking</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-8 flex-grow font-medium">
                No team? No problem. Queue up solo and let our skill-based algorithm auto-draft you into a team.
              </p>
              <Link to="/matchmaking" className="btn-primary w-full shadow-lg">
                Join Queue
              </Link>
            </div>

            {/* Leaderboard Card */}
            <div className="glass-card p-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform drop-shadow-sm">🏆</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white drop-shadow-sm">Global Leaderboard</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-8 flex-grow font-medium">
                Check out the Hall of Fame. Track the most successful franchises and top individual players.
              </p>
              <Link to="/leaderboard" className="btn-secondary w-full">
                View Rankings
              </Link>
            </div>

            {/* Admin Panel (If Admin) */}
            {user?.role === 'admin' && (
              <div className="glass-card p-10 flex flex-col items-center text-center border-2 border-brand-secondary/50 group hover:-translate-y-2 transition-all lg:col-span-2">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform animate-pulse drop-shadow-sm">⚙️</div>
                <h3 className="text-2xl font-bold mb-3 text-brand-secondary drop-shadow-sm">Admin Override</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-8 flex-grow font-medium">
                  Execute powerful automated scripts. Run matchmaking algorithms, auto-generate round-robin schedules, and email teams.
                </p>
                <Link to="/admin" className="btn-danger w-full max-w-sm shadow-lg">
                  Access Secure Panel
                </Link>
              </div>
            )}

            {/* Register Call To Action */}
            {!user && (
              <div className="glass-card p-10 flex flex-col items-center text-center bg-white/60 dark:bg-brand-primary/10 lg:col-span-2">
                <div className="text-5xl mb-4 drop-shadow-sm">🚀</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white drop-shadow-sm">Ready to hit the ice?</h3>
                <p className="text-gray-800 dark:text-gray-300 mb-6 max-w-lg mx-auto font-medium">
                  Sign up for a free account today to track your stats, join teams, and get notified about upcoming matches.
                </p>
                <Link to="/register" className="btn-primary px-10 py-3 text-lg shadow-xl hover:-translate-y-1 transition-transform">
                  Create Account Now
                </Link>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
