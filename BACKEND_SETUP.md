# Setup Guide: 8 Puzzle Game with Backend

## Installation & Setup

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

## Running the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

### Terminal 2 - Frontend Dev Server
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

## Backend API Endpoints

### Leaderboard Endpoints

#### POST `/api/leaderboard`
Submit a new score to the leaderboard.
```json
{
  "playerName": "John",
  "size": 3,
  "moves": 45,
  "time": 120,
  "algorithm": "manual",
  "heuristic": "none"
}
```

#### GET `/api/leaderboard`
Get all leaderboard entries (with optional filters).
```
GET /api/leaderboard?size=3&algorithm=astar
```

#### GET `/api/leaderboard/top`
Get top entries (limited).
```
GET /api/leaderboard/top?size=3&limit=10
```

#### GET `/api/leaderboard/stats`
Get leaderboard statistics.

#### GET `/api/health`
Check if backend is running.

## Features

✅ **Local Storage Fallback** - Works offline (stored locally)  
✅ **Persistent Leaderboard** - Scores stored in backend  
✅ **Filtering** - Filter by puzzle size and algorithm  
✅ **Statistics** - View aggregate stats  
✅ **CORS Enabled** - Frontend-Backend communication

## Next Steps (Optional)

- Add MongoDB for persistent database storage
- Implement user authentication (login/register)
- Add real-time updates with Socket.io
- Deploy backend to production (Heroku, Railway, Render)

## Troubleshooting

**CORS Error**: Make sure backend is running on port 3001 and frontend on 5173.

**Connection Error**: Check that both servers are running in different terminals.

**Port Already in Use**: 
```bash
# Windows - Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```
