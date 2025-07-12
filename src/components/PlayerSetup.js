import React, { useState } from 'react';

const PlayerSetup = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [startingScore, setStartingScore] = useState(180);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    const newNames = [];
    for (let i = 0; i < count; i++) {
      newNames.push(playerNames[i] || `Player ${i + 1}`);
    }
    setPlayerNames(newNames);
  };

  const handlePlayerNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name || `Player ${index + 1}`;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    onStartGame({
      playerCount,
      startingScore,
      playerNames: playerNames.filter(name => name.trim() !== '')
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="card max-w-2xl w-full animate-slide-up">
        <div className="card-body">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">🎯</span>
            </div>
            <h1 className="text-display bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              CoinDart
            </h1>
            <p className="text-body">Professional Darts Scoring System</p>
          </div>

          <div className="space-y-6">
            {/* Starting Score - Fixed at 180 */}
            <div>
              <label className="text-subtitle mb-3 block">
                Starting Score
              </label>
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl shadow-lg">
                  180
                </div>
              </div>
              <p className="text-center text-body mt-3">
                Fixed starting score for the "180" game variant
              </p>
            </div>

            {/* Player Count */}
            <div>
              <label className="text-subtitle mb-3 block">
                Number of Players
              </label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(count => (
                  <button
                    key={count}
                    onClick={() => handlePlayerCountChange(count)}
                    className={`h-12 rounded-xl font-medium transition-all duration-200 text-sm ${
                      playerCount === count
                        ? 'bg-emerald-500 text-white shadow-md scale-105'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Player Names */}
            <div>
              <label className="text-subtitle mb-3 block">
                Player Names
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {playerNames.map((name, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-caption w-8 text-center bg-slate-800 rounded-lg py-2">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Player ${index + 1}`}
                      maxLength={20}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Game Rules */}
            <div className="card-compact">
              <div className="p-4">
                <h3 className="text-subtitle text-amber-400 mb-3 flex items-center">
                  <span className="mr-2">📋</span>
                  Game Rules
                </h3>
                <ul className="text-body space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Players start with 180 points
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Players take turns throwing up to 3 darts
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Score is subtracted from starting total
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    Must reach exactly 0 to win
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Going below 0 is a "bust" - turn is void
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    When someone wins, remaining scores become penalties
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    Penalties: Outer board $1, Bust $5, Miss $10
                  </li>
                </ul>
              </div>
            </div>

            {/* Start Game Button */}
            <button
              onClick={handleStartGame}
              className="btn-primary btn-lg w-full"
              disabled={playerNames.length < 2}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetup; 