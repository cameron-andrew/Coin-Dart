import { useState, useCallback } from 'react';

const useGameState = () => {
  const [gameConfig, setGameConfig] = useState({
    startingScore: 180,
    playerCount: 2,
    playerNames: ['Player 1', 'Player 2']
  });

  const [gameState, setGameState] = useState({
    players: [],
    currentPlayerIndex: 0,
    gameStarted: false,
    winner: null,
    history: [],
    currentRound: 1,
    roundResults: [],
    sessionStats: {
      totalRounds: 0,
      playerWins: {}
    }
  });

  const initializeGame = useCallback((config) => {
    const players = config.playerNames.map((name, index) => ({
      id: index,
      name,
      score: config.startingScore,
      penalties: 0,
      scoreHistory: [config.startingScore],
      penaltyHistory: [],
      turnHistory: []
    }));

    setGameConfig(config);
    setGameState({
      players,
      currentPlayerIndex: 0,
      gameStarted: true,
      winner: null,
      history: [],
      currentRound: 1,
      roundResults: [],
      sessionStats: {
        totalRounds: 0,
        playerWins: {}
      }
    });
  }, []);

  const getCurrentPlayer = useCallback(() => {
    if (!gameState.gameStarted || gameState.players.length === 0) return null;
    return gameState.players[gameState.currentPlayerIndex];
  }, [gameState.players, gameState.currentPlayerIndex, gameState.gameStarted]);

  const updatePlayerScore = useCallback((playerId, newScore, dartScores = [], isBust = false) => {
    setGameState(prevState => {
      const players = prevState.players.map(player => {
        if (player.id === playerId) {
          const updatedPlayer = {
            ...player,
            score: newScore,
            scoreHistory: [...player.scoreHistory, newScore],
            turnHistory: [...player.turnHistory, {
              dartScores,
              previousScore: player.score,
              newScore,
              isBust,
              timestamp: new Date().toISOString()
            }]
          };
          return updatedPlayer;
        }
        return player;
      });

      // Check for winner (must reach exactly 0)
      const winner = players.find(player => player.score === 0);
      
      // If there's a winner, add remaining scores as penalties to other players
      let finalPlayers = players;
      if (winner) {
        finalPlayers = players.map(player => {
          if (player.id !== winner.id && player.score > 0) {
            // Add remaining score as penalty
            return {
              ...player,
              penalties: player.penalties + player.score,
              penaltyHistory: [...player.penaltyHistory, {
                amount: player.score,
                reason: 'Remaining Score',
                timestamp: new Date().toISOString()
              }]
            };
          }
          return player;
        });
      }
      
      // Move to next player if no winner
      let nextPlayerIndex = prevState.currentPlayerIndex;
      if (!winner) {
        nextPlayerIndex = (prevState.currentPlayerIndex + 1) % finalPlayers.length;
      }

      return {
        ...prevState,
        players: finalPlayers,
        currentPlayerIndex: nextPlayerIndex,
        winner: winner || null,
        history: [...prevState.history, {
          playerId,
          dartScores,
          previousScore: prevState.players[playerId].score,
          newScore,
          isBust,
          timestamp: new Date().toISOString()
        }]
      };
    });
  }, []);

  const addPenalty = useCallback((playerId, amount, reason) => {
    setGameState(prevState => {
      const players = prevState.players.map(player => {
        if (player.id === playerId) {
          return {
            ...player,
            penalties: player.penalties + amount,
            penaltyHistory: [...player.penaltyHistory, {
              amount,
              reason,
              timestamp: new Date().toISOString()
            }]
          };
        }
        return player;
      });

      return {
        ...prevState,
        players
      };
    });
  }, []);

  const undoPenalty = useCallback((playerId) => {
    setGameState(prevState => {
      const players = prevState.players.map(player => {
        if (player.id === playerId && player.penaltyHistory.length > 0) {
          const lastPenalty = player.penaltyHistory[player.penaltyHistory.length - 1];
          return {
            ...player,
            penalties: Math.max(0, player.penalties - lastPenalty.amount),
            penaltyHistory: player.penaltyHistory.slice(0, -1)
          };
        }
        return player;
      });

      return {
        ...prevState,
        players
      };
    });
  }, []);

  const undoLastAction = useCallback(() => {
    setGameState(prevState => {
      if (prevState.history.length === 0) return prevState;

      const lastAction = prevState.history[prevState.history.length - 1];
      const players = prevState.players.map(player => {
        if (player.id === lastAction.playerId) {
          return {
            ...player,
            score: lastAction.previousScore,
            scoreHistory: player.scoreHistory.slice(0, -1),
            turnHistory: player.turnHistory.slice(0, -1)
          };
        }
        return player;
      });

      // Recalculate current player index
      let currentPlayerIndex = lastAction.playerId;
      if (currentPlayerIndex > 0) {
        currentPlayerIndex = currentPlayerIndex - 1;
      } else {
        currentPlayerIndex = players.length - 1;
      }

      return {
        ...prevState,
        players,
        currentPlayerIndex,
        winner: null,
        history: prevState.history.slice(0, -1)
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      players: [],
      currentPlayerIndex: 0,
      gameStarted: false,
      winner: null,
      history: [],
      currentRound: 1,
      roundResults: [],
      sessionStats: {
        totalRounds: 0,
        playerWins: {}
      }
    });
  }, []);

  const startNewRound = useCallback(() => {
    setGameState(prevState => {
      // Record the round result
      const roundResult = {
        roundNumber: prevState.currentRound,
        winner: prevState.winner,
        players: prevState.players.map(player => ({
          id: player.id,
          name: player.name,
          finalScore: player.score,
          penalties: player.penalties,
          turns: player.turnHistory.length
        })),
        timestamp: new Date().toISOString()
      };

      // Update session stats
      const newSessionStats = {
        totalRounds: prevState.sessionStats.totalRounds + 1,
        playerWins: {
          ...prevState.sessionStats.playerWins,
          [prevState.winner.id]: (prevState.sessionStats.playerWins[prevState.winner.id] || 0) + 1
        }
      };

      // Reset players for new round (keep names and penalty totals)
      const resetPlayers = prevState.players.map(player => ({
        ...player,
        score: gameConfig.startingScore,
        scoreHistory: [gameConfig.startingScore],
        turnHistory: []
      }));

      return {
        ...prevState,
        players: resetPlayers,
        currentPlayerIndex: 0,
        winner: null,
        history: [],
        currentRound: prevState.currentRound + 1,
        roundResults: [...prevState.roundResults, roundResult],
        sessionStats: newSessionStats
      };
    });
  }, [gameConfig.startingScore]);

  const calculateScore = useCallback((dartScores) => {
    return dartScores.reduce((sum, score) => sum + score, 0);
  }, []);

  const validateScore = useCallback((currentScore, turnScore) => {
    const newScore = currentScore - turnScore;
    return {
      newScore: Math.max(0, newScore),
      isBust: newScore < 0,
      isWin: newScore === 0
    };
  }, []);

  return {
    gameConfig,
    gameState,
    initializeGame,
    getCurrentPlayer,
    updatePlayerScore,
    addPenalty,
    undoPenalty,
    undoLastAction,
    resetGame,
    startNewRound,
    calculateScore,
    validateScore
  };
};

export default useGameState; 