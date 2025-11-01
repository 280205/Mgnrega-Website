# Testing Guide

## Overview

This guide covers testing strategies for the MGNREGA Dashboard.

## Testing Pyramid

```
      ┌────────────┐
      │   E2E      │  ← 10% (Critical user flows)
      ├────────────┤
      │Integration │  ← 30% (API + DB)
      ├────────────┤
      │   Unit     │  ← 60% (Business logic)
      └────────────┘
```

## Unit Tests

### Backend

```bash
cd backend
npm test
```

Test files located in `backend/src/__tests__/`

### Frontend

```bash
cd frontend
npm test
```

## Integration Tests

### API Testing

Test all API endpoints with real database:

```bash
cd backend
npm run test:integration
```

### Database Testing

Test database queries and migrations:

```bash
docker-compose exec postgres psql -U postgres mgnrega_db -f tests/test_queries.sql
```

## Manual Testing Checklist

### Frontend

- [ ] Homepage loads correctly
- [ ] District selection works
- [ ] Auto-detect location works
- [ ] Language toggle works (English ↔ Hindi)
- [ ] Charts render correctly
- [ ] Responsive design on mobile
- [ ] Accessibility (keyboard navigation)
- [ ] Error states display properly

### Backend

- [ ] Health check endpoint responds
- [ ] District list API works
- [ ] Performance data API works
- [ ] Geolocation API works
- [ ] Caching works (Redis)
- [ ] Rate limiting works
- [ ] Error handling works

### Performance

- [ ] Page load < 2 seconds
- [ ] API response < 200ms (cached)
- [ ] API response < 1s (uncached)
- [ ] No memory leaks
- [ ] Database queries optimized

### Security

- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] SQL injection protected
- [ ] XSS protected
- [ ] HTTPS enabled (production)

## Load Testing

### Using Apache Bench

```bash
# Test API endpoint
ab -n 1000 -c 10 http://localhost/api/health

# Test frontend
ab -n 1000 -c 10 http://localhost/
```

### Using Artillery

```bash
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost/api/districts/UP
```

## Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Accessibility Testing

### Tools
- Lighthouse (Chrome DevTools)
- axe DevTools
- WAVE browser extension

### Checklist
- [ ] All images have alt text
- [ ] Color contrast ratio > 4.5:1
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Focus indicators visible

## Mock Data Testing

Generate test data:

```bash
docker-compose exec backend node dist/jobs/dataSync.js
```

This creates 12 months of mock data for all districts.

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          cd backend && npm install && npm test
          cd ../frontend && npm install && npm test
```

## Production Smoke Tests

After deployment:

```bash
# Test health
curl https://your-domain.com/api/health

# Test API
curl https://your-domain.com/api/districts/UP

# Test frontend
curl -I https://your-domain.com/

# Test SSL
curl -vI https://your-domain.com/ 2>&1 | grep -i ssl
```

## Performance Monitoring

### Setup

```bash
# Install monitoring tools
npm install -g pm2

# Start with monitoring
pm2 start dist/index.js --name mgnrega-api
pm2 monit
```

### Metrics to Track

- Response time
- Request rate
- Error rate
- Memory usage
- CPU usage
- Database connections
- Cache hit rate

## Debugging

### Backend Logs

```bash
# View real-time logs
docker-compose logs -f backend

# View specific time range
docker-compose logs --since 1h backend
```

### Database Queries

```bash
# Enable query logging
docker-compose exec postgres psql -U postgres -c "ALTER SYSTEM SET log_statement = 'all';"
docker-compose restart postgres
```

### Redis Cache

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# View all keys
KEYS *

# Get cached value
GET districts:UP
```

## Test Data

### Sample Districts (UP)

```javascript
const testDistricts = [
  { code: 'UP001', name: 'Agra' },
  { code: 'UP002', name: 'Lucknow' },
  { code: 'UP003', name: 'Varanasi' }
];
```

### Sample Performance Data

```javascript
const testPerformance = {
  district_code: 'UP001',
  year: 2025,
  month: 10,
  person_days_generated: 450000,
  employment_provided: 8500,
  active_job_cards: 45000,
  average_wage: 225.50
};
```

## Common Issues and Solutions

### Issue: API returns 500 error

**Solution**:
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Issue: Database connection failed

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Issue: Cache not working

**Solution**:
```bash
# Check Redis status
docker-compose ps redis

# Clear cache
docker-compose exec redis redis-cli FLUSHALL
```

## Best Practices

1. **Test Early, Test Often**: Run tests before committing
2. **Mock External APIs**: Don't test against real data.gov.in
3. **Use Fixtures**: Predefined test data for consistency
4. **Isolate Tests**: Each test should be independent
5. **Clean Up**: Reset database/cache after tests
6. **Document Tests**: Clear test names and comments

## Test Coverage Goals

- Unit tests: > 80%
- Integration tests: > 60%
- E2E tests: Critical paths only
- Overall: > 70%

## Resources

- Jest Documentation: https://jestjs.io/
- React Testing Library: https://testing-library.com/
- Supertest (API testing): https://github.com/visionmedia/supertest
- Artillery (Load testing): https://artillery.io/
