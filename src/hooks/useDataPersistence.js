import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  PLAYER_PROFILES: 'coindart_player_profiles',
  GAME_HISTORY: 'coindart_game_history',
  ANALYTICS: 'coindart_analytics',
  PREFERENCES: 'coindart_preferences'
};

const useDataPersistence = () => {
  const [playerProfiles, setPlayerProfiles] = useState({});
  const [gameHistory, setGameHistory] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalGames: 0,
    totalPlayers: 0,
    popularFeatures: {},
    sessionStats: {}
  });
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    soundEnabled: true,
    hapticEnabled: true,
    defaultStartingScore: 180
  });

  // Load data from localStorage on init
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILES);
      const savedHistory = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
      const savedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      const savedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);

      if (savedProfiles) {
        setPlayerProfiles(JSON.parse(savedProfiles));
      }
      if (savedHistory) {
        setGameHistory(JSON.parse(savedHistory));
      }
      if (savedAnalytics) {
        setAnalytics(prev => ({ ...prev, ...JSON.parse(savedAnalytics) }));
      }
      if (savedPreferences) {
        setPreferences(prev => ({ ...prev, ...JSON.parse(savedPreferences) }));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever data changes
  const saveToStorage = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, []);

  // Player Profile Management
  const createOrUpdatePlayerProfile = useCallback((playerData) => {
    const playerId = playerData.id || playerData.name.toLowerCase().replace(/\s+/g, '_');
    const existingProfile = playerProfiles[playerId] || {};
    
    const updatedProfile = {
      id: playerId,
      name: playerData.name,
      avatar: playerData.avatar || existingProfile.avatar || '🎯',
      createdAt: existingProfile.createdAt || new Date().toISOString(),
      lastPlayed: new Date().toISOString(),
      stats: {
        totalGames: (existingProfile.stats?.totalGames || 0) + (playerData.gameCompleted ? 1 : 0),
        totalWins: (existingProfile.stats?.totalWins || 0) + (playerData.won ? 1 : 0),
        totalScore: (existingProfile.stats?.totalScore || 0) + (playerData.scoreThisGame || 0),
        totalPenalties: (existingProfile.stats?.totalPenalties || 0) + (playerData.penaltiesThisGame || 0),
        bestGame: Math.max(existingProfile.stats?.bestGame || 0, playerData.scoreThisGame || 0),
        averageScore: 0, // Will be calculated
        winRate: 0, // Will be calculated
        ...existingProfile.stats,
        ...playerData.stats
      },
      preferences: {
        preferredStartingScore: preferences.defaultStartingScore,
        ...existingProfile.preferences,
        ...playerData.preferences
      }
    };

    // Calculate averages
    if (updatedProfile.stats.totalGames > 0) {
      updatedProfile.stats.averageScore = updatedProfile.stats.totalScore / updatedProfile.stats.totalGames;
      updatedProfile.stats.winRate = (updatedProfile.stats.totalWins / updatedProfile.stats.totalGames) * 100;
    }

    const newProfiles = { ...playerProfiles, [playerId]: updatedProfile };
    setPlayerProfiles(newProfiles);
    saveToStorage(STORAGE_KEYS.PLAYER_PROFILES, newProfiles);
    
    return updatedProfile;
  }, [playerProfiles, preferences.defaultStartingScore, saveToStorage]);

  // Game History Management
  const saveGameToHistory = useCallback((gameData) => {
    const gameRecord = {
      id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      players: gameData.players.map(player => ({
        id: player.id,
        name: player.name,
        finalScore: player.score,
        penalties: player.penalties,
        turns: player.turnHistory?.length || 0,
        won: gameData.winner?.id === player.id
      })),
      winner: gameData.winner,
      totalRounds: gameData.currentRound || 1,
      gameType: gameData.gameType || '180',
      startingScore: gameData.startingScore || 180,
      duration: gameData.duration || 0
    };

    const newHistory = [gameRecord, ...gameHistory.slice(0, 99)]; // Keep last 100 games
    setGameHistory(newHistory);
    saveToStorage(STORAGE_KEYS.GAME_HISTORY, newHistory);

    // Update player profiles with game data
    gameData.players.forEach(player => {
      createOrUpdatePlayerProfile({
        id: player.id,
        name: player.name,
        gameCompleted: true,
        won: gameData.winner?.id === player.id,
        scoreThisGame: gameData.startingScore - player.score,
        penaltiesThisGame: player.penalties
      });
    });

    // Update analytics - moved to separate function to avoid circular dependency
    setAnalytics(prev => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      popularFeatures: {
        ...prev.popularFeatures,
        'game_completed': (prev.popularFeatures['game_completed'] || 0) + 1
      },
      sessionStats: {
        ...prev.sessionStats,
        lastActivity: new Date().toISOString(),
        playerCount: gameData.players.length,
        gameType: gameData.gameType || '180',
        duration: gameData.duration || 0
      }
    }));

    return gameRecord;
  }, [gameHistory, saveToStorage, createOrUpdatePlayerProfile]);

  // Analytics Management
  const trackEvent = useCallback((eventName, eventData = {}) => {
    const newAnalytics = {
      ...analytics,
      totalGames: eventName === 'game_completed' ? analytics.totalGames + 1 : analytics.totalGames,
      popularFeatures: {
        ...analytics.popularFeatures,
        [eventName]: (analytics.popularFeatures[eventName] || 0) + 1
      },
      sessionStats: {
        ...analytics.sessionStats,
        lastActivity: new Date().toISOString(),
        ...eventData
      }
    };

    setAnalytics(newAnalytics);
    saveToStorage(STORAGE_KEYS.ANALYTICS, newAnalytics);
  }, [analytics, saveToStorage]);

  // Save analytics to storage when it changes
  useEffect(() => {
    if (analytics.totalGames > 0) {
      saveToStorage(STORAGE_KEYS.ANALYTICS, analytics);
    }
  }, [analytics, saveToStorage]);

  // Preferences Management
  const updatePreferences = useCallback((newPreferences) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    saveToStorage(STORAGE_KEYS.PREFERENCES, updatedPreferences);
  }, [preferences, saveToStorage]);

  // Statistics Calculations
  const getPlayerStatistics = useCallback((playerId) => {
    const profile = playerProfiles[playerId];
    if (!profile) return null;

    const playerGames = gameHistory.filter(game => 
      game.players.some(p => p.id === playerId)
    );

    const recentGames = playerGames.slice(0, 10);
    const recentScores = recentGames.map(game => {
      const playerInGame = game.players.find(p => p.id === playerId);
      return game.startingScore - playerInGame.finalScore;
    });

    return {
      ...profile.stats,
      recentGames: recentGames.length,
      recentAverage: recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0,
      improvement: recentScores.length > 1 ? recentScores[0] - recentScores[recentScores.length - 1] : 0,
      gamesThisMonth: playerGames.filter(game => {
        const gameDate = new Date(game.timestamp);
        const now = new Date();
        return gameDate.getMonth() === now.getMonth() && gameDate.getFullYear() === now.getFullYear();
      }).length
    };
  }, [playerProfiles, gameHistory]);

  // Data Export/Import
  const exportData = useCallback(() => {
    return {
      playerProfiles,
      gameHistory,
      analytics,
      preferences,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }, [playerProfiles, gameHistory, analytics, preferences]);

  const importData = useCallback((data) => {
    try {
      if (data.playerProfiles) {
        setPlayerProfiles(data.playerProfiles);
        saveToStorage(STORAGE_KEYS.PLAYER_PROFILES, data.playerProfiles);
      }
      if (data.gameHistory) {
        setGameHistory(data.gameHistory);
        saveToStorage(STORAGE_KEYS.GAME_HISTORY, data.gameHistory);
      }
      if (data.analytics) {
        setAnalytics(data.analytics);
        saveToStorage(STORAGE_KEYS.ANALYTICS, data.analytics);
      }
      if (data.preferences) {
        setPreferences(data.preferences);
        saveToStorage(STORAGE_KEYS.PREFERENCES, data.preferences);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, [saveToStorage]);

  // Clear all data
  const clearAllData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    setPlayerProfiles({});
    setGameHistory([]);
    setAnalytics({
      totalGames: 0,
      totalPlayers: 0,
      popularFeatures: {},
      sessionStats: {}
    });
    setPreferences({
      theme: 'dark',
      soundEnabled: true,
      hapticEnabled: true,
      defaultStartingScore: 180
    });
  }, []);

  return {
    // Data
    playerProfiles,
    gameHistory,
    analytics,
    preferences,
    
    // Player Management
    createOrUpdatePlayerProfile,
    getPlayerStatistics,
    
    // Game Management
    saveGameToHistory,
    
    // Analytics
    trackEvent,
    
    // Preferences
    updatePreferences,
    
    // Data Management
    exportData,
    importData,
    clearAllData
  };
};

export default useDataPersistence; 