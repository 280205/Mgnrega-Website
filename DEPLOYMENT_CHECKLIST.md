# Deployment Checklist

## Pre-Deployment Checklist

### ☑️ Local Development Setup

- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] VS Code (or preferred IDE) installed
- [ ] All project files present in `Fellowship` folder

### ☑️ Environment Configuration

- [ ] `.env` file created in root directory
- [ ] Database password set (`DB_PASSWORD`)
- [ ] API key configured (`DATA_GOV_API_KEY`)
- [ ] All environment variables verified

### ☑️ Code Verification

- [ ] Backend TypeScript files present
- [ ] Frontend React files present
- [ ] Database schema exists
- [ ] Docker files configured
- [ ] Nginx configuration present

## Local Testing Checklist

### ☑️ Backend Testing

- [ ] Backend starts without errors: `cd backend && npm install && npm run dev`
- [ ] Health endpoint responds: `http://localhost:5000/api/health`
- [ ] Districts endpoint works: `http://localhost:5000/api/districts/UP`
- [ ] Performance endpoint works: `http://localhost:5000/api/performance/current/UP001`
- [ ] No TypeScript compilation errors
- [ ] Database connection successful
- [ ] Redis connection successful

### ☑️ Frontend Testing

- [ ] Frontend starts without errors: `cd frontend && npm install && npm run dev`
- [ ] Homepage loads: `http://localhost:3000`
- [ ] District selection works
- [ ] Language toggle works (हिंदी ↔ English)
- [ ] Auto-detect location button appears
- [ ] Search functionality works
- [ ] No console errors in browser
- [ ] Responsive design works on mobile view

### ☑️ Docker Testing

- [ ] Docker Compose builds successfully: `docker-compose build`
- [ ] All services start: `docker-compose up -d`
- [ ] All containers running: `docker-compose ps` (should show 5 containers)
- [ ] Backend accessible: `http://localhost/api/health`
- [ ] Frontend accessible: `http://localhost`
- [ ] Database accessible: Can connect via pgAdmin or psql
- [ ] Redis accessible: `docker-compose exec redis redis-cli ping`

### ☑️ Data Testing

- [ ] Mock data generated: `docker-compose exec backend node dist/jobs/dataSync.js`
- [ ] Districts appear in database: Check with SQL query
- [ ] Performance data exists: Check via API
- [ ] Historical data shows 12 months
- [ ] Comparison data works

## Production Deployment Checklist

### ☑️ Server Setup

- [ ] VPS/Server provisioned (minimum 2GB RAM)
- [ ] Ubuntu 20.04+ installed
- [ ] SSH access configured
- [ ] Root access or sudo privileges
- [ ] Server updated: `sudo apt update && sudo apt upgrade`

### ☑️ Server Dependencies

- [ ] Docker installed: `docker --version`
- [ ] Docker Compose installed: `docker-compose --version`
- [ ] Git installed: `git --version`
- [ ] Firewall configured: Ports 80, 443, 22 open
- [ ] Sufficient disk space: At least 10GB free

### ☑️ Code Deployment

- [ ] Repository cloned to server
- [ ] `.env` file created with production values
- [ ] Strong database password set
- [ ] API keys configured
- [ ] File permissions correct

### ☑️ Application Deployment

- [ ] Docker images built: `docker-compose build`
- [ ] Services started: `docker-compose up -d`
- [ ] All containers healthy: `docker-compose ps`
- [ ] Logs show no errors: `docker-compose logs`
- [ ] Health check passes: `curl http://localhost/api/health`

### ☑️ Database Setup

- [ ] PostgreSQL running
- [ ] Database initialized with schema
- [ ] Sample data loaded
- [ ] Connection pooling configured
- [ ] Backup strategy in place

### ☑️ Caching Setup

- [ ] Redis running
- [ ] Cache keys working
- [ ] TTL configured correctly
- [ ] Memory limit set

### ☑️ Web Server Setup

- [ ] Nginx running
- [ ] Reverse proxy configured
- [ ] Rate limiting active
- [ ] Compression enabled
- [ ] Security headers set

### ☑️ SSL/HTTPS (Optional but Recommended)

- [ ] Domain name configured (or using IP)
- [ ] DNS pointing to server
- [ ] Certbot installed
- [ ] SSL certificate obtained: `certbot --nginx -d domain.com`
- [ ] Auto-renewal configured
- [ ] HTTPS redirect enabled

## Post-Deployment Verification

### ☑️ Functionality Testing

- [ ] Homepage loads from public URL
- [ ] District selection works
- [ ] Dashboard displays correctly
- [ ] Charts render properly
- [ ] Language toggle works
- [ ] Geolocation feature works (on HTTPS only)
- [ ] Mobile responsive design verified
- [ ] Search functionality works

### ☑️ Performance Testing

- [ ] Page load time < 3 seconds
- [ ] API response time < 200ms (cached)
- [ ] API response time < 1s (uncached)
- [ ] No timeout errors
- [ ] Concurrent user handling: Test with 10+ simultaneous users

### ☑️ API Endpoints

- [ ] `GET /api/health` - Returns 200
- [ ] `GET /api/districts/UP` - Returns district list
- [ ] `GET /api/districts/locate/coordinates?lat=26.8467&lng=80.9462` - Returns district
- [ ] `GET /api/performance/current/UP001` - Returns current data
- [ ] `GET /api/performance/history/UP001` - Returns historical data
- [ ] `GET /api/performance/compare/UP001` - Returns comparison

