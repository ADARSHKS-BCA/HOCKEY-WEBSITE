import { Link } from 'react-router-dom';

export default function TeamCard({ team, isMember = false, onLeave }) {
  return (
    <div className="glass-card p-6 flex flex-col h-full relative overflow-hidden">
      {isMember && (
        <div className="absolute top-0 right-0 bg-brand-primary text-brand-dark px-3 py-1 text-xs font-bold rounded-bl-lg z-10">
          YOUR TEAM
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
          <div className="flex gap-3 text-xs text-white/50 font-medium">
            <span className="bg-white/5 px-2 py-0.5 rounded">CODE: {team.code}</span>
            <span className="bg-white/5 px-2 py-0.5 rounded">PLAYERS: {team.players?.length || 0}/{team.maxPlayers}</span>
          </div>
        </div>
        <div className="text-3xl opacity-80 font-heading font-bold text-brand-primary">H</div>
      </div>
      
      <div className="flex-grow">
        <h4 className="text-sm font-semibold text-white/70 mb-2 uppercase tracking-wider">Roster</h4>
        <div className="space-y-2 mb-4">
          {team.players?.map(player => (
            <div key={player._id} className="flex justify-between items-center text-sm p-2 rounded bg-white/5">
              <span className="flex items-center gap-2 text-white/90">
                {player.name}
                {player._id === team.captain?._id && <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded uppercase font-bold">C</span>}
              </span>
              <span className={`text-xs capitalize ${
                player.skillLevel === 'pro' ? 'text-brand-secondary' : 
                player.skillLevel === 'intermediate' ? 'text-brand-primary' : 'text-white/40'
              }`}>{player.skillLevel}</span>
            </div>
          ))}
          {(!team.players || team.players.length === 0) && (
            <div className="text-sm text-white/40 italic text-center py-2">No players yet</div>
          )}
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="flex gap-3 text-sm">
          <span className="text-brand-green font-semibold">W: {team.wins || 0}</span>
          <span className="text-brand-secondary font-semibold">L: {team.losses || 0}</span>
        </div>
        
        {isMember && onLeave && (
          <button onClick={() => onLeave(team._id)} className="btn-danger text-xs px-3 py-1">
            Leave Team
          </button>
        )}
      </div>
    </div>
  );
}
