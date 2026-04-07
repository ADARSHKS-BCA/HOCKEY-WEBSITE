import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Leaderboard() {
  const [data, setData] = useState({ topPlayers: [], topTeams: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' or 'players'

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-white/50">Loading leaderboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-[#ffd60a] to-[#ff2d55] bg-clip-text text-transparent">Hall of Fame</h1>
        <p className="text-white/60">The top performing teams and solo players in the HockeyHub league based on total wins.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-white/5 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-6 py-2 rounded-md font-semibold text-sm transition-all ${
              activeTab === 'teams' ? 'bg-brand-primary text-brand-dark shadow-md' : 'text-white/50 hover:text-white'
            }`}
          >
            Top Teams
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`px-6 py-2 rounded-md font-semibold text-sm transition-all ${
              activeTab === 'players' ? 'bg-brand-primary text-brand-dark shadow-md' : 'text-white/50 hover:text-white'
            }`}
          >
            Top Players
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto glass-card overflow-hidden">
        {activeTab === 'teams' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-white/50 font-medium text-xs uppercase text-center w-16">Rank</th>
                <th className="p-4 text-white/50 font-medium text-xs uppercase">Team</th>
                <th className="p-4 text-white/50 font-medium text-xs uppercase text-center w-24">Players</th>
                <th className="p-4 text-brand-green font-bold text-xs uppercase text-center w-20">Wins</th>
                <th className="p-4 text-brand-secondary font-bold text-xs uppercase text-center w-20">Losses</th>
                <th className="p-4 text-white/50 font-medium text-xs uppercase text-center w-20">Win %</th>
              </tr>
            </thead>
            <tbody>
              {data.topTeams.map((team, idx) => {
                const total = team.wins + team.losses;
                const winRate = total === 0 ? 0 : Math.round((team.wins / total) * 100);
                
                return (
                  <tr key={team._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-center">
                      {idx === 0 ? <span className="text-2xl">🥇</span> : 
                       idx === 1 ? <span className="text-2xl">🥈</span> : 
                       idx === 2 ? <span className="text-2xl">🥉</span> : 
                       <span className="font-bold text-white/50">{idx + 1}</span>}
                    </td>
                    <td className="p-4 font-bold text-lg text-white">{team.name}</td>
                    <td className="p-4 text-center text-white/60">{team.players?.length || 0}</td>
                    <td className="p-4 text-center font-bold text-brand-green">{team.wins}</td>
                    <td className="p-4 text-center font-bold text-brand-secondary">{team.losses}</td>
                    <td className="p-4 text-center text-white/70">{winRate}%</td>
                  </tr>
                );
              })}
              {data.topTeams.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-white/40">No teams have played yet</td></tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'players' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-white/50 font-medium text-xs uppercase text-center w-16">Rank</th>
                <th className="p-4 text-white/50 font-medium text-xs uppercase">Player</th>
                <th className="p-4 text-white/50 font-medium text-xs uppercase">Team</th>
                <th className="p-4 text-white/50 font-medium text-xs uppercase text-center">Skill</th>
                <th className="p-4 text-brand-green font-bold text-xs uppercase text-center w-20">Wins</th>
              </tr>
            </thead>
            <tbody>
              {data.topPlayers.map((player, idx) => (
                <tr key={player._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-center">
                    {idx === 0 ? <span className="text-xl">👑</span> : 
                     <span className="font-bold text-white/50">{idx + 1}</span>}
                  </td>
                  <td className="p-4 font-bold text-white">{player.name}</td>
                  <td className="p-4 text-white/70">{player.team?.name || <span className="italic text-white/30">Free Agent</span>}</td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${
                      player.skillLevel === 'pro' ? 'border-brand-secondary text-brand-secondary' : 
                      player.skillLevel === 'intermediate' ? 'border-brand-primary text-brand-primary' : 'border-white/20 text-white/40'
                    }`}>
                      {player.skillLevel}
                    </span>
                  </td>
                  <td className="p-4 text-center font-black text-brand-green">{player.wins}</td>
                </tr>
              ))}
              {data.topPlayers.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-white/40">No players found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
