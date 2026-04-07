import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TeamCard from '../components/TeamCard';
import Toast from '../components/Toast';

export default function Teams() {
  const { user, refetchUser } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Create / Join state
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (err) {
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/teams', { name: newTeamName });
      setSuccess('Team created successfully!');
      setIsCreating(false);
      setNewTeamName('');
      await refetchUser();
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/teams/join', { code: joinCode });
      setSuccess('Joined team successfully!');
      setJoinCode('');
      await refetchUser();
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join team');
    }
  };

  if (loading) return <div className="p-8 text-center text-white/50">Loading teams...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-white/10 pb-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-black mb-2">Teams Registry</h1>
          <p className="text-white/60">Browse all active teams, join an existing squad using a code, or start your own franchise.</p>
        </div>
        
        {!user.team && (
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsCreating(!isCreating)} 
              className={`btn-${isCreating ? 'secondary' : 'primary'} flex-1 md:flex-none`}
            >
              {isCreating ? 'Cancel' : 'Create Team'}
            </button>
          </div>
        )}
      </div>

      {/* Create / Join Forms */}
      {!user.team && (
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Create Form */}
          {isCreating && (
            <div className="glass-card p-6 animate-fade-in-up">
              <h3 className="text-xl font-bold mb-4">Create New Team</h3>
              <form onSubmit={handleCreateTeam} className="flex gap-4">
                <input
                  type="text"
                  required
                  placeholder="Enter Team Name"
                  className="form-input flex-grow"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
                <button type="submit" className="btn-primary whitespace-nowrap">Create</button>
              </form>
            </div>
          )}
          
          {/* Join Form */}
          <div className={`glass-card p-6 ${!isCreating ? 'col-span-full max-w-2xl mx-auto w-full' : ''}`}>
            <h3 className="text-xl font-bold mb-4">Join via Code</h3>
            <form onSubmit={handleJoinTeam} className="flex gap-4">
              <input
                type="text"
                required
                placeholder="6-Digit Team Code"
                className="form-input flex-grow uppercase"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                maxLength={6}
              />
              <button type="submit" className="btn-secondary whitespace-nowrap text-brand-primary border-brand-primary/50">Join Team</button>
            </form>
          </div>
        </div>
      )}

      {/* Teams Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <TeamCard 
            key={team._id} 
            team={team} 
            isMember={user.team?._id === team._id} 
          />
        ))}
        {teams.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/40">
            No teams found. Be the first to create one!
          </div>
        )}
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
    </div>
  );
}
