import React, { useState, useEffect } from 'react';
import useGameState from './hooks/useGameState';
import useDataPersistence from './hooks/useDataPersistence';
import PlayerSetup from './components/PlayerSetup';
import Scoreboard from './components/Scoreboard';
import ScoreInput from './components/ScoreInput';
import PenaltyPanel from './components/PenaltyPanel';
import SessionStats from './components/SessionStats';
import MobileTabs from './components/MobileTabs';
import StatisticsDashboard from './components/StatisticsDashboard';
import PlayerProfile from './components/PlayerProfile';
import './index.css';

function App() {
  const [showStatistics, setShowStatistics] = useState(false);
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);

  const {
    gameState,
    initializeGame,
    getCurrentPlayer,
    updatePlayerScore,
    addPenalty,
    undoPenalty,
    undoLastAction,
    resetGame,
    startNewRound,
    validateScore
  } = useGameState();

  const {
    playerProfiles,
    gameHistory,
    analytics,
    createOrUpdatePlayerProfile,
    getPlayerStatistics,
    saveGameToHistory,
    trackEvent
  } = useDataPersistence();

  // Track game start time
  useEffect(() => {
    if (gameState.gameStarted && !gameStartTime) {
      setGameStartTime(Date.now());
      trackEvent('game_started', { playerCount: gameState.players.length });
    }
  }, [gameState.gameStarted, gameStartTime, gameState.players.length, trackEvent]);

  // Handle game completion
  useEffect(() => {
    if (gameState.winner && gameStartTime) {
      const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
      saveGameToHistory({
        ...gameState,
        duration: gameDuration,
        startingScore: 180 // Could be dynamic based on game config
      });
      setGameStartTime(null);
    }
  }, [gameState.winner, gameStartTime, gameState, saveGameToHistory]);

  const handleScoreSubmit = (turnScore, dartScores) => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    const validation = validateScore(currentPlayer.score, turnScore);
    
    if (validation.isBust) {
      // Add automatic bust penalty
      addPenalty(currentPlayer.id, 5, 'Bust');
      // Score remains the same for bust
      updatePlayerScore(currentPlayer.id, currentPlayer.score, dartScores, true);
      trackEvent('bust_occurred', { playerId: currentPlayer.id });
    } else {
      updatePlayerScore(currentPlayer.id, validation.newScore, dartScores, false);
      trackEvent('score_submitted', { 
        playerId: currentPlayer.id, 
        score: turnScore,
        isWin: validation.isWin 
      });
    }
  };

  const handlePenaltyAdd = (playerId, amount, reason) => {
    addPenalty(playerId, amount, reason);
    trackEvent('penalty_added', { playerId, amount, reason });
  };

  const handleUndoPenalty = (playerId) => {
    undoPenalty(playerId);
    trackEvent('penalty_undone', { playerId });
  };

  const handleUndo = () => {
    undoLastAction();
    trackEvent('action_undone');
  };

  const handleNewGame = () => {
    resetGame();
    setGameStartTime(null);
    trackEvent('new_game_started');
  };

  const handleNewRound = () => {
    startNewRound();
    setGameStartTime(Date.now());
    trackEvent('new_round_started');
  };

  const handleShowStatistics = () => {
    setShowStatistics(true);
    trackEvent('statistics_viewed');
  };

  // Removed unused handleShowPlayerProfile function

  const handleUpdatePlayerProfile = (updatedProfile) => {
    createOrUpdatePlayerProfile(updatedProfile);
    setSelectedProfile(updatedProfile);
    trackEvent('player_profile_updated', { playerId: updatedProfile.id });
  };

  // Removed multiplayer functionality

  if (!gameState.gameStarted) {
    return <PlayerSetup onStartGame={initializeGame} />;
  }

  const currentPlayer = getCurrentPlayer();
  const canUndo = gameState.history.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">🎯</span>
          </div>
          <h1 className="text-display bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            CoinDart
          </h1>
          <div className="text-body mb-6">
            Round {gameState.currentRound} • {gameState.sessionStats.totalRounds} rounds completed
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleNewGame}
              className="btn-secondary btn-sm"
            >
              New Session
            </button>
            <button
              onClick={handleShowStatistics}
              className="btn-ghost btn-sm"
            >
              📊 Stats
            </button>
          </div>
        </div>

        {/* Winner Announcement */}
        {gameState.winner && (
          <div className="mb-8 animate-slide-up">
            <div className="card bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
              <div className="card-body text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full mb-4 shadow-lg">
                  <span className="text-3xl">🏆</span>
                </div>
                <h2 className="text-title text-emerald-400 mb-2">
                  {gameState.winner.name} Wins Round {gameState.currentRound}!
                </h2>
                <p className="text-body mb-6">
                  Congratulations! You've reached exactly 0 points.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={handleNewRound}
                    className="btn-success btn-lg"
                  >
                    🎯 Next Round
                  </button>
                  <button
                    onClick={handleNewGame}
                    className="btn-secondary"
                  >
                    End Session
                  </button>
                  <button
                    onClick={handleShowStatistics}
                    className="btn-ghost"
                  >
                    📊 Statistics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile-First Layout */}
        <div className="space-y-6">
          {/* Mobile: Current Player Info (only show on mobile when game is active) */}
          {currentPlayer && !gameState.winner && (
            <div className="lg:hidden card animate-fade-in">
              <div className="card-body text-center">
                <h3 className="text-subtitle text-blue-400 mb-2">
                  {currentPlayer.name}'s Turn
                </h3>
                <div className="score-display text-emerald-400 mb-2">
                  {currentPlayer.score}
                </div>
                <div className="text-caption">
                  Round {gameState.currentRound} • {gameState.sessionStats.totalRounds} completed
                </div>
              </div>
            </div>
          )}

          {/* Score Input - Priority on mobile */}
          {!gameState.winner && (
            <div className="lg:hidden">
              <ScoreInput
                currentPlayer={currentPlayer}
                onScoreSubmit={handleScoreSubmit}
                onUndo={handleUndo}
                canUndo={canUndo}
              />
            </div>
          )}

          {/* Mobile Tabs for Secondary Content */}
          <div className="lg:hidden">
            <MobileTabs
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
              winner={gameState.winner}
              gameState={gameState}
              onAddPenalty={handlePenaltyAdd}
              onUndoPenalty={handleUndoPenalty}
            />
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6 animate-fade-in">
            {/* Left Column - Scoreboard */}
            <div className="lg:col-span-1">
              <Scoreboard
                players={gameState.players}
                currentPlayerIndex={gameState.currentPlayerIndex}
                winner={gameState.winner}
              />
            </div>

            {/* Middle Column - Score Input */}
            <div className="lg:col-span-1">
              {!gameState.winner && (
                <ScoreInput
                  currentPlayer={currentPlayer}
                  onScoreSubmit={handleScoreSubmit}
                  onUndo={handleUndo}
                  canUndo={canUndo}
                />
              )}
            </div>

            {/* Right Column - Penalty Panel */}
            <div className="lg:col-span-1">
              <PenaltyPanel
                players={gameState.players}
                onAddPenalty={handlePenaltyAdd}
                onUndoPenalty={handleUndoPenalty}
              />
            </div>

            {/* Far Right Column - Session Stats */}
            <div className="lg:col-span-1">
              <SessionStats
                gameState={gameState}
                players={gameState.players}
              />
            </div>
          </div>
        </div>



        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="text-caption">
            <p>CoinDart - Professional Darts Scoring System</p>
            <p className="mt-1">Track scores, penalties, and game history with ease</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showStatistics && (
        <StatisticsDashboard
          playerProfiles={playerProfiles}
          gameHistory={gameHistory}
          analytics={analytics}
          getPlayerStatistics={getPlayerStatistics}
          onClose={() => setShowStatistics(false)}
        />
      )}

      {showPlayerProfile && selectedProfile && (
        <PlayerProfile
          profile={selectedProfile}
          onUpdateProfile={handleUpdatePlayerProfile}
          onClose={() => {
            setShowPlayerProfile(false);
            setSelectedProfile(null);
          }}
        />
      )}
    </div>
  );
}

export default App; 