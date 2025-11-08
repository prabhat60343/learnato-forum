# ⚡ Quick Vercel Deployment

## 🎯 Fastest Way to Deploy

### 1. Deploy Backend (Railway - 5 minutes)

```bash
# Go to https://railway.app
# 1. Sign up with GitHub
# 2. New Project → Deploy from GitHub
# 3. Select your repo
# 4. Add service → Root Directory: backend
# 5. Add environment variables:
#    - PORT=5000
#    - FRONTEND_URL=https://your-frontend.vercel.app (update after frontend deploys)
#    - NODE_ENV=production
# 6. Copy the Railway URL
```

### 2. Deploy Frontend (Vercel - 3 minutes)

```bash
# Option A: Using Vercel Website (Easiest)
# 1. Go to https://vercel.com
# 2. Sign up with GitHub
# 3. New Project → Import GitHub repo
# 4. Settings:
#    - Root Directory: frontend
#    - Framework: Vite (auto-detected)
# 5. Environment Variables:
#    - VITE_API_URL=https://your-backend.up.railway.app
# 6. Deploy!

# Option B: Using Vercel CLI
npm i -g vercel
cd frontend
vercel
# Follow prompts, set VITE_API_URL when asked
vercel --prod
```

### 3. Update Backend CORS

```bash
# Go back to Railway
# Update FRONTEND_URL to your Vercel URL
# Restart service
```

### 4. Test!

- Visit your Vercel URL
- Create a post
- Test all features

## 🎉 Done!

Your app is now live on:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.up.railway.app`

## 📚 Need More Details?

See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for complete guide.

