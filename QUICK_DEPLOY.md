# Quick Deployment Steps

## 1️⃣ Update Config (IMPORTANT!)
Edit `frontend/public/config.js`:
```javascript
window.APP_CONFIG = {
  API_URL: 'https://YOUR-BACKEND-URL.onrender.com'
};
```

## 2️⃣ Push to GitHub
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mgnrega-dashboard.git
git push -u origin main
```

## 3️⃣ Deploy Backend
- Render Dashboard → New → Web Service
- Root Directory: `backend`
- Build: `npm install`
- Start: `npm start`
- Environment Variables:
  - NODE_ENV = production
  - PORT = 10000
  - CORS_ORIGIN = (your frontend URL)

## 4️⃣ Deploy Frontend
- Render Dashboard → New → Web Service
- Root Directory: `frontend`
- Build: `npm install && npm run build`
- Start: `npx serve -s dist -p $PORT`

## 5️⃣ Update Config Again
- Update `frontend/public/config.js` with actual backend URL
- Push changes to GitHub
- Render auto-deploys

## 6️⃣ Update CORS
- Backend service → Environment → Update CORS_ORIGIN with frontend URL

## ✅ Test
Visit your frontend URL and test all features!

---

**Need Help?** See full guide: `RENDER_DEPLOYMENT_GUIDE.md`
