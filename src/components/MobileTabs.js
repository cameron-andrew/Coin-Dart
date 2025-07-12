import React, { useState } from 'react';
import Scoreboard from './Scoreboard';
import PenaltyLeaderboard from './PenaltyLeaderboard';
import PenaltyTracker from './PenaltyTracker';
import SessionStats from './SessionStats';

const MobileTabs = ({ 
  players, 
  currentPlayerIndex, 
  winner, 
  gameState, 
  onAddPenalty, 
  onUndoPenalty 
}) => {
  const [activeTab, setActiveTab] = useState('scoreboard');

  const tabs = [
    { id: 'scoreboard', label: 'Scores', icon: '📊' },
    { id: 'penalties', label: 'Penalties', icon: '💰' },
    { id: 'tracker', label: 'Tracker', icon: '🎯' },
    { id: 'session', label: 'Session', icon: '📈' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scoreboard':
        return (
          <Scoreboard
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            winner={winner}
          />
        );
      case 'penalties':
        return (
          <div className="card p-4">
            <h3 className="text-lg font-bold text-dart-yellow mb-4 text-center">
              💰 Penalty Rankings
            </h3>
            <PenaltyLeaderboard players={players} />
            
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
      case 'tracker':
        return (
          <div className="card p-4">
            <h3 className="text-lg font-bold text-dart-yellow mb-4 text-center">
              🎯 Add Penalties
            </h3>
            <PenaltyTracker 
              players={players}
              onAddPenalty={onAddPenalty}
              onUndoPenalty={onUndoPenalty}
            />
          </div>
        );
      case 'session':
        return (
          <SessionStats
            gameState={gameState}
            players={players}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs whitespace-nowrap">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-0">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MobileTabs; 