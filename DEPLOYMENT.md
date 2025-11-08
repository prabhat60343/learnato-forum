# 🚀 Deployment Guide

This guide covers multiple deployment options for the Learnato Forum application.

## Table of Contents
1. [Docker Deployment](#docker-deployment)
2. [Render Deployment](#render-deployment)
3. [Vercel + Railway Deployment](#vercel--railway-deployment)
4. [Google Cloud Run](#google-cloud-run)
5. [Railway Deployment](#railway-deployment)
6. [Environment Variables](#environment-variables)

---

## 🐳 Docker Deployment

### Local Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Production Docker Deployment

1. **Update environment variables in `docker-compose.yml`** (if needed)

2. **Build and deploy:**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

---

## ☁️ Render Deployment

### Backend Deployment on Render

1. **Create a new Web Service:**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend:**
   - **Name:** `learnato-forum-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free tier is fine

3. **Environment Variables:**
   ```
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.onrender.com
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/learnato-forum (optional)
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://learnato-forum-backend.onrender.com`)

### Frontend Deployment on Render

1. **Create a new Static Site:**
   - Go to https://render.com
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend:**
   - **Name:** `learnato-forum-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

3. **Environment Variables:**
   ```
   VITE_API_URL=https://learnato-forum-backend.onrender.com
   ```

4. **Deploy:**
   - Click "Create Static Site"
   - Wait for deployment to complete

### Alternative: Frontend as Web Service on Render

If you prefer to use the Nginx setup:

1. **Create a new Web Service:**
   - **Root Directory:** `frontend`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `frontend/Dockerfile`

2. **Update `docker-compose.yml` or create `render.yaml`:**
   ```yaml
   services:
     - type: web
       name: learnato-forum-backend
       env: node
       rootDir: backend
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: PORT
           value: 5000
         - key: FRONTEND_URL
           value: https://learnato-forum-frontend.onrender.com
   
     - type: web
       name: learnato-forum-frontend
       env: docker
       rootDir: frontend
       dockerfilePath: frontend/Dockerfile
       envVars:
         - key: VITE_API_URL
           value: https://learnato-forum-backend.onrender.com
   ```

---

## ⚡ Vercel + Railway Deployment

### Backend on Railway

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend Service:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Environment Variables:**
   ```
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   MONGO_URI=your-mongodb-uri (optional)
   ```

5. **Get Railway URL:**
   - Copy the generated URL (e.g., `https://learnato-forum-backend.up.railway.app`)

### Frontend on Vercel

1. **Create Vercel Account:**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project:**
   - Click "New Project"
   - Import your GitHub repository
   - **Root Directory:** `frontend`

3. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://learnato-forum-backend.up.railway.app
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

---

## ☁️ Google Cloud Run

### Backend Deployment

1. **Install Google Cloud CLI:**
   ```bash
   # Download from https://cloud.google.com/sdk/docs/install
   ```

2. **Authenticate:**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Build and Deploy Backend:**
   ```bash
   cd backend
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/learnato-forum-backend
   gcloud run deploy learnato-forum-backend \
     --image gcr.io/YOUR_PROJECT_ID/learnato-forum-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars FRONTEND_URL=https://your-frontend-url
   ```

### Frontend Deployment

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/learnato-forum-frontend
   gcloud run deploy learnato-forum-frontend \
     --image gcr.io/YOUR_PROJECT_ID/learnato-forum-frontend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 80
   ```

---

## 🚂 Railway Deployment (Full Stack)

Railway can deploy both services together:

1. **Create Railway Project:**
   - Go to https://railway.app
   - Create new project from GitHub

2. **Add Backend Service:**
   - Click "New" → "GitHub Repo"
   - Select repository
   - **Root Directory:** `backend`
   - Set environment variables

3. **Add Frontend Service:**
   - Click "New" → "GitHub Repo"
   - Select same repository
   - **Root Directory:** `frontend`
   - Set `VITE_API_URL` to backend URL

4. **Deploy:**
   - Both services will deploy automatically
   - Railway provides URLs for each service

---

## 🔐 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# MongoDB (optional - will use in-memory if not provided)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/learnato-forum
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

### Production Environment Variables

#### Render
- Set in Render Dashboard → Environment → Environment Variables

#### Vercel
- Set in Vercel Dashboard → Project → Settings → Environment Variables

#### Railway
- Set in Railway Dashboard → Service → Variables

#### Cloud Run
- Set using `--set-env-vars` flag or Cloud Console

---

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] Test application locally
- [ ] Set up environment variables
- [ ] Update CORS settings in backend
- [ ] Test API endpoints
- [ ] Verify Socket.io connections

### Backend Deployment

- [ ] Deploy backend service
- [ ] Verify backend is accessible
- [ ] Test API endpoints
- [ ] Check Socket.io connection
- [ ] Verify CORS settings

### Frontend Deployment

- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Build frontend locally (test build)
- [ ] Deploy frontend
- [ ] Verify frontend is accessible
- [ ] Test all features
- [ ] Verify real-time updates work

### Post-Deployment

- [ ] Test creating posts
- [ ] Test adding replies
- [ ] Test upvoting
- [ ] Test search functionality
- [ ] Test mark as answered
- [ ] Test real-time updates
- [ ] Test on mobile devices
- [ ] Check browser console for errors

---

## 🔧 Troubleshooting

### CORS Errors

If you see CORS errors:

1. **Update backend `FRONTEND_URL`:**
   ```env
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Restart backend service**

### Socket.io Connection Issues

1. **Check WebSocket support:**
   - Ensure your hosting platform supports WebSockets
   - Render, Railway, and Cloud Run support WebSockets

2. **Update Socket.io URL:**
   - Make sure frontend connects to the correct backend URL

### Environment Variables Not Working

1. **Vite variables:**
   - Must start with `VITE_`
   - Rebuild after changing variables

2. **Backend variables:**
   - Restart service after changing variables

### Build Failures

1. **Check Node.js version:**
   - Ensure hosting platform uses Node.js 18+

2. **Check build logs:**
   - Review error messages in deployment logs

---

## 🎯 Recommended Deployment Strategy

### For Quick Deployment (Free Tier)
- **Backend:** Railway or Render
- **Frontend:** Vercel
- **Database:** MongoDB Atlas (free tier) or in-memory

### For Production
- **Backend:** Railway, Render, or Cloud Run
- **Frontend:** Vercel or Cloud Run
- **Database:** MongoDB Atlas
- **CDN:** Cloudflare (optional)

### For Maximum Control
- **Full Stack:** Railway (both services)
- **Database:** MongoDB Atlas
- **Monitoring:** Add logging and monitoring tools

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Docker Documentation](https://docs.docker.com)

---

## 🆘 Support

If you encounter issues during deployment:

1. Check the deployment logs
2. Verify environment variables are set correctly
3. Ensure ports are configured properly
4. Check CORS settings
5. Verify Socket.io WebSocket support

---

**Happy Deploying! 🚀**

