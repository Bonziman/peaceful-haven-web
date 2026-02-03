import React from 'react';
import { WifiOff } from 'lucide-react';

interface StatusBadgeProps {
  online: boolean;
  playerCount?: number;
  maxPlayers?: number;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ online, playerCount, maxPlayers, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
      online 
        ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal' 
        : 'bg-red-500/10 border-red-500/20 text-red-400'
    } ${className}`}>
      <span className="relative flex h-2 w-2">
        {online && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${online ? 'bg-brand-teal' : 'bg-red-500'}`}></span>
      </span>
      
      {online ? (
        <span className="flex items-center gap-1.5">
          <span>Online</span>
          {playerCount !== undefined && (
            <>
              <span className="w-1 h-1 rounded-full bg-current opacity-50" />
              <span>{playerCount} / {maxPlayers || 100}</span>
            </>
          )}
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <WifiOff className="w-3 h-3" />
          <span>Offline</span>
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
