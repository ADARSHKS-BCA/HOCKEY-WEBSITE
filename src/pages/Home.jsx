import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HockeySequence from '../components/HockeySequence';
import Tilt from 'react-parallax-tilt';

export default function Home() {
  const { user } = useAuth();

  const tiltProps = {
    glareEnable: true,
    glareMaxOpacity: 0.15,
    glarePosition: "all",
    tiltMaxAngleX: 4,
    tiltMaxAngleY: 4,
    transitionSpeed: 400,
    scale: 1.02,
    className: "h-full"
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Scroll Animation */}
      <HockeySequence />

      {/* Hero Content - Scrolls Naturally */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up mt-20">
          <div className="inline-block bg-white/10 border border-white/20 rounded-full px-5 py-2 text-brand-primary text-sm font-bold mb-6 shadow-lg backdrop-blur-md">
            The Ultimate Hockey Manager
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Dominate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-500">Field.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium mb-12 max-w-2xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Manage your teams and automatically matchmake directly from our portal.
          </p>
        </div>
      </section>

      {/* Main Single Page Content Flow */}
      <section className="relative w-full pb-32 pt-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Dashboard Card */}
            <Tilt {...tiltProps}>
              <div className="glass-card p-12 h-full flex flex-col items-center text-center group">
                <h3 className="text-3xl font-black mb-4 text-white drop-shadow-md">My Dashboard</h3>
                <p className="text-white/70 mb-10 flex-grow font-medium text-lg leading-relaxed">
                  View your personal statistics, upcoming scheduled matches, and your active team roster.
                </p>
                <Link to={user ? "/dashboard" : "/login"} className="btn-primary w-full text-center">
                  {user ? "Enter Dashboard" : "Log in to Access"}
                </Link>
              </div>
            </Tilt>

            {/* Teams Registry Card */}
            <Tilt {...tiltProps}>
              <div className="glass-card p-12 h-full flex flex-col items-center text-center group">
                <h3 className="text-3xl font-black mb-4 text-white drop-shadow-md">Teams Registry</h3>
                <p className="text-white/70 mb-10 flex-grow font-medium text-lg leading-relaxed">
                  Browse all active registered teams. Create a new franchise or use an invite code to join one.
                </p>
                <Link to="/teams" className="btn-primary w-full text-center">
                  View Teams
                </Link>
              </div>
            </Tilt>

            {/* Matchmaking Card */}
            <Tilt {...tiltProps}>
              <div className="glass-card p-12 h-full flex flex-col items-center text-center group">
                <h3 className="text-3xl font-black mb-4 text-white drop-shadow-md">Solo Matchmaking</h3>
                <p className="text-white/70 mb-10 flex-grow font-medium text-lg leading-relaxed">
                  No team? No problem. Queue up solo and let our skill-based algorithm auto-draft you into a team.
                </p>
                <Link to="/matchmaking" className="btn-primary w-full text-center">
                  Join Queue
                </Link>
              </div>
            </Tilt>

            {/* Leaderboard Card */}
            <Tilt {...tiltProps}>
              <div className="glass-card p-12 h-full flex flex-col items-center text-center group">
                <h3 className="text-3xl font-black mb-4 text-white drop-shadow-md">Global Leaderboard</h3>
                <p className="text-white/70 mb-10 flex-grow font-medium text-lg leading-relaxed">
                  Check out the Hall of Fame. Track the most successful franchises and top individual players.
                </p>
                <Link to="/leaderboard" className="btn-primary w-full text-center">
                  View Rankings
                </Link>
              </div>
            </Tilt>

            {/* Admin Panel (If Admin) */}
            {user?.role === 'admin' && (
              <Tilt {...tiltProps} className="lg:col-span-2 h-full">
                <div className="glass-card p-12 h-full flex flex-col items-center text-center group border border-brand-secondary/30">
                  <h3 className="text-3xl font-black mb-4 text-brand-secondary drop-shadow-md">Admin Override</h3>
                  <p className="text-white/70 mb-10 flex-grow font-medium text-lg leading-relaxed">
                    Execute powerful automated scripts. Run matchmaking algorithms, auto-generate round-robin schedules, and email teams.
                  </p>
                  <Link to="/admin" className="btn-danger w-full max-w-sm text-center">
                    Access Secure Panel
                  </Link>
                </div>
              </Tilt>
            )}

            {/* Register Call To Action */}
            {!user && (
              <Tilt {...tiltProps} className="lg:col-span-2 h-full">
                <div className="glass-card p-14 h-full flex flex-col items-center text-center group border-brand-primary/30">
                  <h3 className="text-4xl font-black mb-6 text-white drop-shadow-md">Ready to hit the field?</h3>
                  <p className="text-white/70 mb-10 max-w-xl mx-auto font-medium text-lg leading-relaxed">
                    Sign up for a free account today to track your stats, join teams, and get notified about upcoming matches.
                  </p>
                  <Link to="/register" className="btn-primary px-12 py-3.5 text-lg">
                    Create Account Now
                  </Link>
                </div>
              </Tilt>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
