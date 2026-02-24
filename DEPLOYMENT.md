# 🚀 Deployment Guide - 8 Puzzle Game

## 📊 Deployment Overview

```
Your Architecture:
├── Frontend (React + Vite) → Vercel or Netlify
└── Backend (Express.js) → Railway, Render, or Heroku
```

---

## **Option 1: Railway (Recommended - Easiest)**

### Backend Deployment to Railway

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit with backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/8-puzzle.git
git push -u origin main
```

#### Step 2: Deploy Backend
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your `8-puzzle` repository
4. Railway auto-detects Node.js
5. Configure environment:
   - Click **"Variables"** tab
   - Set `PORT=3001`
   - Set `FRONTEND_URL=https://your-frontend-url.com` (add after frontend is deployed)

#### Step 3: Get Backend URL
- Your backend URL will be like: `https://8-puzzle-prod.railway.app`
- Copy this for frontend configuration

---

### Frontend Deployment to Vercel

#### Step 1: Update API URL
Update [src/utils/leaderboard.js](src/utils/leaderboard.js):
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';
```

#### Step 2: Create `.env.production`
```bash
VITE_API_URL=https://your-backend-url.railway.app/api
```

#### Step 3: Update leaderboard.js to use env variable
Replace the hardcoded API URL:
```javascript
// Before
const API_BASE_URL = 'http://localhost:3001/api';

// After
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

#### Step 4: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.railway.app/api`
6. Click **"Deploy"**

---

## **Option 2: Render (Free Alternative)**

### Backend Deployment to Render

#### Step 1: Connect Repository
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the root directory

#### Step 2: Configure Service
- **Name**: `8-puzzle-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or Starter)

#### Step 3: Add Environment Variables
- `PORT`: `3001`
- `NODE_ENV`: `production`
- `FRONTEND_URL`: (update after frontend deployed)

#### Step 4: Deploy
Click **"Create Web Service"** and wait for deployment.

---

## **Option 3: Heroku (Legacy but Still Works)**

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create 8-puzzle-backend

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Set environment variables
heroku config:set FRONTEND_URL=https://your-frontend-url.com
```

---

## **Netlify (Frontend Alternative)**

#### Step 1: Create `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[env.production]
  VITE_API_URL = "https://your-backend-url/api"
```

#### Step 2: Deploy
1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub
4. Select repository
5. Add build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables in Site settings
7. Click **"Deploy"**

---

## **Full Deployment Checklist**

- [ ] Code pushed to GitHub
- [ ] Backend deployed (Railway/Render/Heroku)
- [ ] Backend URL copied
- [ ] Frontend `.env.production` configured with backend URL
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Frontend URL obtained
- [ ] Backend CORS updated with frontend URL
  ```bash
  # In backend/.env
  FRONTEND_URL=https://your-frontend-url.com
  ```
- [ ] Test leaderboard API:
  ```bash
  curl https://your-backend-url/api/health
  ```
- [ ] Play game and submit score to verify end-to-end connectivity

---

## **Troubleshooting Deployment**

### CORS Issues
**Problem**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**: Update `backend/.env`:
```env
FRONTEND_URL=https://your-deployed-frontend-url.com
```

Then redeploy backend.

### Backend Won't Start
**Check logs**:
- Railway: Click **"Logs"** tab
- Render: Click **"Events"** tab
- Heroku: Run `heroku logs --tail`

### API Not Accessible
1. Verify backend is running: Visit `/api/health` endpoint
2. Check environment variables are set correctly
3. Ensure CORS is configured with correct frontend URL

### Port Issues
- Don't hardcode ports in code
- Use `process.env.PORT` in backend
- Production platforms assign ports automatically

---

## **Advanced: Database (MongoDB)**

After deploying backend successfully, add MongoDB:

1. Create account at [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Create free database cluster
3. Get connection string
4. Add to backend `.env`:
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/puzzle
   ```
5. Update [backend/controllers/leaderboardController.js](backend/controllers/leaderboardController.js) to use MongoDB instead of in-memory storage

---

## **Cost Breakdown**

| Service | Frontend | Backend | Cost |
|---------|----------|---------|------|
| **Vercel** | Free | - | Free |
| **Netlify** | Free | - | Free |
| **Railway** | - | $5/month | $5/month |
| **Render** | - | Free | Free* |
| **MongoDB Atlas** | - | - | Free (5GB) |

*Render free tier may sleep after inactivity

---

## **Recommended Stack**

🥇 **Best for beginners**:
- Frontend: **Vercel** (or Netlify)
- Backend: **Railway** ($5/month)
- Total: ~$5/month

🥈 **Free option**:
- Frontend: **Vercel**
- Backend: **Render** (free tier)
- Note: Backend sleeps after 15 min inactivity

---

## **After Deployment**

1. Test your game: Visit frontend URL
2. Play a game and submit score
3. Verify leaderboard populated on backend
4. Share your deployed URL!

Questions? Check platform-specific docs or deployment logs.
