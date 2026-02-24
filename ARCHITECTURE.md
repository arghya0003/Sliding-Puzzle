# 🏗️ Architecture & Deployment Guide

## Local Development Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Your Computer                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐          ┌──────────────────┐   │
│  │   Frontend       │          │   Backend        │   │
│  │ React + Vite     │          │ Express.js       │   │
│  │ Port 5173        │◄────────►│ Port 3001        │   │
│  │                  │          │                  │   │
│  │ • Game Logic     │          │ • API Routes     │   │
│  │ • UI Components  │          │ • Leaderboard DB │   │
│  │ • Animations     │          │ • Score Storage  │   │
│  └──────────────────┘          └──────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            ↓
                    Both in node_modules/
                    (requires: npm install)
```

---

## Production Deployment Architecture

### Option 1: Railway (Recommended)

```
┌────────────────────────────────────────────────────────────┐
│                  Production (Cloud)                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────────┐       ┌──────────────────────┐  │
│  │  Vercel CDN         │       │  Railway Container   │  │
│  │ (Frontend)          │       │ (Backend)            │  │
│  │                     │◄─────►│                      │  │
│  │ your-app.vercel.app│       │ backend.railway.app  │  │
│  │                     │       │                      │  │
│  │ Build: npm run      │       │ Build: npm install   │  │
│  │ build               │       │ Start: npm start     │  │
│  │ Output: dist/       │       │ Port: 3001           │  │
│  └─────────────────────┘       └──────────────────────┘  │
│                                                            │
│  GitHub (source control)                                  │
│  ↑                                    ↑                   │
│  └────── Auto-redeploy on push ───────┘                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
                            ↑
              Users access your frontend URL
            Scores sync to backend automatically
```

---

### Option 2: Render (Free)

```
┌────────────────────────────────────────────────────────────┐
│                  Production (Cloud)                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────────┐       ┌──────────────────────┐  │
│  │  Netlify (Free)     │       │  Render (Free)       │  │
│  │ (Frontend)          │       │ (Backend)            │  │
│  │                     │◄─────►│                      │  │
│  │ app.netlify.app     │       │ backend.onrender.com │  │
│  │                     │       │                      │  │
│  │ Build: npm build    │       │ May sleep after 15m  │  │
│  │ Output: dist/       │       │ inactivity (free)    │  │
│  └─────────────────────┘       └──────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
                       Note: Backend may
                    go to sleep on free tier
```

---

## Data Flow Diagram

### During Gameplay

```
User plays game
        ↓
Frontend (React)
    ├── Tracks moves
    ├── Updates UI
    └── Checks if solved
        ↓
    [Game Completed]
        ↓
Submit Score
        ↓
Backend API (POST /api/leaderboard)
        ↓
    ├── Validate data
    ├── Calculate score
    ├── Store in memory/DB
    └── Return entry
        ↓
Frontend
    └── Display confirmation
```

### Viewing Leaderboard

```
User opens leaderboard
        ↓
Frontend (React)
        ↓
GET /api/leaderboard
        ↓
Backend
    ├── Query all scores
    ├── Sort by score
    └── Return top 100
        ↓
Frontend
    ├── Display rankings
    ├── Format times
    └── Show medals
```

---

## File Structure & Deployment

### Frontend (Deployed to Vercel/Netlify)
```
Created files for deployment:
├── .env.production.example   ← Copy & configure for Vercel
├── vite.config.js            ← Already configured
├── src/
│   └── utils/
│       └── leaderboard.js    ← Updated to use env vars
└── package.json
    └── build script          ← Builds to dist/
```

**What gets deployed**: `dist/` folder (built app)

---

### Backend (Deployed to Railway/Render/Heroku)

```
Created files for deployment:
├── backend/.env              ← Local config
├── backend/.env.example      ← Template for deployment
├── backend/server.js         ← Main app
├── backend/package.json
│   ├── "start" script        ← Production run command
│   └── dependencies          ← Auto-installed on deploy
├── backend/routes/
│   └── leaderboard.js
└── backend/controllers/
    └── leaderboardController.js
```

**What gets deployed**: Everything in `/backend` (source code)

---

## Environment Variables

### Development (Local)

```
Frontend (.env):
   VITE_API_URL=http://localhost:3001/api

Backend (.env):
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
```

### Production (Deployed)

```
Frontend (Vercel):
   VITE_API_URL=https://your-backend-url.railway.app/api

Backend (Railway):
   PORT=3001 (auto-assigned)
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

## API Endpoints

All endpoints live at: `{BACKEND_URL}/api/leaderboard`

```
POST   /              Submit score
GET    /              Fetch all scores (with filters)
GET    /top           Get top scores
GET    /stats         Get statistics
```

**Requests**:
- Content-Type: `application/json`
- CORS enabled for frontend URL

**Response Format**:
```json
{
  "id": "uuid",
  "playerName": "John",
  "size": 3,
  "moves": 50,
  "time": 120,
  "algorithm": "manual",
  "heuristic": "none",
  "score": 0.45,
  "timestamp": "2026-02-24T10:30:00Z"
}
```

---

## Continuous Deployment Flow

```
Developer
    ↓
Edit code locally
    ↓
git add .
git commit -m "message"
git push origin main
    ↓
GitHub receives push
    ↓
┌─────────────────────────────────┬─────────────────────┐
│                                 │                     │
↓                                 ↓                     ↓
Vercel Webhook              Railway Webhook      (Optional DB)
    ↓                               ↓
Build frontend              Build backend
npm run build               npm install
    ↓                               ↓
Deploy to CDN               Deploy to container
    ↓                               ↓
Frontend live (seconds)    Backend live (minutes)
```

---

## Scaling Considerations

### Current Setup (Perfect for learning)
- ✅ In-memory leaderboard
- ✅ Single backend instance
- ✅ Works great for ≤ 1000 concurrent users
- ✅ No database costs

### To Scale (For production)
- Add MongoDB for persistent storage
- Add caching layer (Redis)
- Implement authentication
- Split into microservices
- Add real-time updates (Socket.io)

---

## Monitoring & Maintenance

### Check Backend Health
```bash
# From command line
curl https://your-backend-url/api/health

# From browser console
fetch('https://your-backend-url/api/health')
  .then(r => r.json())
  .then(console.log)
```

### View Deployment Logs
- **Railway**: Dashboard → Select service → "Logs" tab
- **Vercel**: Dashboard → Select project → "Deployments" → "Logs"
- **Render**: Dashboard → Select service → "Logs" tab

### Redeploy if Issues
```bash
# Backend (Railway)
- Make code change
- git push origin main
- Railway auto-redeploys (2-3 minutes)

# Frontend (Vercel)
- Make code change
- git push origin main
- Vercel auto-redeploys (1-2 minutes)
```

---

## Security Checklist

- ✅ Environment variables protected (never in git)
- ✅ CORS configured for frontend URL only
- ✅ Input validation on backend
- ✅ No sensitive data in logs
- ✅ HTTPS enforced on all connections

---

**Your deployment is now fully documented! 🎉**
