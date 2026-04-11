export default function MatchCard({ match }) {
  const isCompleted = match.status === 'completed';
  const matchDate = new Date(match.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className={`glass-card p-5 relative overflow-hidden transition-all ${isCompleted ? 'opacity-70 grayscale-[0.2]' : ''}`}>
      {match.status === 'in_progress' && (
        <div className="absolute top-0 right-0 bg-brand-secondary text-white px-3 py-1 text-xs font-bold rounded-bl-lg animate-pulse">
          LIVE
        </div>
      )}
      
      <div className="flex justify-between text-xs text-white/50 font-medium mb-4 uppercase tracking-wider">
        <span>{matchDate} @ {match.time}</span>
        <span>{match.location}</span>
      </div>
      
      <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
        {/* Team A */}
        <div className="text-center w-2/5">
          <h4 className={`text-lg font-bold mb-1 truncate ${isCompleted && match.winner?._id === match.teamA?._id ? 'text-brand-green' : 'text-white'}`}>
            {match.teamA?.name || 'TBD'}
          </h4>
          {isCompleted && <div className="text-3xl font-black">{match.scoreA}</div>}
        </div>
        
        {/* VS */}
        <div className="text-center w-1/5 flex flex-col items-center">
          <div className="text-xs text-white/40 font-bold mb-1">VS</div>
          {isCompleted ? (
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded uppercase font-bold">FINAL</span>
          ) : (
            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${match.status === 'in_progress' ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-brand-primary/20 text-brand-primary'}`}>
              {match.status.replace('_', ' ')}
            </span>
          )}
        </div>
        
        {/* Team B */}
        <div className="text-center w-2/5">
          <h4 className={`text-lg font-bold mb-1 truncate ${isCompleted && match.winner?._id === match.teamB?._id ? 'text-brand-green' : 'text-white'}`}>
            {match.teamB?.name || 'TBD'}
          </h4>
          {isCompleted && <div className="text-3xl font-black">{match.scoreB}</div>}
        </div>
      </div>
    </div>
  );
}
