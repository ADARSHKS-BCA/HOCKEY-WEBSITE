import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TeamCard from '../components/TeamCard';
import MatchCard from '../components/MatchCard';
import Toast from '../components/Toast';

export default function Dashboard() {
  const { user, refetchUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const resMatches = await api.get('/matches?myMatches=true');
        setMatches(resMatches.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.team]);

  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;
    try {
      await api.delete(`/teams/${user.team._id}/leave`);
      await refetchUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave team');
    }
  };

  if (loading) return <div className="p-8 text-center text-white/50">Loading dashboard...</div>;

  const upcomingMatches = matches.filter(m => m.status !== 'completed');
  const pastMatches = matches.filter(m => m.status === 'completed');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1">Welcome back, {user.name}</h1>
          <p className="text-white/60">Here's what's happening with your hockey career.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-card px-6 py-3 text-center">
            <div className="text-xl font-bold text-brand-green">{user.wins}</div>
            <div className="text-xs text-white/50 uppercase tracking-widest">Wins</div>
          </div>
          <div className="glass-card px-6 py-3 text-center">
            <div className="text-xl font-bold text-brand-secondary">{user.losses}</div>
            <div className="text-xs text-white/50 uppercase tracking-widest">Losses</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Team Status */}
        <div className="md:col-span-1 space-y-6">
          <h2 className="text-xl font-bold border-b border-white/10 pb-2">Your Team</h2>
          
          {user.team ? (
            <TeamCard team={user.team} isMember={true} onLeave={handleLeaveTeam} />
          ) : (
            <div className="glass-card p-6 text-center border-dashed border-2 border-white/20">

              <h3 className="text-lg font-bold mb-2">No Team Yet</h3>
              <p className="text-white/50 text-sm mb-6">Join a team to participate in matches, or queue up solo.</p>
              
              <div className="flex flex-col gap-3">
                <Link to="/teams" className="btn-primary w-full inline-block">Find a Team</Link>
                <Link to="/matchmaking" className="btn-secondary w-full inline-block">Solo Matchmaking</Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Matches */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-6">Upcoming Matches</h2>
            {upcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {upcomingMatches.map(match => <MatchCard key={match._id} match={match} />)}
              </div>
            ) : (
              <div className="glass-card p-8 text-center text-white/50 bg-white/5">
                No upcoming matches scheduled.
              </div>
            )}
          </div>
          
          {pastMatches.length > 0 && (
            <div>
              <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-6">Recent Results</h2>
              <div className="space-y-4 opacity-80">
                {pastMatches.slice(0, 3).map(match => <MatchCard key={match._id} match={match} />)}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
    </div>
  );
}
