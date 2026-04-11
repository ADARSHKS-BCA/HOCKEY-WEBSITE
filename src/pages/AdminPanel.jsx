import { useState, useEffect } from 'react';
import api from '../api/axios';
import Toast from '../components/Toast';

export default function AdminPanel() {
  const [stats, setStats] = useState({ totalPlayers: 0, totalTeams: 0, totalMatches: 0, queuedPlayers: 0 });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [statsRes, matchesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/matches')
      ]);
      setStats(statsRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunMatchmaking = async () => {
    setError('');
    const size = prompt("Enter team size (e.g. 5):", "5");
    if (!size) return;

    try {
      const res = await api.post('/matchmaking/run', { teamSize: parseInt(size) });
      setSuccess(`Created ${res.data.teamsCreated} teams and ${res.data.matchesCreated} matches! Assigned ${res.data.playersAssigned} players.`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Matchmaking failed');
    }
  };

  const handleAutoGenerateMatches = async () => {
    setError('');
    try {
      const res = await api.post('/matches/auto');
      setSuccess(res.data.message);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Auto-generate failed');
    }
  };

  const handleNotifyMatch = async (matchId) => {
    setError('');
    try {
      const res = await api.post(`/notifications/match/${matchId}`);
      setSuccess(`Sent ${res.data.results?.length || 0} emails successfully.`);
      fetchData(); // Refresh to update 'notified' status
    } catch (err) {
      setError(err.response?.data?.message || 'Notification failed. Check Nodemailer settings.');
    }
  };

  const handleUpdateScore = async (match) => {
    const scoreA = prompt(`Enter score for ${match.teamA?.name}:`, match.scoreA);
    const scoreB = prompt(`Enter score for ${match.teamB?.name}:`, match.scoreB);
    if (scoreA === null || scoreB === null) return;

    try {
      await api.put(`/matches/${match._id}/score`, {
        scoreA: parseInt(scoreA),
        scoreB: parseInt(scoreB),
        status: 'completed'
      });
      setSuccess('Match completed and scores updated!');
      fetchData();
    } catch (err) {
      setError('Failed to update score');
    }
  };

  if (loading) return <div className="p-8 text-center text-white/50">Loading admin panel...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 text-brand-secondary">Admin Control Panel</h1>
        <p className="text-white/60">Manage matchmaking, teams, schedules, and notifications.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-black text-brand-primary mb-1">{stats.totalPlayers}</div>
          <div className="text-xs text-white/50 uppercase tracking-widest">Total Players</div>
        </div>
        <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-black text-white mb-1">{stats.totalTeams}</div>
          <div className="text-xs text-white/50 uppercase tracking-widest">Total Teams</div>
        </div>
        <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-black text-brand-green mb-1">{stats.totalMatches}</div>
          <div className="text-xs text-white/50 uppercase tracking-widest">Matches</div>
        </div>
        <div className="glass-card p-4 flex flex-col items-center justify-center text-center border border-brand-accent/30">
          <div className="text-3xl font-black text-brand-accent mb-1">{stats.queuedPlayers}</div>
          <div className="text-xs text-brand-accent/70 uppercase tracking-widest">In Solo Queue</div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="glass-card p-6 mb-10">
        <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={handleRunMatchmaking} className="btn-secondary flex-1 min-w-[200px]" disabled={stats.queuedPlayers < 2}>
            Run Matchmaking Draft
          </button>
          <button onClick={handleAutoGenerateMatches} className="btn-secondary flex-1 min-w-[200px]">
            Auto-generate Matches
          </button>
        </div>
        {stats.queuedPlayers < 2 && (
           <p className="text-xs text-brand-secondary mt-2">* Need at least 2 players in queue to run matchmaking</p>
        )}
      </div>

      {/* Matches Management */}
      <div>
        <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-6">Match Schedules & Scoring</h2>
        <div className="glass-card overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-3 text-xs uppercase text-white/50 font-medium">Date / Time</th>
                <th className="p-3 text-xs uppercase text-white/50 font-medium">Matchup</th>
                <th className="p-3 text-xs uppercase text-white/50 font-medium text-center">Score</th>
                <th className="p-3 text-xs uppercase text-white/50 font-medium text-center">Status</th>
                <th className="p-3 text-xs uppercase text-white/50 font-medium text-center">Notified</th>
                <th className="p-3 text-xs uppercase text-white/50 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map(match => (
                <tr key={match._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 text-sm">
                     <div className="font-semibold">{new Date(match.date).toLocaleDateString()}</div>
                     <div className="text-xs text-white/40">{match.time}</div>
                  </td>
                  <td className="p-3 text-sm">
                     <span className="font-bold">{match.teamA?.name || 'TBD'}</span>
                     <span className="text-white/30 text-xs mx-2">vs</span>
                     <span className="font-bold">{match.teamB?.name || 'TBD'}</span>
                  </td>
                  <td className="p-3 text-sm text-center font-black">
                     {match.scoreA} - {match.scoreB}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${
                      match.status === 'completed' ? 'border-brand-green/30 text-brand-green' : 
                      match.status === 'in_progress' ? 'border-brand-secondary/30 text-brand-secondary' : 'border-white/20 text-white/60'
                    }`}>
                      {match.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                     {match.notified ? 'Yes' : 'No'}
                  </td>
                  <td className="p-3 flex justify-end gap-2">
                     {match.status !== 'completed' && (
                        <button onClick={() => handleUpdateScore(match)} className="text-xs bg-brand-green/20 text-brand-green px-2 py-1 rounded hover:bg-brand-green hover:text-white transition-colors">
                           End & Score
                        </button>
                     )}
                     {!match.notified && match.status === 'upcoming' && (
                        <button onClick={() => handleNotifyMatch(match._id)} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-colors">
                           Email Team
                        </button>
                     )}
                  </td>
                </tr>
              ))}
              {matches.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-white/40">No matches found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
    </div>
  );
}