### ☑️ Security Testing

- [ ] Rate limiting works: Test with rapid requests
- [ ] CORS configured correctly
- [ ] SQL injection protected: Test with malicious input
- [ ] XSS protected: Test with script tags
- [ ] Security headers present: Check with SecurityHeaders.com
- [ ] Sensitive data not exposed in errors
- [ ] Environment variables not committed to Git

### ☑️ Monitoring Setup

- [ ] Application logs accessible: `docker-compose logs`
- [ ] Error logging working
- [ ] Performance monitoring in place
- [ ] Disk space monitoring
- [ ] CPU/Memory monitoring
- [ ] Uptime monitoring (optional: UptimeRobot)

### ☑️ Backup & Recovery

- [ ] Database backup script created
- [ ] Backup schedule configured (daily recommended)
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

## Maintenance Checklist

### Daily Tasks

- [ ] Check service status: `docker-compose ps`
- [ ] Review error logs: `docker-compose logs --tail=100 backend`
- [ ] Monitor disk space: `df -h`
- [ ] Check API health: `curl http://localhost/api/health`

### Weekly Tasks

- [ ] Review all application logs
- [ ] Check database size and growth
- [ ] Verify backup completion
- [ ] Review rate limit logs for abuse
- [ ] Update dependencies if needed

### Monthly Tasks

- [ ] Update system packages: `sudo apt update && sudo apt upgrade`
- [ ] Review and archive old logs
- [ ] Test backup restoration
- [ ] Review security headers
- [ ] Check SSL certificate expiry

## Troubleshooting Checklist

### ☑️ Service Not Starting

- [ ] Check Docker is running: `sudo systemctl status docker`
- [ ] Check disk space: `df -h`
- [ ] Check logs: `docker-compose logs [service]`
- [ ] Verify environment variables: `cat .env`
- [ ] Restart service: `docker-compose restart [service]`

### ☑️ Database Issues

- [ ] Check PostgreSQL logs: `docker-compose logs postgres`
- [ ] Verify database exists: `docker-compose exec postgres psql -U postgres -l`
- [ ] Test connection: `docker-compose exec postgres pg_isready`
- [ ] Check connections: `docker-compose exec postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"`

### ☑️ Cache Issues

- [ ] Check Redis status: `docker-compose exec redis redis-cli ping`
- [ ] Check memory: `docker-compose exec redis redis-cli info memory`
- [ ] Clear cache if needed: `docker-compose exec redis redis-cli FLUSHALL`

### ☑️ Performance Issues

- [ ] Check container resources: `docker stats`
- [ ] Review slow queries in PostgreSQL logs
- [ ] Check Redis hit rate
- [ ] Verify CDN/caching working
- [ ] Check network latency

### ☑️ API Errors

- [ ] Check backend logs: `docker-compose logs backend`
- [ ] Verify database connection
- [ ] Verify Redis connection
- [ ] Check rate limiting
- [ ] Test individual endpoints with curl

## Success Criteria

### ✅ Launch Ready When:

- [ ] All services running without errors
- [ ] Health checks passing
- [ ] Sample data visible in UI
- [ ] All features working:
  - [ ] District selection
  - [ ] Data visualization
  - [ ] Language toggle
  - [ ] Geolocation (on HTTPS)
  - [ ] Search
  - [ ] Historical trends
  - [ ] Comparisons
- [ ] Performance meets targets:
  - [ ] Page load < 3s
  - [ ] API response < 1s
- [ ] Security measures active
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Documentation complete

## Quick Reference Commands

### Start Everything
```bash
docker-compose up -d
```

### Stop Everything
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Restart Service
```bash
docker-compose restart backend
```

### Check Status
```bash
docker-compose ps
```

### Generate Data
```bash
docker-compose exec backend node dist/jobs/dataSync.js
```

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres mgnrega_db > backup.sql
```

### Access Database
```bash
docker-compose exec postgres psql -U postgres mgnrega_db
```

### Clear Cache
```bash
docker-compose exec redis redis-cli FLUSHALL
```

### Check Health
```bash
curl http://localhost/api/health
```

## Final Verification

Before announcing to users:

- [ ] Test from multiple devices
- [ ] Test from multiple browsers
- [ ] Test from mobile network (not just WiFi)
- [ ] Have someone else test it
- [ ] Verify all metrics display correctly
- [ ] Check language switching multiple times
- [ ] Verify geolocation on mobile
- [ ] Test with slow internet connection
- [ ] Verify error messages are user-friendly

## Documentation Checklist

- [ ] README.md complete
- [ ] DEPLOYMENT.md reviewed
- [ ] ARCHITECTURE.md available
- [ ] API documentation ready
- [ ] User guide created (if needed)
- [ ] Troubleshooting guide accessible

---

## Sign-off

When all items above are checked:

**Deployed by:** ________________  
**Date:** ________________  
**Version:** 1.0.0  
**URL:** ________________  

**Notes:**
_________________________________________
_________________________________________
_________________________________________

**Status:** ⬜ In Progress  |  ☑️ **PRODUCTION READY**

---

## Support Contacts

- **Developer:** Your Name
- **Repository:** [GitHub URL]
- **Documentation:** [Docs URL]
- **Issues:** [Issue Tracker]

---

**Congratulations! 🎉**

Your MGNREGA Dashboard is ready to serve millions of citizens!
