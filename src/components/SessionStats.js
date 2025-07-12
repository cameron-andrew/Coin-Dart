import React, { useState } from 'react';

const SessionStats = ({ gameState, players }) => {
  const [showRoundHistory, setShowRoundHistory] = useState(false);

  const getPlayerWins = (playerId) => {
    return gameState.sessionStats.playerWins[playerId] || 0;
  };

  const getWinPercentage = (playerId) => {
    const wins = getPlayerWins(playerId);
    const totalRounds = gameState.sessionStats.totalRounds;
    return totalRounds > 0 ? ((wins / totalRounds) * 100).toFixed(1) : '0.0';
  };

  const getLeader = () => {
    let leader = null;
    let maxWins = 0;
    
    players.forEach(player => {
      const wins = getPlayerWins(player.id);
      if (wins > maxWins) {
        maxWins = wins;
        leader = player;
      }
    });
    
    return leader;
  };

  const leader = getLeader();

  return (
    <div className="card p-4 lg:p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg lg:text-xl font-bold text-dart-yellow">
          📊 Session Stats
        </h3>
        <div className="text-sm text-gray-400">
          Round {gameState.currentRound}
        </div>
      </div>

      {/* Current Session Overview */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 text-center mb-4">
          <div>
            <div className="text-2xl font-bold text-dart-blue">
              {gameState.sessionStats.totalRounds}
            </div>
            <div className="text-sm text-gray-400">Rounds Played</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-dart-green">
              {gameState.currentRound}
            </div>
            <div className="text-sm text-gray-400">Current Round</div>
          </div>
        </div>

        {/* Session Leader */}
        {leader && gameState.sessionStats.totalRounds > 0 && (
          <div className="bg-dart-green bg-opacity-20 border border-dart-green rounded-lg p-3 text-center">
            <div className="text-sm text-dart-green font-medium">Session Leader</div>
            <div className="text-lg font-bold text-white">{leader.name}</div>
            <div className="text-sm text-gray-300">
              {getPlayerWins(leader.id)} wins ({getWinPercentage(leader.id)}%)
            </div>
          </div>
        )}
      </div>

      {/* Player Win Statistics */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">Win Statistics</h4>
        <div className="space-y-2">
          {players.map(player => (
            <div key={player.id} className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="font-medium text-white">{player.name}</div>
                {leader && leader.id === player.id && (
                  <span className="text-xs bg-dart-green text-white px-2 py-1 rounded">
                    Leader
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-dart-green">
                  {getPlayerWins(player.id)}
                </div>
                <div className="text-xs text-gray-400">
                  {getWinPercentage(player.id)}% wins
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Round History Toggle */}
      {gameState.roundResults.length > 0 && (
        <div>
          <button
            onClick={() => setShowRoundHistory(!showRoundHistory)}
            className="btn-secondary w-full mb-4"
          >
            {showRoundHistory ? 'Hide' : 'Show'} Round History
          </button>

          {showRoundHistory && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {gameState.roundResults.slice().reverse().map((round, index) => (
                <div key={round.roundNumber} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold text-white">
                      Round {round.roundNumber}
                    </h5>
                    <div className="text-xs text-gray-400">
                      {new Date(round.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-dart-green font-medium mb-1">
                      🏆 Winner: {round.winner.name}
                    </div>
                    
                    <div className="text-xs text-gray-400 space-y-1">
                      {round.players.map(player => (
                        <div key={player.id} className="flex justify-between">
                          <span>{player.name}</span>
                          <span>
                            {player.finalScore} pts, {player.turns} turns, ${player.penalties}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionStats; 