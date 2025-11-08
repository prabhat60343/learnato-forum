# 🔧 Fixing Vercel 404 Errors

## Problem
Getting 404 errors on Vercel deployment means the build files aren't being found.

## Solution

### Option 1: Configure Root Directory in Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project

2. **Go to Settings**
   - Click on "Settings" tab

3. **Configure General Settings**
   - **Root Directory:** Set to `frontend`
   - **Framework Preset:** Vite (or leave as auto-detected)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"

### Option 2: Use Root-Level vercel.json

If you want to deploy from the root:

1. **Delete or ignore** `frontend/vercel.json`
2. **Use the root-level** `vercel.json` (already created)
3. **Redeploy**

### Option 3: Check Build Logs

1. **Go to Deployments**
   - Click on the failed deployment
   - Check "Build Logs"

2. **Common Issues:**
   - Build failing? Check for errors
   - Missing dependencies? Check package.json
   - Wrong Node version? Vercel uses Node 18+ by default

## Quick Fix Steps

1. **Verify Vercel Settings:**
   ```
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

2. **Check Environment Variables:**
   - Go to Settings → Environment Variables
   - Ensure `VITE_API_URL` is set

3. **Redeploy:**
   - Go to Deployments
   - Click "Redeploy"

4. **Test:**
   - Visit your Vercel URL
   - Should see the app, not 404

## Troubleshooting

### Still Getting 404?

1. **Check Build Output:**
   - Go to deployment logs
   - Verify `dist` folder is created
   - Check if `index.html` exists in `dist`

2. **Verify vercel.json:**
   - Should have rewrites for SPA routing
   - Should point to `/index.html`

3. **Check File Structure:**
   ```
   frontend/
     ├── dist/          (created after build)
     │   ├── index.html
     │   └── assets/
     ├── src/
     ├── package.json
     └── vercel.json
   ```

4. **Manual Build Test:**
   ```bash
   cd frontend
   npm install
   npm run build
   ls dist  # Should see index.html and assets
   ```

### Build Failing?

1. **Check Node Version:**
   - Vercel uses Node 18+ by default
   - Can specify in `package.json`:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

2. **Check Dependencies:**
   - Ensure all dependencies are in `package.json`
   - Run `npm install` locally to verify

3. **Check Build Errors:**
   - Review build logs in Vercel
   - Fix any errors shown

## Correct Vercel Configuration

### In Vercel Dashboard:
- **Root Directory:** `frontend`
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Environment Variables:
- `VITE_API_URL` = Your backend URL

## After Fixing

1. ✅ Build should complete successfully
2. ✅ Deployment should show "Ready"
3. ✅ Visiting URL should show your app
4. ✅ No more 404 errors

## Still Having Issues?

1. Check Vercel build logs for specific errors
2. Verify all files are committed to GitHub
3. Try deploying from a fresh branch
4. Contact Vercel support if needed

