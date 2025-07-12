import React from 'react';

const Scoreboard = ({ players, currentPlayerIndex, winner }) => {
  const getPlayerStatusColor = (player, index) => {
    if (winner && winner.id === player.id) {
      return 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/20';
    }
    if (index === currentPlayerIndex) {
      return 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/20';
    }
    return 'bg-slate-800/50 border-slate-700/50';
  };

  const getPlayerStatusText = (player, index) => {
    if (winner && winner.id === player.id) {
      return '🏆 WINNER!';
    }
    if (index === currentPlayerIndex) {
      return '🎯 Current Turn';
    }
    return 'Waiting';
  };

  return (
    <div className="card">
      <div className="card-header text-center">
        <h3 className="text-title text-slate-200 flex items-center justify-center">
          <span className="mr-2">📊</span>
          Scoreboard
        </h3>
      </div>
      
      <div className="card-body">
        <div className="space-y-3">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`border-2 rounded-xl p-4 transition-all duration-300 ${getPlayerStatusColor(player, index)}`}
            >
            <div className="flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-base lg:text-lg truncate">{player.name}</h4>
                <p className="text-xs lg:text-sm text-gray-300">
                  {getPlayerStatusText(player, index)}
                </p>
              </div>
              
              <div className="text-center mx-2">
                <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
                  {player.score}
                </div>
                <div className="text-xs text-gray-300">
                  {player.scoreHistory.length - 1} turns
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-red-400 font-semibold">
                  ${player.penalties.toFixed(2)}
                </div>
                <div className="text-caption">
                  penalties
                </div>
              </div>
            </div>
            
            {/* Recent Scores */}
            {player.turnHistory.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-caption mb-1">Recent turns:</div>
                <div className="flex space-x-2 overflow-x-auto">
                  {player.turnHistory.slice(-5).reverse().map((turn, turnIndex) => (
                    <div
                      key={turnIndex}
                      className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium ${
                        turn.isBust 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {turn.isBust ? 'BUST' : turn.dartScores.join('+')}
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          ))}
        </div>
        
        {/* Game Stats */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {players.reduce((sum, player) => sum + (player.turnHistory.length), 0)}
              </div>
              <div className="text-body">Total Turns</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {players.reduce((sum, player) => sum + player.turnHistory.filter(t => t.isBust).length, 0)}
              </div>
              <div className="text-body">Total Busts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard; 