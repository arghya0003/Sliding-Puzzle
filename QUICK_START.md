# 🎮 8 Puzzle Game - Quick Start Guide

## ⚡ Quick Setup (5 minutes)

### 1. Install All Dependencies
```bash
npm run setup
```

This will install both frontend and backend dependencies.

---

## 🚀 Running the Application

### Option A: Using Batch Files (Windows - Easiest)
```bash
# Terminal 1
start-backend.bat

# Terminal 2 (new window)
start-frontend.bat
```

### Option B: Manual Setup
**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## ✅ Verify Setup

- Backend: http://localhost:3001/api/health
- Frontend: http://localhost:5173
- Game should load with scores syncing to backend

---

## 📱 What Changed?

✨ **Before:** Scores stored in browser's localStorage  
✨ **After:** Scores stored on backend server  

### Key Features:
- Persistent leaderboard across browser sessions
- Real-time score submission
- Statistics tracking
- Filtering by puzzle size and algorithm

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3001 already in use | Kill the process or change PORT in `backend/.env` |
| Can't connect to backend | Ensure backend is running on port 3001 |
| CORS errors | Both servers must be running (3001 & 5173) |
| Blank leaderboard | Completely normal - submit a score to populate it |

### Kill Process on Port 3001 (Windows):
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## 📂 Project Structure

```
8-puzzle/
├── src/                    # React frontend
│   ├── pages/             # Game and leaderboard pages
│   ├── components/        # React components
│   └── utils/
│       └── leaderboard.js # API calls to backend
│
├── backend/               # Express.js server
│   ├── server.js         # Main server
│   ├── routes/           # API routes
│   └── controllers/      # Business logic
```

---

## 🔧 Backend API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST   | `/api/leaderboard` | Submit score |
| GET    | `/api/leaderboard` | Get all scores |
| GET    | `/api/leaderboard/top` | Get top scores |
| GET    | `/api/leaderboard/stats` | Get statistics |
| GET    | `/api/health` | Health check |

---

## 📝 Next Steps

1. ✅ Test the game and submit scores
2. 🗄️ (Optional) Add MongoDB for persistent database
3. 🔐 (Optional) Add user authentication
4. 🌐 (Optional) Deploy backend to Heroku/Railway/Render

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for advanced configuration.
