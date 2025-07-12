# CoinDart - Professional Darts Scoring System

A modern, responsive web application for scoring the darts game "180" (also known as 501/301). Built with React and Tailwind CSS.

## 🎯 Features

### Core Gameplay
- **Multi-player support**: 2-10 players with customizable names
- **Configurable starting scores**: 301, 501, 701, 1001, or custom values
- **Dual scoring modes**: Enter total turn score or individual dart scores (up to 3 darts)
- **Automatic turn rotation**: Seamlessly moves between players
- **Exact finish rule**: Players must reach exactly 0 to win
- **Bust protection**: Scores below 0 are automatically reverted

### Penalty System
- **Monetary tracking**: Separate penalty system from game scores
- **Three penalty types**:
  - Hit Outer Board: $1
  - Bust (score < 0): $5 (automatically applied)
  - Missed Board: $10
- **Penalty history**: Track all penalties per player
- **Total tracking**: See cumulative penalties across all players

### Game Management
- **Undo functionality**: Reverse the last turn/dart
- **Score history**: Complete turn-by-turn history for each player
- **Game statistics**: Total turns, busts, and performance metrics
- **Winner celebration**: Clear winner announcement with confetti-style display

### User Interface
- **Responsive design**: Works on desktop, tablet, and mobile
- **Dark theme**: Professional gaming aesthetic
- **Real-time updates**: Live score updates and player status
- **Quick score buttons**: Common dart scores for faster input
- **Visual feedback**: Clear indication of current player and game state

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd coindart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 🎮 How to Play

### Game Setup
1. **Choose starting score**: Select from common values (301, 501, 701, 1001) or enter custom
2. **Add players**: Support for 2-10 players with custom names
3. **Start game**: Begin the scoring session

### During Play
1. **Score entry**: Choose between total score or individual dart entry
2. **Submit scores**: Scores are automatically subtracted from player totals
3. **Handle penalties**: Use penalty buttons for infractions
4. **Undo mistakes**: Reverse the last action if needed

### Winning
- **Exact finish**: Player must reach exactly 0 points
- **Bust rule**: Going below 0 voids the turn and adds $5 penalty
- **Winner announcement**: Clear victory display with game statistics

## 🛠️ Technical Details

### Built With
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript**: ES6+ features
- **Local Storage**: Game state persistence (future enhancement)

### Project Structure
```
src/
├── components/
│   ├── PlayerSetup.js      # Game configuration
│   ├── Scoreboard.js       # Player scores display
│   ├── ScoreInput.js       # Score entry interface
│   └── PenaltyPanel.js     # Penalty tracking
├── hooks/
│   └── useGameState.js     # Game state management
├── App.js                  # Main application component
├── index.js               # React DOM rendering
└── index.css              # Tailwind CSS and custom styles
```

### Key Components

#### `useGameState` Hook
- Manages all game state and logic
- Handles player management, scoring, and penalties
- Provides validation and game flow control

#### `PlayerSetup` Component
- Initial game configuration
- Player name entry and count selection
- Starting score customization

#### `ScoreInput` Component
- Dual input modes (total/individual)
- Score validation and submission
- Quick score buttons for common values

#### `Scoreboard` Component
- Real-time player scores
- Turn history and statistics
- Current player indication

#### `PenaltyPanel` Component
- Penalty button interface
- Individual and total penalty tracking
- Penalty history display

## 🎨 Customization

### Styling
The app uses Tailwind CSS with custom color schemes:
- **Primary Blue**: Game interface elements
- **Dart Green**: Scores and positive actions
- **Dart Red**: Penalties and warnings
- **Dart Yellow**: Highlights and accents

### Game Rules
Modify penalty amounts and rules in:
- `src/components/PenaltyPanel.js` - Penalty amounts
- `src/hooks/useGameState.js` - Game logic and validation

## 📱 Mobile Support

The app is fully responsive and optimized for:
- **Desktop**: Full three-column layout
- **Tablet**: Responsive grid adjustments
- **Mobile**: Stacked layout with prominent current player display

## 🔧 Development

### Available Scripts
- `npm start`: Development server
- `npm run build`: Production build
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

### Future Enhancements
- [ ] Local storage persistence
- [ ] Game statistics and analytics
- [ ] Sound effects and animations
- [ ] Tournament mode
- [ ] Export game results
- [ ] Multiple game variants (Cricket, Around the Clock)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

---

**CoinDart** - Making darts scoring professional, accurate, and fun! 🎯 