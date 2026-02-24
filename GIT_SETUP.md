# 📝 Git & GitHub Setup

## Step 1: Initialize Git Repository

```bash
cd "c:\Users\KIIT0001\Desktop\8 puzzle"
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 2: Create `.gitignore`

```bash
# Root .gitignore
```

Create file: `.gitignore` in project root
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
.vscode/
.idea/
```

---

## Step 3: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `8-puzzle`
3. **Description**: `Interactive 8-Puzzle Game with Backend`
4. **Public** (choose private if preferred)
5. **Do NOT** initialize with README/gitignore (we have them)
6. Click **"Create repository"**

---

## Step 4: Connect Local to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/8-puzzle.git

# Rename branch to main (if needed)
git branch -M main

# Add all files
git add .

# First commit
git commit -m "Initial commit: 8-puzzle game with Express backend"

# Push to GitHub
git push -u origin main
```

---

## Step 5: Verify on GitHub

- Go to your repository: `https://github.com/YOUR_USERNAME/8-puzzle`
- You should see all your code uploaded
- Check that `.env` files are NOT uploaded (only `.example` files)

---

## Deployment: Connecting Platforms

### Railway
1. Visit [railway.app](https://railway.app)
2. Sign up → Authorize GitHub
3. Click **"New Project"** → **"Deploy from GitHub"**
4. Find and select `8-puzzle` repository
5. Select the `/backend` directory
6. Configure environment variables
7. Deploy automatically on each push!

### Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign up → Authorize GitHub
3. Click **"Add New"** → **"Project"**
4. Find and select `8-puzzle` repository
5. Configure build settings:
   - **Framework**: Vite
   - **Root Directory**: `.` (root)
6. Add environment variables (see DEPLOYMENT.md)
7. Click **"Deploy"**

---

## Continuous Deployment

After initial setup:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main
```

Then:
- ✅ Railway automatically redeploys backend
- ✅ Vercel automatically redeploys frontend
- ✅ No manual deployment needed!

---

## Useful Git Commands

```bash
# Check status
git status

# View changes
git diff

# View commit history
git log --oneline

# Undo changes
git restore <filename>

# Revert last commit
git reset --soft HEAD~1
```

---

## GitHub Best Practices

✅ **Do**:
- Commit frequently with clear messages
- Use `.gitignore` for secrets and node_modules
- Create branches for major features
- Write descriptive commit messages

❌ **Don't**:
- Commit `.env` files with secrets
- Commit `node_modules/` or `dist/`
- Use vague commit messages ("fix", "update")
- Commit sensitive API keys

---

## Getting Help

- Git docs: [git-scm.com](https://git-scm.com/doc)
- GitHub CLI: [cli.github.com](https://cli.github.com)
- GitHub Guides: [github.com/skills](https://github.com/skills)
