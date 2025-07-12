import React, { useState } from 'react';

const PlayerProfile = ({ 
  profile, 
  onUpdateProfile, 
  onClose 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    avatar: profile?.avatar || '🎯',
    preferences: {
      preferredStartingScore: profile?.preferences?.preferredStartingScore || 180,
      theme: profile?.preferences?.theme || 'dark',
      soundEnabled: profile?.preferences?.soundEnabled !== false,
      hapticEnabled: profile?.preferences?.hapticEnabled !== false,
      ...profile?.preferences
    }
  });

  const avatarOptions = [
    '🎯', '🏹', '🎪', '🎨', '🎭', '🎪', '🎸', '🎵', '🎮', '🎲',
    '🔥', '⚡', '💎', '🌟', '🚀', '🎊', '🎉', '🏆', '👑', '💫',
    '🦅', '🦊', '🐺', '🦁', '🐯', '🦈', '🐉', '🦄', '🐸', '🦋',
    '😎', '🤠', '🤖', '👻', '🎃', '💀', '🤡', '👽', '🦸', '🧙'
  ];

  const handleSave = () => {
    onUpdateProfile({
      ...profile,
      ...formData,
      id: profile?.id || formData.name.toLowerCase().replace(/\s+/g, '_')
    });
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      avatar: profile?.avatar || '🎯',
      preferences: {
        preferredStartingScore: profile?.preferences?.preferredStartingScore || 180,
        theme: profile?.preferences?.theme || 'dark',
        soundEnabled: profile?.preferences?.soundEnabled !== false,
        hapticEnabled: profile?.preferences?.hapticEnabled !== false,
        ...profile?.preferences
      }
    });
    setEditMode(false);
  };

  const renderViewMode = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">{profile.avatar}</div>
        <h2 className="text-2xl font-bold text-white mb-2">{profile.name}</h2>
        <p className="text-gray-400">
          Member since {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-compact p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{profile.stats.totalWins}</div>
          <div className="text-sm text-gray-400">Wins</div>
        </div>
        <div className="card-compact p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{profile.stats.totalGames}</div>
          <div className="text-sm text-gray-400">Games</div>
        </div>
        <div className="card-compact p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{profile.stats.averageScore.toFixed(1)}</div>
          <div className="text-sm text-gray-400">Avg Score</div>
        </div>
        <div className="card-compact p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{profile.stats.winRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Win Rate</div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card-compact p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Preferences</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Preferred Starting Score:</span>
            <span className="text-white">{profile.preferences.preferredStartingScore}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Sound Effects:</span>
            <span className="text-white">{profile.preferences.soundEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Haptic Feedback:</span>
            <span className="text-white">{profile.preferences.hapticEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Played:</span>
            <span className="text-white">{new Date(profile.lastPlayed).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={() => setEditMode(true)}
        className="btn-primary w-full"
      >
        Edit Profile
      </button>
    </div>
  );

  const renderEditMode = () => (
    <div className="space-y-6">
      {/* Avatar Selection */}
      <div>
        <label className="text-subtitle mb-3 block">Choose Avatar</label>
        <div className="text-center mb-4">
          <div className="text-6xl">{formData.avatar}</div>
        </div>
        <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
          {avatarOptions.map(avatar => (
            <button
              key={avatar}
              onClick={() => setFormData(prev => ({ ...prev, avatar }))}
              className={`text-2xl p-2 rounded-lg transition-colors ${
                formData.avatar === avatar
                  ? 'bg-blue-600 scale-110'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-subtitle mb-3 block">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="input-field w-full"
          placeholder="Enter your name"
          maxLength={20}
        />
      </div>

      {/* Preferences */}
      <div>
        <label className="text-subtitle mb-3 block">Preferences</label>
        <div className="space-y-4">
          {/* Preferred Starting Score */}
          <div>
            <label className="text-body mb-2 block">Preferred Starting Score</label>
            <select
              value={formData.preferences.preferredStartingScore}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  preferredStartingScore: parseInt(e.target.value)
                }
              }))}
              className="input-field w-full"
            >
              <option value={180}>180</option>
              <option value={301}>301</option>
              <option value={501}>501</option>
              <option value={701}>701</option>
              <option value={1001}>1001</option>
            </select>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <label className="text-body">Sound Effects</label>
            <button
              onClick={() => setFormData(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  soundEnabled: !prev.preferences.soundEnabled
                }
              }))}
              className={`w-12 h-6 rounded-full transition-colors ${
                formData.preferences.soundEnabled ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                formData.preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Haptic Feedback */}
          <div className="flex items-center justify-between">
            <label className="text-body">Haptic Feedback</label>
            <button
              onClick={() => setFormData(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  hapticEnabled: !prev.preferences.hapticEnabled
                }
              }))}
              className={`w-12 h-6 rounded-full transition-colors ${
                formData.preferences.hapticEnabled ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                formData.preferences.hapticEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleSave}
          className="btn-primary flex-1"
          disabled={!formData.name.trim()}
        >
          Save Changes
        </button>
        <button
          onClick={handleCancel}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-white">
              {editMode ? 'Edit Profile' : 'Player Profile'}
            </h1>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {editMode ? renderEditMode() : renderViewMode()}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile; 