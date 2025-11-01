# Environment Configuration

## Local Development

For local development, use the default configuration:

**frontend/public/config.js**:
```javascript
window.APP_CONFIG = {
  API_URL: 'http://localhost:5000'
};
```

**Start servers**:
```powershell
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000

---

## Production (Render)

### Before First Deployment

**frontend/public/config.js**:
```javascript
window.APP_CONFIG = {
  API_URL: 'https://mgnrega-backend.onrender.com'  // Use YOUR backend URL
};
```

### After Deployment

Once you have your actual Render URLs:

1. **Update frontend/public/config.js**:
```javascript
window.APP_CONFIG = {
  API_URL: 'https://YOUR-ACTUAL-BACKEND-URL.onrender.com'
};
```

2. **Update backend CORS_ORIGIN** (in Render dashboard):
```
CORS_ORIGIN=https://YOUR-ACTUAL-FRONTEND-URL.onrender.com
```

3. **Push changes**:
```powershell
git add frontend/public/config.js
git commit -m "Update production API URL"
git push
```

Render will automatically redeploy both services.

---

## Configuration Files

### Backend Environment Variables (Render)
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

### Frontend Config (public/config.js)
```javascript
window.APP_CONFIG = {
  API_URL: 'https://your-backend-url.onrender.com'
};
```

---

## Testing Configuration

### Test Backend
```
GET https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test API
```
GET https://your-backend-url.onrender.com/api/districts/UP
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "code": "AGR",
      "name": "Agra",
      "state_code": "UP",
      "state_name": "Uttar Pradesh"
    },
    ...
  ]
}
```

### Test Frontend
Visit: https://your-frontend-url.onrender.com

Check browser console (F12) for any API connection errors.

---

## Common Mistakes

❌ **Wrong API URL format**
```javascript
API_URL: 'mgnrega-backend.onrender.com'  // Missing https://
```

✅ **Correct format**
```javascript
API_URL: 'https://mgnrega-backend.onrender.com'
```

❌ **CORS mismatch**
```
Backend CORS_ORIGIN: https://mgnrega-frontend.onrender.com
Frontend URL: https://different-url.onrender.com
```

✅ **Matching CORS**
```
Backend CORS_ORIGIN: https://mgnrega-frontend.onrender.com
Frontend URL: https://mgnrega-frontend.onrender.com
```

❌ **Forgot to push config changes**
```
Updated config.js locally but didn't git push
```

✅ **Always push changes**
```powershell
git add .
git commit -m "Update config"
git push
```

---

## Rollback Plan

If deployment fails:

1. **Check Render logs**:
   - Dashboard → Your Service → Logs

2. **Revert to local config**:
```javascript
window.APP_CONFIG = {
  API_URL: 'http://localhost:5000'
};
```

3. **Test locally first**:
```powershell
cd backend && npm start
cd frontend && npm run dev
```

4. **Fix issues, then redeploy**

---

## Switching Between Environments

### Local → Production
1. Update `frontend/public/config.js` with Render backend URL
2. Push to GitHub
3. Render auto-deploys

### Production → Local
1. Update `frontend/public/config.js` back to localhost
2. Test locally
3. Don't push this change!

---

## Pro Tips

💡 **Use different branches**:
```powershell
# Keep main branch for production config
git checkout -b local-dev

# Make local config changes
# Don't merge to main
```

💡 **Create config templates**:
- `config.local.js` - localhost
- `config.production.js` - Render
- Copy appropriate file to `config.js` when needed

💡 **Environment detection**:
```javascript
window.APP_CONFIG = {
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : 'https://mgnrega-backend.onrender.com'
};
```
