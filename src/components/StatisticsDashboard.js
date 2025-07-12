import React, { useState, useMemo } from 'react';

const StatisticsDashboard = ({ 
  playerProfiles, 
  gameHistory, 
  analytics, 
  getPlayerStatistics,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'players', label: 'Players', icon: '👥' },
    { id: 'games', label: 'Games', icon: '🎯' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // Calculate overview statistics
  const overviewStats = useMemo(() => {
    const totalPlayers = Object.keys(playerProfiles).length;
    const totalGames = gameHistory.length;
    const recentGames = gameHistory.slice(0, 10);
    
    const playerStats = Object.values(playerProfiles).map(profile => ({
      ...profile,
      detailedStats: getPlayerStatistics(profile.id)
    }));

    const topPlayer = playerStats.reduce((best, current) => 
      (current.stats.winRate > (best?.stats.winRate || 0)) ? current : best
    , null);

    const averageGameDuration = gameHistory.length > 0 
      ? gameHistory.reduce((sum, game) => sum + (game.duration || 0), 0) / gameHistory.length 
      : 0;

    return {
      totalPlayers,
      totalGames,
      recentGames: recentGames.length,
      topPlayer,
      averageGameDuration,
      playerStats
    };
  }, [playerProfiles, gameHistory, getPlayerStatistics]);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-compact p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{overviewStats.totalGames}</div>
          <div className="text-sm text-gray-400">Total Games</div>
        </div>
        <div className="card-compact p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{overviewStats.totalPlayers}</div>
          <div className="text-sm text-gray-400">Players</div>
        </div>
        <div className="card-compact p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{overviewStats.recentGames}</div>
          <div className="text-sm text-gray-400">Recent Games</div>
        </div>
        <div className="card-compact p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">
            {Math.round(overviewStats.averageGameDuration / 60)}m
          </div>
          <div className="text-sm text-gray-400">Avg Duration</div>
        </div>
      </div>

      {/* Top Player */}
      {overviewStats.topPlayer && (
        <div className="card-compact p-4">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="mr-2">🏆</span>
            Top Player
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{overviewStats.topPlayer.avatar}</div>
              <div>
                <div className="font-semibold text-white">{overviewStats.topPlayer.name}</div>
                <div className="text-sm text-gray-400">
                  {overviewStats.topPlayer.stats.totalGames} games played
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-emerald-400">
                {overviewStats.topPlayer.stats.winRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Win Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card-compact p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <span className="mr-2">📅</span>
          Recent Games
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {gameHistory.slice(0, 5).map(game => (
            <div key={game.id} className="flex justify-between items-center p-2 bg-gray-700 rounded">
              <div>
                <div className="font-medium text-white">{game.winner.name} won</div>
                <div className="text-sm text-gray-400">
                  {game.players.length} players • {new Date(game.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {Math.round(game.duration / 60)}m
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlayers = () => (
    <div className="space-y-4">
      {Object.values(playerProfiles).map(profile => {
        const stats = getPlayerStatistics(profile.id);
        return (
          <div 
            key={profile.id} 
            className="card-compact p-4 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => setSelectedPlayer(profile)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{profile.avatar}</div>
                <div>
                  <div className="font-semibold text-white">{profile.name}</div>
                  <div className="text-sm text-gray-400">
                    Last played: {new Date(profile.lastPlayed).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400">
                  {stats?.winRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">
                  {stats?.totalGames} games
                </div>
              </div>
            </div>
            
            {/* Player Stats Preview */}
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-medium text-blue-400">
                  {stats?.averageScore.toFixed(1)}
                </div>
                <div className="text-xs text-gray-400">Avg Score</div>
              </div>
              <div>
                <div className="text-sm font-medium text-purple-400">
                  {stats?.bestGame}
                </div>
                <div className="text-xs text-gray-400">Best Game</div>
              </div>
              <div>
                <div className="text-sm font-medium text-red-400">
                  ${stats?.totalPenalties.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">Penalties</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderGames = () => (
    <div className="space-y-4">
      {gameHistory.map(game => (
        <div key={game.id} className="card-compact p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-semibold text-white flex items-center">
                <span className="mr-2">🏆</span>
                {game.winner.name} won
              </div>
              <div className="text-sm text-gray-400">
                {new Date(game.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">
                {Math.round(game.duration / 60)}m duration
              </div>
              <div className="text-sm text-gray-400">
                {game.players.length} players
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {game.players.map(player => (
              <div key={player.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <span className={player.won ? 'text-emerald-400' : 'text-gray-400'}>
                    {player.won ? '🏆' : '•'}
                  </span>
                  <span className="text-white">{player.name}</span>
                </div>
                <div className="text-gray-400">
                  {player.finalScore} pts • {player.turns} turns • ${player.penalties}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Popular Features */}
      <div className="card-compact p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Popular Features</h3>
        <div className="space-y-2">
          {Object.entries(analytics.popularFeatures).map(([feature, count]) => (
            <div key={feature} className="flex justify-between items-center">
              <span className="text-gray-300 capitalize">{feature.replace('_', ' ')}</span>
              <span className="text-blue-400 font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Session Stats */}
      <div className="card-compact p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Session Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Games:</span>
            <span className="text-white">{analytics.totalGames}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Activity:</span>
            <span className="text-white">
              {analytics.sessionStats.lastActivity 
                ? new Date(analytics.sessionStats.lastActivity).toLocaleString()
                : 'Never'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Player Detail Modal
  const renderPlayerDetail = () => {
    if (!selectedPlayer) return null;
    
    const stats = getPlayerStatistics(selectedPlayer.id);
    const playerGames = gameHistory.filter(game => 
      game.players.some(p => p.id === selectedPlayer.id)
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{selectedPlayer.avatar}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPlayer.name}</h2>
                  <p className="text-gray-400">
                    Member since {new Date(selectedPlayer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlayer(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{stats?.totalWins}</div>
                <div className="text-sm text-gray-400">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats?.totalGames}</div>
                <div className="text-sm text-gray-400">Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{stats?.averageScore.toFixed(1)}</div>
                <div className="text-sm text-gray-400">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{stats?.bestGame}</div>
                <div className="text-sm text-gray-400">Best Game</div>
              </div>
            </div>

            {/* Recent Performance */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Recent Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="card-compact p-3">
                  <div className="text-lg font-bold text-blue-400">{stats?.recentAverage.toFixed(1)}</div>
                  <div className="text-sm text-gray-400">Recent Avg (10 games)</div>
                </div>
                <div className="card-compact p-3">
                  <div className={`text-lg font-bold ${stats?.improvement > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stats?.improvement > 0 ? '+' : ''}{stats?.improvement.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-400">Improvement</div>
                </div>
              </div>
            </div>

            {/* Recent Games */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Recent Games</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {playerGames.slice(0, 10).map(game => {
                  const playerInGame = game.players.find(p => p.id === selectedPlayer.id);
                  return (
                    <div key={game.id} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                      <div>
                        <div className="font-medium text-white flex items-center">
                          {playerInGame.won ? '🏆' : '•'}
                          <span className="ml-2">
                            {playerInGame.won ? 'Won' : 'Lost'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(game.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">
                          {game.startingScore - playerInGame.finalScore} pts
                        </div>
                        <div className="text-sm text-gray-400">
                          {playerInGame.turns} turns
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-2">📊</span>
              Statistics Dashboard
            </h1>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'players' && renderPlayers()}
            {activeTab === 'games' && renderGames()}
            {activeTab === 'analytics' && renderAnalytics()}
          </div>
        </div>
      </div>

      {/* Player Detail Modal */}
      {renderPlayerDetail()}
    </div>
  );
};

export default StatisticsDashboard; 