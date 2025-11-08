# 🚀 Vercel Deployment Guide

This guide covers deploying the Learnato Forum to Vercel.

## 📋 Overview

- **Frontend:** Deploy on Vercel (recommended - excellent for React/Vite apps)
- **Backend:** Deploy on Railway or Render (Vercel serverless functions don't support Socket.io well)

## 🎯 Option 1: Frontend on Vercel + Backend on Railway (Recommended)

### Step 1: Deploy Backend on Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Backend Service**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - **Root Directory:** `backend`
   - Railway will auto-detect Node.js

4. **Configure Environment Variables**
   - Click on the service → "Variables"
   - Add:
     ```
     PORT=5000
     FRONTEND_URL=https://your-frontend.vercel.app
     NODE_ENV=production
     MONGO_URI=your-mongodb-uri (optional)
     ```

5. **Deploy**
   - Railway will automatically deploy
   - Copy the generated URL (e.g., `https://learnato-forum-backend.up.railway.app`)

### Step 2: Deploy Frontend on Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Project Settings**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Set Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend.up.railway.app
     ```
   - Select "Production", "Preview", and "Development"

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Vercel will provide a URL (e.g., `https://learnato-forum.vercel.app`)

6. **Update Backend CORS**
   - Go back to Railway
   - Update `FRONTEND_URL` environment variable to your Vercel URL
   - Restart the service

### Step 3: Test Deployment

1. Visit your Vercel URL
2. Test creating a post
3. Test adding replies
4. Test upvoting
5. Test real-time updates (open in two browsers)

---

## 🎯 Option 2: Frontend on Vercel + Backend on Render

### Step 1: Deploy Backend on Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name:** `learnato-forum-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

4. **Set Environment Variables**
   ```
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   MONGO_URI=your-mongodb-uri (optional)
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Copy the URL (e.g., `https://learnato-forum-backend.onrender.com`)

### Step 2: Deploy Frontend on Vercel

Follow the same steps as Option 1, Step 2, but use the Render backend URL:

```
VITE_API_URL=https://learnato-forum-backend.onrender.com
```

---

## 🎯 Option 3: Full Stack on Vercel (Experimental)

**Note:** Vercel serverless functions have limitations with Socket.io. This setup uses API routes instead of WebSockets.

### Alternative: Use Vercel for Both (Without Real-time)

If you want to deploy both on Vercel, you'll need to:
1. Convert backend to Vercel serverless functions
2. Use polling instead of WebSockets for real-time updates
3. Or use a separate WebSocket service

**This is not recommended** for this project as it loses real-time functionality.

---

## 🔧 Vercel Configuration

### Frontend `vercel.json`

The project includes a `vercel.json` file in the `frontend` directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Environment Variables

#### Frontend (Vercel)
- `VITE_API_URL` - Your backend API URL

#### Backend (Railway/Render)
- `PORT` - Server port (usually 5000)
- `FRONTEND_URL` - Your Vercel frontend URL
- `NODE_ENV` - Set to `production`
- `MONGO_URI` - MongoDB connection string (optional)

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] Code is committed to GitHub
- [ ] Backend works locally
- [ ] Frontend works locally
- [ ] Environment variables are prepared

### Backend Deployment
- [ ] Backend deployed on Railway/Render
- [ ] Backend URL is accessible
- [ ] Environment variables are set
- [ ] API endpoints are working
- [ ] Socket.io is working (test with a WebSocket client)

### Frontend Deployment
- [ ] Frontend deployed on Vercel
- [ ] Environment variables are set
- [ ] Frontend URL is accessible
- [ ] Frontend can connect to backend
- [ ] All features are working

### Post-Deployment
- [ ] Test creating posts
- [ ] Test adding replies
- [ ] Test upvoting
- [ ] Test search
- [ ] Test mark as answered
- [ ] Test real-time updates
- [ ] Test on mobile devices
- [ ] Check browser console for errors

---

## 🔍 Troubleshooting

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**
1. Update `FRONTEND_URL` in backend environment variables
2. Include the full Vercel URL (e.g., `https://learnato-forum.vercel.app`)
3. Restart backend service

### Socket.io Connection Issues

**Problem:** Real-time updates not working

**Solution:**
1. Verify backend URL is correct in frontend
2. Check if Railway/Render supports WebSockets (they do)
3. Check browser console for WebSocket errors
4. Verify Socket.io URL in network tab

### Build Failures

**Problem:** Vercel build fails

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure `frontend` is set as root directory
3. Verify Node.js version (Vercel uses Node 18+ by default)
4. Check if all dependencies are in `package.json`

### Environment Variables Not Working

**Problem:** Frontend can't access backend

**Solution:**
1. Vite variables must start with `VITE_`
2. Redeploy after changing environment variables
3. Clear browser cache
4. Check if variables are set for all environments (Production, Preview, Development)

### 404 Errors on Refresh

**Problem:** Getting 404 when refreshing pages

**Solution:**
- The `vercel.json` file includes rewrites to handle this
- Ensure `vercel.json` is in the `frontend` directory
- Redeploy if needed

---

## 🚀 Quick Deploy Commands

### Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   # Enter your backend URL when prompted
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## 📊 Recommended Setup

### For Best Performance
- **Frontend:** Vercel (excellent CDN and performance)
- **Backend:** Railway (better for Node.js apps with WebSockets)
- **Database:** MongoDB Atlas (free tier available)

### For Free Tier
- **Frontend:** Vercel (free tier)
- **Backend:** Railway free tier or Render free tier
- **Database:** In-memory (no database needed) or MongoDB Atlas free tier

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Frontend loads on Vercel URL
- ✅ Can create posts
- ✅ Can add replies
- ✅ Can upvote posts
- ✅ Real-time updates work (see changes instantly)
- ✅ Search works
- ✅ Mark as answered works
- ✅ No console errors
- ✅ Works on mobile devices

---

**Happy Deploying! 🚀**

If you encounter any issues, check the troubleshooting section or refer to the main [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

