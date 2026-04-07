import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-card border-t border-white/10 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏒</span>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-brand-primary to-blue-400 bg-clip-text text-transparent">
              HockeyHub
            </span>
          </div>
          
          <div className="flex gap-6 text-sm text-white/60">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
          </div>
          
          <div className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} HockeyHub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
