import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Matchmaking() {
  const { user, refetchUser } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [polling, setPolling] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/matchmaking/status');
      setStatus(res.data);
      // Let's also refresh user just in case they got put into a team while waiting
      if (res.data.inQueue && !user.team) {
         const userRes = await api.get('/auth/me');
         if (userRes.data.team) {
            // They got matched!
            await refetchUser();
         }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Poll status when in queue
  useEffect(() => {
    let interval;
    if (status?.inQueue && !user.team) {
      interval = setInterval(() => {
        fetchStatus();
      }, 5000); // Check every 5 seconds
      setPolling(true);
    } else {
      setPolling(false);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status?.inQueue, user.team]);

  const handleJoinQueue = async () => {
    setError('');
    try {
      await api.post('/matchmaking/queue');
      setSuccess('Joined matchmaking queue!');
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join queue');
    }
  };

  const handleLeaveQueue = async () => {
    setError('');
    try {
      await api.delete('/matchmaking/queue');
      setSuccess('Left matchmaking queue.');
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave queue');
    }
  };

  if (loading) return <div className="p-8 text-center text-white/50">Loading queue status...</div>;

  // Render logic based on state
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
      <div className="glass-card w-full max-w-xl p-10 text-center relative overflow-hidden">
        
        {user.team ? (
          // Already in team
          <div className="animate-fade-in-up">

            <h1 className="text-3xl font-black mb-4">You are already on a team!</h1>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              You've been successfully assigned to a team. You cannot solo queue while on a roster.
            </p>
            <div className="bg-white/5 inline-block px-6 py-3 rounded-xl mb-8">
              <span className="text-sm text-white/50 block mb-1">Your Team</span>
              <span className="text-xl font-bold text-brand-primary">{user.team.name}</span>
            </div>
            <div>
              <Link to="/dashboard" className="btn-primary inline-block">Go to Dashboard</Link>
            </div>
          </div>
          
        ) : status.inQueue ? (
          // In queue waiting
          <div className="animate-fade-in-up">
             {/* Radar pulse effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square border-2 border-brand-primary/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 aspect-square border-2 border-brand-secondary/20 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] delay-700"></div>

            <div className="relative z-10">

              <h1 className="text-3xl font-black mb-2 text-brand-primary">Finding Match...</h1>
              <p className="text-white/60 mb-8">
                You are in the queue. Waiting for admin to trigger matchmaking or enough players to join.
              </p>
              
              <div className="bg-brand-dark/50 border border-white/10 p-4 rounded-xl inline-block mb-10 w-48">
                <div className="text-4xl font-black">{status.queueCount}</div>
                <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Players in Queue</div>
              </div>
              
              <div>
                <button onClick={handleLeaveQueue} className="btn-danger w-full max-w-xs">
                  Leave Queue
                </button>
              </div>
            </div>
          </div>
          
        ) : (
          // Not in queue
          <div className="animate-fade-in-up relative z-10">

            <h1 className="text-3xl font-black mb-4">Solo Matchmaking</h1>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Don't have a team? Join the solo queue and our algorithm will automatically match you with players of similar skill levels.
            </p>
            
            <div className="flex justify-between items-center bg-white/5 px-6 py-4 rounded-xl mb-8">
              <div className="text-left">
                <div className="text-sm font-bold">Current Queue</div>
                <div className="text-xs text-white/50">Players waiting</div>
              </div>
              <div className="text-2xl font-black text-brand-accent">
                {status.queueCount}
              </div>
            </div>

            <button onClick={handleJoinQueue} className="btn-primary w-full py-4 text-lg">
              Find a Team
            </button>
          </div>
        )}
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
    </div>
  );
}
