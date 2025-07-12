import React from 'react';

const PenaltyLeaderboard = ({ players }) => {
  // Sort players by penalty amount (lowest first - they're winning)
  const sortedPlayersByPenalties = [...players].sort((a, b) => a.penalties - b.penalties);
  
  const getPenaltyLeader = () => {
    return sortedPlayersByPenalties[0];
  };

  const penaltyLeader = getPenaltyLeader();

  return (
    <div className="mb-4 lg:mb-6">
      <h4 className="text-base lg:text-lg font-semibold text-white mb-3 text-center">
        🏆 Penalty Leaderboard
      </h4>
      
      {/* Penalty Leader */}
      {penaltyLeader && (
        <div className="bg-dart-green bg-opacity-20 border border-dart-green rounded-lg p-3 mb-3 text-center">
          <div className="text-sm text-dart-green font-medium">💰 Lowest Penalties</div>
          <div className="text-lg font-bold text-white">{penaltyLeader.name}</div>
          <div className="text-sm text-gray-300">
            ${penaltyLeader.penalties.toFixed(2)}
          </div>
        </div>
      )}

      {/* Penalty Rankings */}
      <div className="space-y-2">
        {sortedPlayersByPenalties.map((player, index) => (
          <div key={player.id} className={`flex justify-between items-center rounded-lg p-2 ${
            index === 0 ? 'bg-dart-green bg-opacity-10 border border-dart-green' : 'bg-gray-700'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-dart-green text-white' : 
                index === 1 ? 'bg-gray-400 text-white' : 
                index === 2 ? 'bg-orange-600 text-white' : 'bg-gray-600 text-white'
              }`}>
                {index + 1}
              </div>
              <div className="font-medium text-white">{player.name}</div>
              {index === 0 && (
                <span className="text-xs bg-dart-green text-white px-2 py-1 rounded">
                  Leader
                </span>
              )}
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${
                index === 0 ? 'text-dart-green' : 'text-dart-red'
              }`}>
                ${player.penalties.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PenaltyLeaderboard; 