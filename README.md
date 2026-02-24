# 🧩 Sliding Puzzle Challenge

A premium, interactive sliding puzzle game built with React and Vite. Features multiple game modes, AI solvers with different algorithms and heuristics, player profiles, and a competitive leaderboard system.

![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7+-purple?style=flat-square&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2020+-yellow?style=flat-square&logo=javascript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🎮 Game Modes
- **8-Puzzle (3×3)** - Classic puzzle with 8 tiles
- **15-Puzzle (4×4)** - Traditional version with 15 tiles
- **24-Puzzle (5×5)** - Advanced challenge with 24 tiles

### 🎯 Difficulty Levels
- **Easy** - Few shuffles for quick games
- **Medium** - Moderate difficulty for standard play
- **Hard** - Maximum shuffles for expert challenges

### 🤖 AI Solver Algorithms

Choose from multiple solving algorithms:

1. **BFS (Breadth-First Search)**
   - Unguided search without heuristics
   - Finds shortest path but slower exploration
   - Best for small puzzles (3×3)

2. **A* with Manhattan Distance**
   - Calculates grid distance for each tile
   - Formula: |current_x - goal_x| + |current_y - goal_y|
   - Fast and memory-efficient

3. **A* with Misplaced Tiles**
   - Counts tiles not in goal position
   - Simple but effective heuristic
   - Good for quick approximations

4. **A* with Euclidean Distance**
   - Uses straight-line distance metric
   - Formula: √((x₁-x₂)² + (y₁-y₂)²)
   - More precise spatial calculation

5. **A* with Combined Heuristic** ⭐ (Recommended)
   - Uses max(Manhattan, Misplaced) for tighter bounds
   - Provides best performance
   - Optimal for all puzzle sizes including 4×4

### 📊 Game Features
- ✅ Undo/Redo functionality with full history
- ✅ Live move and time tracking
- ✅ Real-time heuristic values (MD, MT)
- ✅ Auto-solver with step visualization
- ✅ Smooth animations and sound effects
- ✅ Player name input system
- ✅ Adaptive UI with glassmorphic design

### 🏆 Leaderboard System
- Track top 100 players globally
- Filter by puzzle size
- Sort by: Score, Moves, Time, or Recent
- Automatic score calculation (60% moves + 40% time)
- Medal badges for top 3 (🥇🥈🥉)
- Local storage persistence

## 🛠 Tech Stack

- **Frontend Framework:** React 18+
- **Build Tool:** Vite 7+
- **Animation Library:** Framer Motion
- **Routing:** React Router DOM
- **Styling:** CSS3 with glassmorphic design
- **Sound:** Web Audio API
- **State Management:** React Hooks
- **Storage:** Browser LocalStorage

## 📋 Project Structure

```
src/
├── components/
│   ├── Board.jsx              # Main puzzle board component
│   ├── Tile.jsx               # Individual tile component
│   ├── Controls.jsx           # Control panel buttons
│   ├── Stats.jsx              # Statistics display
│   ├── VictoryModal.jsx       # Win modal with results
│   └── Leaderboard.jsx        # Leaderboard display
├── pages/
│   ├── LandingPage.jsx        # Home page with mode selection
│   ├── GamePage.jsx           # Main game interface
│   └── LeaderboardPage.jsx    # Full leaderboard view
├── utils/
│   ├── puzzleLogic.js         # Core puzzle algorithms
│   ├── solver.js              # BFS and A* solver implementations
│   ├── leaderboard.js         # Leaderboard management
│   └── sounds.js              # Audio utilities
├── styles/
│   ├── landing.css            # Landing page styles
│   ├── game.css               # Game page styles
│   ├── leaderboard.css        # Leaderboard styles
│   ├── leaderboard-page.css   # Leaderboard page styles
│   └── index.css              # Global styles
├── App.jsx                    # Main app component
└── main.jsx                   # React entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/arghya0003/Sliding-Puzzle.git
cd Sliding-Puzzle
```

2. **Install dependencies (Frontend & Backend)**
```bash
npm run setup
```

3. **Start Backend Server (Terminal 1)**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:3001
```

4. **Start Frontend Development Server (Terminal 2)**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

5. **Build for production**
```bash
npm run build
```

## 🚀 Deployment

### Quick Deploy Guide
The app is **full-stack ready** with Express.js backend. Deploy in 30 minutes:

**Backend + Frontend Deployment:**
- 📖 See [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) for step-by-step instructions
- 📋 See [DEPLOYMENT.md](./DEPLOYMENT.md) for platform comparisons

**Recommended Stack:**
- Frontend: **Vercel** (free)
- Backend: **Railway** ($5/month) or **Render** (free)

**Key Files:**
- Frontend: [.env.production.example](.env.production.example)
- Backend: [backend/.env.example](backend/.env.example)

## 📖 How to Play

### Starting a Game
1. Enter your player name on the landing page
2. Select a puzzle size (8, 15, or 24-puzzle)
3. Choose difficulty level (Easy, Medium, Hard)
4. Click "Play"

### During Gameplay
- **Shuffle:** Randomly scramble the puzzle
- **Reset:** Return to starting position
- **Undo:** Revert last move
- **Redo:** Repeat undone move
- **Auto Solve:** Let AI solve the puzzle automatically
  - Select your preferred algorithm first
  - Watch the step-by-step solution

### Stats Display
- **Moves:** Total moves made
- **Time:** Elapsed playing time
- **MD:** Manhattan Distance (lower = closer to solution)
- **MT:** Misplaced Tiles (lower = more in correct positions)

### After Winning
- View your final score
- Algorithm used
- Compare with leaderboard
- Play again or continue challenging

## 🧮 Algorithm Details

### A* Search Algorithm
A* combines actual cost (moves made) with estimated cost (heuristic) to find optimal solutions efficiently.

**Formula:** f(n) = g(n) + h(n)
- **g(n):** Actual cost (number of moves from start)
- **h(n):** Heuristic estimate (distance to goal)
- **f(n):** Total estimated cost

### Heuristics Explained

**Manhattan Distance**
- Sums the horizontal and vertical distances
- Most efficient for this puzzle type
- Always underestimates (admissible)

**Misplaced Tiles**
- Simpler calculation, counts wrong tiles
- Less accurate estimation
- Faster computation

**Euclidean Distance**
- Uses geometric distance formula
- Moderate accuracy and speed
- Good balance for exploration

**Combined (Max)**
- Uses max(Manhattan, Misplaced)
- Creates tighter lower bound
- Best admissible heuristic

### Solvability
- **3×3 (8-puzzle):** ~181,440 states
- **4×4 (15-puzzle):** ~1.3 trillion states
- **5×5 (24-puzzle):** ~10²⁵ states (auto-solve disabled)

Not all configurations are solvable. The game validates solvability before presenting puzzles.

## 🎨 UI Features

### Glassmorphic Design
- Modern frosted glass effect
- Smooth gradient overlays
- Ambient animated orbs
- Dark theme with accent colors

### Responsive Layout
- Mobile-first design
- Tablet optimization
- Desktop enhancements
- Touch-friendly controls

### Animations
- Tile sliding transitions
- Modal pop-in effects
- Button hover states
- Loading indicators

## 📊 Leaderboard System

### Score Calculation
```
Score = (0.6 × normalized_moves) + (0.4 × normalized_time)
```
- Moves normalized to ~50 moves
- Time normalized to ~300 seconds
- Lower scores rank higher

### Storage
- Stored in browser localStorage
- Persists across sessions
- Max 100 entries kept
- Automatic pruning

### Features
- Global rankings
- Per-puzzle-size rankings
- Multiple sort orders
- Clear all option

## 🔧 Configuration

### Difficulty Settings (in GamePage.jsx)
```javascript
const DIFFICULTIES = {
    3: [
        { label: 'Easy', moves: 20 },
        { label: 'Medium', moves: 50 },
        { label: 'Hard', moves: 120 }
    ],
    // ...
};
```

### Solver Constants (in GamePage.jsx)
```javascript
const SOLVE_INTERVAL_MS = { 3: 320, 4: 280, 5: 240 };
```
- Adjusts animation speed per puzzle size
- Smaller values = faster visualization

## 🐛 Troubleshooting

### Puzzle Won't Solve
- Try a different algorithm
- Ensure you're not already on the solution state
- Check browser console for errors

### Leaderboard Not Saving
- Check if localStorage is enabled
- Clear cache if duplicates appear
- Verify browser privacy settings allow localStorage

### Performance Issues
- Disable auto-solve for 5×5 puzzles (intentional)
- Use A* with Combined heuristic for speed
- Close other browser tabs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Arghya** - [GitHub Profile](https://github.com/arghya0003)

## 🙏 Acknowledgments

- Inspired by the classic sliding puzzle game
- A* algorithm research and optimization
- React and Vite communities for excellent tools
- Framer Motion for smooth animations

---

**⭐ If you find this project helpful, please consider giving it a star!**

## 📞 Contact & Support

For issues, suggestions, or feedback:
- Open an [Issue](https://github.com/arghya0003/Sliding-Puzzle/issues)
- Check existing [Discussions](https://github.com/arghya0003/Sliding-Puzzle/discussions)

---

*Last Updated: February 2026*
