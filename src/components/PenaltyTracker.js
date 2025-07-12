import React from 'react';

const PenaltyTracker = ({ players, onAddPenalty, onUndoPenalty }) => {
  const penalties = [
    { amount: 1, reason: 'Hit Outer Board', color: 'bg-dart-yellow', icon: '🎯' },
    { amount: 5, reason: 'Bust', color: 'bg-dart-red', icon: '💥' },
    { amount: 10, reason: 'Missed Board', color: 'bg-purple-600', icon: '❌' }
  ];

  const handlePenaltyClick = (playerId, amount, reason) => {
    onAddPenalty(playerId, amount, reason);
  };

  const handleUndoPenalty = (playerId) => {
    onUndoPenalty(playerId);
  };

  // Sort players by penalty amount (lowest first - they're winning)
  const sortedPlayersByPenalties = [...players].sort((a, b) => a.penalties - b.penalties);
  
  const getPenaltyRank = (playerId) => {
    return sortedPlayersByPenalties.findIndex(player => player.id === playerId) + 1;
  };

  return (
    <div className="space-y-4">
      {players.map(player => (
        <div key={player.id} className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-white">{player.name}</h4>
              <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">
                #{getPenaltyRank(player.id)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-dart-red">
                ${player.penalties.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                {player.penaltyHistory.length} penalties
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {penalties.map(penalty => (
              <button
                key={penalty.reason}
                onClick={() => handlePenaltyClick(player.id, penalty.amount, penalty.reason)}
                className={`${penalty.color} hover:opacity-80 text-white font-medium py-3 px-2 rounded-lg transition-opacity text-xs sm:text-sm`}
              >
                <div className="text-base sm:text-lg mb-1">{penalty.icon}</div>
                <div className="text-xs font-bold">${penalty.amount}</div>
                <div className="text-xs opacity-90 leading-tight">{penalty.reason.split(' ').map((word, i) => (
                  <div key={i}>{word}</div>
                ))}</div>
              </button>
            ))}
          </div>
          
          {/* Recent Penalties */}
          {player.penaltyHistory.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-400">Recent Penalties:</div>
                <button
                  onClick={() => handleUndoPenalty(player.id)}
                  className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded transition-colors"
                  title="Undo last penalty"
                >
                  ↶ Undo
                </button>
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {player.penaltyHistory.slice(-3).reverse().map((penalty, index) => (
                  <div key={index} className={`flex justify-between text-xs ${
                    penalty.reason === 'Remaining Score' ? 'bg-orange-900 bg-opacity-50 px-2 py-1 rounded' : ''
                  }`}>
                    <span className="text-gray-300">
                      {penalty.reason === 'Remaining Score' ? '🎯 Remaining Score' : penalty.reason}
                    </span>
                    <span className={penalty.reason === 'Remaining Score' ? 'text-orange-400' : 'text-dart-red'}>
                      ${penalty.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Total Penalties */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-300">Total Penalties:</span>
          <span className="text-2xl font-bold text-dart-red">
            ${players.reduce((sum, player) => sum + player.penalties, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PenaltyTracker; 