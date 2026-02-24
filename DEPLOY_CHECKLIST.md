# 🚀 Complete Deployment Workflow

## Overview

```
Local Development
        ↓
GitHub Repository
        ↓
Railway Backend ← → Vercel Frontend
```

---

## 🎯 Quick Deployment (30 minutes)

### Phase 1: Prepare Code (5 min)

- [ ] Test locally: both backend and frontend running
- [ ] Review [DEPLOYMENT.md](DEPLOYMENT.md)
- [ ] Choose deployment platform:
  - **Recommended**: Railway (backend) + Vercel (frontend)
  - **Budget**: Render (free) + Netlify (free)

### Phase 2: Setup Git & GitHub (5 min)

Follow [GIT_SETUP.md](GIT_SETUP.md):

```bash
cd "c:\Users\KIIT0001\Desktop\8 puzzle"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/8-puzzle.git
git push -u origin main
```

### Phase 3: Deploy Backend (10 min)

**Using Railway** (Recommended):

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. **New Project** → **Deploy from GitHub** → Select `8-puzzle`
4. Select `/backend` directory
5. Click **Deploy**
6. Wait for build to complete
7. Copy your backend URL: `https://xxxxx.railway.app`

**Using Render** (Free):

1. Go to [render.com](https://render.com)
2. **New +** → **Web Service**
3. Connect GitHub & select repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Deploy

### Phase 4: Deploy Frontend (5 min)

**Using Vercel**:

1. Go to [vercel.com](https://vercel.com)
2. **Add New** → **Project**
3. Import your `8-puzzle` repository
4. Configure:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output: `dist`
5. **Environment Variables**:
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL/api`
6. Click **Deploy**
7. Get your frontend URL

### Phase 5: Update Backend CORS (5 min)

1. Go to Railway dashboard
2. Select your backend service
3. **Variables** tab
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   https://your-project.vercel.app
   ```
5. Service auto-redeploys

---

## ✅ Verification Checklist

After deployment:

- [ ] Backend health check works:
  ```
  https://your-backend.railway.app/api/health
  ```

- [ ] Frontend loads:
  ```
  https://your-project.vercel.app
  ```

- [ ] Play a game and submit score
- [ ] Check leaderboard populated
- [ ] No CORS errors in console (F12)

---

## 📊 What Gets Deployed

### Frontend (Vercel)
```
/src
/public
/index.html
/package.json
vite.config.js
```

### Backend (Railway)
```
/backend/server.js
/backend/routes/
/backend/controllers/
/backend/package.json
```

---

## 🔧 Environment Variables Reference

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url/api
```

### Backend (Railway/Render/Heroku)
```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

---

## 🐛 Troubleshooting

### CORS Error: "Access-Control-Allow-Origin"

**Cause**: Backend CORS not configured correctly

**Fix**:
1. Go to backend deployment dashboard
2. Update `FRONTEND_URL` with exact frontend URL
3. Redeploy backend
4. Wait 2 minutes and refresh frontend

### "Cannot GET /" on Backend

**Cause**: Trying to access backend directly in browser (expected)

**Normal**: Backend only responds to API calls. Test with:
```
https://your-backend.railway.app/api/health
```

### Leaderboard Empty After Deployment

**Expected**: You deployed with fresh backend. 
- Play a game and submit score
- Submit scores from multiple browsers
- Leaderboard will populate with each new score

### Backend Won't Build

**Check deployment logs**:
- Railway: Click **"Logs"** tab on deployment
- Render: Check **"Events"** panel
- Look for errors in npm install or npm start

---

## 📱 Testing Production Deployment

### Test Leaderboard API

```bash
# Submit a test score
curl -X POST https://your-backend-url/api/leaderboard \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "TestPlayer",
    "size": 3,
    "moves": 50,
    "time": 120,
    "algorithm": "manual",
    "heuristic": "none"
  }'

# Fetch leaderboard
curl https://your-backend-url/api/leaderboard

# Get stats
curl https://your-backend-url/api/leaderboard/stats
```

### Test from Browser Console

```javascript
// Test API connectivity
fetch('https://your-backend-url/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Submit test score
fetch('https://your-backend-url/api/leaderboard', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    playerName: 'TestPlayer',
    size: 3,
    moves: 50,
    time: 120,
    algorithm: 'manual',
    heuristic: 'none'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

---

## 🎉 You're Deployed!

**Share your game:**
```
Frontend: https://your-project.vercel.app
Backend: https://your-backend.railway.app (keep private)
```

---

## 📈 Next Steps (Optional)

- [ ] Add MongoDB for persistent database
- [ ] Implement user authentication
- [ ] Add real-time multiplayer with WebSockets
- [ ] Custom domain name
- [ ] SSL certificate (auto-included)
- [ ] Analytics/monitoring

See [DEPLOYMENT.md](DEPLOYMENT.md) for advanced topics.

---

## 📞 Support Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Express.js**: [expressjs.com](https://expressjs.com)
- **Vite**: [vitejs.dev](https://vitejs.dev)

---

**Your 8-Puzzle Game is now live! 🎮**
