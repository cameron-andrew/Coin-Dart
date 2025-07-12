import React from 'react';
import PenaltyLeaderboard from './PenaltyLeaderboard';
import PenaltyTracker from './PenaltyTracker';

const PenaltyPanel = ({ players, onAddPenalty, onUndoPenalty }) => {
  return (
    <div className="card p-4 lg:p-6">
      <h3 className="text-lg lg:text-xl font-bold text-dart-yellow mb-4 text-center">
        💰 Penalty Tracker
      </h3>

      {/* Penalty Leaderboard */}
      <PenaltyLeaderboard players={players} />
      
      {/* Penalty Tracker */}
      <PenaltyTracker 
        players={players}
        onAddPenalty={onAddPenalty}
        onUndoPenalty={onUndoPenalty}
      />
    </div>
  );
};

export default PenaltyPanel; 