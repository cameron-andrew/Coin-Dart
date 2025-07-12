import React, { useState } from 'react';

const ScoreInput = ({ currentPlayer, onScoreSubmit, onUndo, canUndo }) => {
  const [inputMode, setInputMode] = useState('total'); // 'total' or 'individual'
  const [totalScore, setTotalScore] = useState('');
  const [dartScores, setDartScores] = useState(['', '', '']);
  const [currentDart, setCurrentDart] = useState(0);

  const handleTotalScoreSubmit = () => {
    const score = parseInt(totalScore);
    if (isNaN(score) || score < 0 || score > 180) {
      alert('Please enter a valid score between 0 and 180');
      return;
    }
    
    onScoreSubmit(score, [score]);
    setTotalScore('');
  };

  const handleDartScoreInput = (dartIndex, value) => {
    const score = parseInt(value);
    if (isNaN(score) || score < 0 || score > 60) {
      return;
    }

    const newDartScores = [...dartScores];
    newDartScores[dartIndex] = value;
    setDartScores(newDartScores);
  };

  const handleDartSubmit = (dartIndex) => {
    const score = parseInt(dartScores[dartIndex]);
    if (isNaN(score) || score < 0 || score > 60) {
      alert('Please enter a valid dart score between 0 and 60');
      return;
    }

    if (dartIndex === 2 || currentDart === 2) {
      // Submit all dart scores
      const validScores = dartScores
        .slice(0, dartIndex + 1)
        .map(s => parseInt(s))
        .filter(s => !isNaN(s));
      
      const totalDartScore = validScores.reduce((sum, s) => sum + s, 0);
      onScoreSubmit(totalDartScore, validScores);
      
      // Reset for next turn
      setDartScores(['', '', '']);
      setCurrentDart(0);
    } else {
      setCurrentDart(dartIndex + 1);
    }
  };

  const handleFinishTurn = () => {
    const validScores = dartScores
      .map(s => parseInt(s))
      .filter(s => !isNaN(s) && s >= 0);
    
    if (validScores.length === 0) {
      alert('Please enter at least one dart score');
      return;
    }

    const totalDartScore = validScores.reduce((sum, s) => sum + s, 0);
    onScoreSubmit(totalDartScore, validScores);
    
    // Reset for next turn
    setDartScores(['', '', '']);
    setCurrentDart(0);
  };

  const resetDarts = () => {
    setDartScores(['', '', '']);
    setCurrentDart(0);
  };

  const commonScores = [20, 25, 26, 40, 41, 45, 50, 60, 81, 100, 140, 180];

  if (!currentPlayer) return null;

  return (
    <div className="card">
      {/* Desktop: Show player info */}
      <div className="hidden lg:block card-header text-center">
        <h2 className="text-title text-blue-400 mb-2">
          {currentPlayer.name}'s Turn
        </h2>
        <div className="score-display text-emerald-400">
          {currentPlayer.score}
        </div>
        <p className="text-body mt-1">Current Score</p>
      </div>

      {/* Mobile: Compact header */}
      <div className="lg:hidden card-header text-center">
        <h2 className="text-subtitle text-blue-400">Score Entry</h2>
      </div>

      <div className="card-body">

        {/* Input Mode Toggle */}
        <div className="flex mb-6 bg-slate-800 rounded-xl p-1">
          <button
            onClick={() => setInputMode('total')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
              inputMode === 'total'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Total Score
          </button>
          <button
            onClick={() => setInputMode('individual')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
              inputMode === 'individual'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Individual Darts
          </button>
        </div>

      {inputMode === 'total' ? (
        <div className="space-y-4">
          {/* Common Scores */}
          <div>
            <label className="text-subtitle mb-3 block">
              Quick Scores
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {commonScores.map(score => (
                <button
                  key={score}
                  onClick={() => setTotalScore(score.toString())}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 py-3 px-2 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base shadow-sm hover:shadow-md"
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* Total Score Input */}
          <div>
            <label className="text-subtitle mb-3 block">
              Total Turn Score
            </label>
            <div className="flex space-x-3">
              <input
                type="number"
                value={totalScore}
                onChange={(e) => setTotalScore(e.target.value)}
                className="input-field flex-1 text-center text-xl h-12"
                placeholder="Enter total score"
                min="0"
                max="180"
                onKeyPress={(e) => e.key === 'Enter' && handleTotalScoreSubmit()}
              />
              <button
                onClick={handleTotalScoreSubmit}
                className="btn-primary px-6 h-12"
                disabled={!totalScore}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Individual Dart Scores */}
          <div>
            <label className="text-subtitle mb-3 block">
              Individual Dart Scores
            </label>
            <div className="space-y-3">
              {dartScores.map((score, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-body w-16 text-center bg-slate-800 rounded-lg py-3">
                    Dart {index + 1}
                  </span>
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => handleDartScoreInput(index, e.target.value)}
                    className={`input-field flex-1 text-center h-12 ${
                      index === currentDart ? 'ring-2 ring-blue-500' : ''
                    }`}
                    placeholder="0-60"
                    min="0"
                    max="60"
                    disabled={index > currentDart}
                    onKeyPress={(e) => e.key === 'Enter' && handleDartSubmit(index)}
                  />
                  {index <= currentDart && score && (
                    <button
                      onClick={() => handleDartSubmit(index)}
                      className="btn-success btn-sm px-3 h-12"
                    >
                      ✓
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dart Controls */}
          <div className="flex space-x-2">
            <button
              onClick={handleFinishTurn}
              className="btn-primary flex-1"
              disabled={dartScores.every(s => !s)}
            >
              Finish Turn
            </button>
            <button
              onClick={resetDarts}
              className="btn-secondary px-4"
            >
              Reset
            </button>
          </div>
        </div>
      )}

        {/* Undo Button */}
        {canUndo && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={onUndo}
              className="btn-secondary w-full"
            >
              ↶ Undo Last Turn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreInput; 