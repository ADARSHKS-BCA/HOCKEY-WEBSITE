import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-50 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-md border-t border-white/5 pt-16 pb-8 mt-auto transition-all ease-apple-fluid duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-block w-max group">
              <span className="text-2xl font-heading font-black bg-gradient-to-r from-brand-primary to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,212,255,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(0,212,255,0.7)] transition-all duration-300">
                HockeyHub
              </span>
            </Link>
            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm">
              The premium management portal for field hockey enthusiasts. Matchmake, manage your teams, and dominate the ranking leaderboards.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3 md:items-end">
            <h4 className="text-white font-bold mb-2">Platform</h4>
            <Link to="/" className="text-sm font-medium text-white/50 hover:text-white transition-colors duration-300">Home</Link>
            <Link to="/leaderboard" className="text-sm font-medium text-white/50 hover:text-white transition-colors duration-300">Global Leaderboard</Link>
            <Link to="/matchmaking" className="text-sm font-medium text-white/50 hover:text-white transition-colors duration-300">Solo Matchmaking</Link>
            <Link to="/teams" className="text-sm font-medium text-white/50 hover:text-white transition-colors duration-300">Teams Registry</Link>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex justify-center items-center gap-4 border-t border-white/5">
          <div className="text-xs font-semibold text-white/40 tracking-wider">
            &copy; {new Date().getFullYear()} HOCKEYHUB. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
}
