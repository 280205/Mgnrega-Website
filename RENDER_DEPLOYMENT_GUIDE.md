# Render Deployment Guide

## Prerequisites
1. GitHub account
2. Render account (free tier): https://render.com
3. Git installed on your computer

## Step 1: Update Production Config

Before deploying, update the API URL in `frontend/public/config.js` with your Render backend URL:

```javascript
window.APP_CONFIG = {
  API_URL: 'https://mgnrega-backend.onrender.com'  // Replace with your actual backend URL
};
```

## Step 2: Create GitHub Repository

1. Go to https://github.com and create a new repository
2. Name it: `mgnrega-dashboard` (or any name you prefer)
3. Keep it public or private (your choice)
4. **Do NOT** initialize with README (we already have files)

## Step 3: Push Code to GitHub

Open PowerShell in the project folder and run:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - MGNREGA Dashboard for Uttar Pradesh"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mgnrega-dashboard.git

# Push to GitHub
git push -u origin main
```

If you get an error about 'master' branch, try:
```powershell
git branch -M main
git push -u origin main
```

## Step 4: Deploy Backend on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `mgnrega-backend`
   - **Region**: Singapore or closest to India
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Click **Advanced** and add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `CORS_ORIGIN` = `https://mgnrega-frontend.onrender.com` (we'll update this)

6. Click **Create Web Service**

7. **IMPORTANT**: Copy your backend URL (e.g., `https://mgnrega-backend.onrender.com`)

## Step 5: Update Frontend Config

1. Update `frontend/public/config.js` with your backend URL:
```javascript
window.APP_CONFIG = {
  API_URL: 'https://mgnrega-backend.onrender.com'  // Your actual backend URL
};
```

2. Commit and push the change:
```powershell
git add frontend/public/config.js
git commit -m "Update API URL for production"
git push
```

## Step 6: Deploy Frontend on Render

1. In Render dashboard, click **New +** → **Web Service**
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `mgnrega-frontend`
   - **Region**: Same as backend (Singapore)
   - **Root Directory**: `frontend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -p $PORT`
   - **Plan**: Free

4. Click **Create Web Service**

5. **IMPORTANT**: Copy your frontend URL (e.g., `https://mgnrega-frontend.onrender.com`)

## Step 7: Update CORS Settings

1. Go to backend service in Render dashboard
2. Click **Environment** tab
3. Update `CORS_ORIGIN` to your frontend URL:
   - `CORS_ORIGIN` = `https://mgnrega-frontend.onrender.com`

4. Service will automatically redeploy

## Step 8: Test Your Deployment

1. Visit your frontend URL: `https://mgnrega-frontend.onrender.com`
2. You should see the MGNREGA Dashboard
3. Test:
   - District selection works
   - Dashboard displays data
   - Auto-detect location works (if you allow location access)

## Important Notes

### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- First request may take 30-60 seconds to wake up
- 750 hours/month free (enough for one service running 24/7)

### Troubleshooting

**Issue**: Backend not responding
- Check if backend service is active in Render dashboard
- Check logs: Render dashboard → Your service → Logs
- Verify health check endpoint: `https://your-backend-url.onrender.com/api/health`

**Issue**: Frontend shows connection error
- Verify `frontend/public/config.js` has correct backend URL
- Check browser console for CORS errors
- Verify CORS_ORIGIN environment variable in backend

**Issue**: Districts not loading
- Open browser DevTools (F12) → Network tab
- Check if API calls are going to correct URL
- Verify backend is returning data: `https://your-backend-url.onrender.com/api/districts/UP`

**Issue**: 404 on refresh
- This is normal - Render will handle it automatically with our configuration
- The serve package is configured with `-s` flag for SPA support

### Monitoring

Check service health:
- Backend: `https://your-backend-url.onrender.com/api/health`
- Frontend: `https://your-frontend-url.onrender.com`

View logs:
- Render dashboard → Your service → Logs tab

### Updating Your App

When you make changes:
```powershell
git add .
git commit -m "Your change description"
git push
```

Render will automatically:
1. Detect the push
2. Rebuild your services
3. Deploy new version

## Alternative: Deploy Using render.yaml

If you want to deploy both services together:

1. Update `frontend/public/config.js` with backend URL first
2. Push to GitHub
3. In Render dashboard: **New +** → **Blueprint**
4. Connect your repository
5. Render will read `render.yaml` and create both services
6. After deployment, update CORS_ORIGIN in backend with frontend URL

## Cost Optimization

To avoid running out of free hours:
- Deploy only one service on free tier
- Run backend locally and deploy only frontend
- Or use a single combined deployment

## Support

If you face issues:
1. Check Render logs
2. Check browser console (F12)
3. Verify environment variables
4. Test backend health endpoint
5. Review this guide again

Good luck with your deployment! 🚀
