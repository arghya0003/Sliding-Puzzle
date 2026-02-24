# ⚡ Deployment Quick Reference

## 🎯 Fastest Path to Production (30 min)

### 1️⃣ Prepare
```bash
# Test everything works locally
cd backend && npm run dev  # Terminal 1
npm run dev                # Terminal 2 - test game & submit scores
```

### 2️⃣ GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/8-puzzle.git
git push -u origin main
```

### 3️⃣ Deploy Backend (Railway)
1. [railway.app](https://railway.app) → Sign in with GitHub
2. **New Project** → **Deploy from GitHub** → Select `8-puzzle`
3. Root Directory: `/backend`
4. Click **Deploy**
5. Copy URL: `https://xxxx.railway.app`

### 4️⃣ Deploy Frontend (Vercel)
1. [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import `8-puzzle` repository
3. **Environment Variables**:
   - `VITE_API_URL` = `https://xxxx.railway.app/api`
4. Click **Deploy**
5. Get URL: `https://xxxx.vercel.app`

### 5️⃣ Update CORS
1. Railway Dashboard → Your backend service
2. **Variables** → Update `FRONTEND_URL` = `https://xxxx.vercel.app`
3. Auto-redeploys (wait 2-3 min)

### ✅ Done! Your game is live!

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [QUICK_START.md](./QUICK_START.md) | Local development setup |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Platform comparisons & detailed setup |
| [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) | Step-by-step deployment workflow |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design & data flow diagrams |
| [GIT_SETUP.md](./GIT_SETUP.md) | Git & GitHub configuration |
| [BACKEND_SETUP.md](./BACKEND_SETUP.md) | Advanced backend config |

---

## 🔍 Verify Deployment

```bash
# Backend running?
curl https://your-backend-url/api/health

# Frontend accessible?
https://your-frontend-url/

# Leaderboard syncing?
1. Play a game
2. Submit score
3. Check leaderboard populated
```

---

## 🎯 Platform Comparison

| Platform | Frontend | Backend | Cost | Setup |
|----------|----------|---------|------|-------|
| **Vercel** | ✅ Free | ❌ | Free | 2 min |
| **Netlify** | ✅ Free | ❌ | Free | 2 min |
| **Railway** | ❌ | ✅ $5/mo | $5/mo | 10 min |
| **Render** | ❌ | ✅ Free* | Free | 10 min |
| **Heroku** | ❌ | ✅ Paid | Paid | 15 min |

*Render free tier sleeps after 15 min inactivity

---

## 🚨 Common Issues

| Error | Solution |
|-------|----------|
| CORS error | Backend `FRONTEND_URL` not set correctly |
| Blank leaderboard | Normal - submit a score first |
| Backend won't deploy | Check deployment logs for npm errors |
| Frontend won't deploy | Ensure `npm run build` works locally |
| Port 3001 in use | Kill existing process or change port |

---

## 🔑 Critical Environment Variables

**Frontend** → `.env.production`
```
VITE_API_URL=https://your-backend-url/api
```

**Backend** → Railway/Render/Heroku variables
```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

---

## 🚀 Deployed URLs

After deployment, your live game will be at:

**Frontend**: `https://your-project-name.vercel.app`

**Backend**: `https://your-backend-name.railway.app` (keep private)

**Share**: Just the frontend URL with your friends! 🎮

---

## 📖 Need Help?

1. **Local issues**: See [QUICK_START.md](./QUICK_START.md)
2. **Deployment questions**: Read [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Architecture details**: Check [ARCHITECTURE.md](./ARCHITECTURE.md)
4. **Step-by-step guide**: Follow [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)

---

**Ready to deploy? Start with [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)! 🚀**
