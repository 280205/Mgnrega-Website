# Architecture Documentation

## System Overview

The MGNREGA District Performance Dashboard is a full-stack web application designed to make government employment data accessible to rural Indian citizens with low literacy levels.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                   ┌───────────┐
                   │   Nginx   │  ← Reverse Proxy + Rate Limiting
                   │   (Port   │     SSL Termination
                   │    80)    │     Static Asset Caching
                   └─────┬─────┘
                         │
         ┌───────────────┼────────────────┐
         │               │                │
         ▼               ▼                ▼
    ┌────────┐     ┌──────────┐    ┌──────────┐
    │ React  │     │ Express  │    │  Redis   │
    │Frontend│     │ Backend  │    │  Cache   │
    │(Port 3k│     │(Port 5k) │    │(Port 6379│
    └────────┘     └─────┬────┘    └──────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ PostgreSQL  │
                  │  Database   │
                  │ (Port 5432) │
                  └─────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ Data.gov.in │
                  │     API     │
                  └─────────────┘
```

## Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive, mobile-first design
- **Recharts** for data visualization
- **Axios** for API communication
- **React Router** for navigation
- **Vite** for fast development and optimized builds

### Backend
- **Node.js 18** with Express framework
- **TypeScript** for type safety
- **PostgreSQL 14** for relational data storage
- **Redis 7** for caching and session management
- **Node-cron** for scheduled tasks
- **Winston** for logging

### Infrastructure
- **Docker** for containerization
- **Docker Compose** for orchestration
- **Nginx** for reverse proxy and load balancing
- **Ubuntu 20.04+** as host OS

## Key Design Decisions

### 1. Offline-First Architecture

**Problem**: data.gov.in API may have downtime or rate limits

**Solution**: 
- Local PostgreSQL database stores all historical data
- Redis cache for frequently accessed data
- Background sync job runs every 6 hours
- API responses served from cache/database, not real-time API calls

**Benefits**:
- 99.9% uptime even if government API is down
- Sub-100ms response times
- No API rate limit issues
- Historical data always available

### 2. Progressive Enhancement

**Problem**: Low-literacy users in rural areas

**Solution**:
- Visual-first design with icons and colors
- Minimal text, large buttons
- Hindi as default language
- Simple navigation (only 2-3 clicks to any data)
- Progressive disclosure of complex information

**Implementation**:
```typescript
// Visual indicators instead of numbers
- Green checkmark for completed works
- Clock icon for ongoing works
- Up/down arrows for comparisons
- Color-coded performance metrics
```

### 3. Geolocation-Based Auto-Detection

**Problem**: Users may not know district codes or navigate complex menus

**Solution**:
- Browser geolocation API to detect user's location
- Reverse geocoding to find nearest district
- One-click access to relevant data

**Implementation**:
```javascript
navigator.geolocation.getCurrentPosition(
  position => findNearestDistrict(position.coords)
)
```

### 4. Bilingual Support

**Problem**: Rural users may not be fluent in English

**Solution**:
- Context-based translation system
- Hindi as default language
- Easy language toggle
- Devanagari font support

### 5. Caching Strategy

Three-tier caching for optimal performance:

```
1. Redis (in-memory) - 6 hours TTL
   ↓ (cache miss)
2. PostgreSQL (disk) - permanent storage
   ↓ (data missing)
3. data.gov.in API - fetch and cache
```

### 6. Data Synchronization

**Scheduled Job**:
```javascript
// Runs every 6 hours
cron.schedule('0 */6 * * *', async () => {
  - Fetch latest data from API
  - Update database
  - Invalidate relevant caches
  - Log sync status
});
```

### 7. Error Handling & Resilience

- Graceful degradation when services fail
- Retry logic for API calls
- Circuit breaker pattern for external APIs
- Comprehensive error logging
- Health check endpoints

### 8. Security Measures

- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet.js for security headers
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection

### 9. Scalability

**Horizontal Scaling**:
- Stateless backend (scales with load balancer)
- Redis for shared session state
- PostgreSQL connection pooling

**Vertical Scaling**:
- Configurable worker processes
- Database query optimization
- Index on frequently accessed columns

### 10. Monitoring & Observability

- Winston logger with log rotation
- Request/response logging
- Error tracking
- Performance metrics
- Database query logging

## Data Flow

### User Requests District Data

```
User → Frontend → Backend API → Redis Cache
                              ↓ (cache miss)
                        PostgreSQL DB
                              ↓ (no data)
                        data.gov.in API
                              ↓
                        Store in DB + Cache
                              ↓
                        Return to user
```

### Background Data Sync

```
Cron Job (every 6 hours)
    ↓
Fetch all districts from DB
    ↓
For each district:
    ↓
Call data.gov.in API
    ↓
Upsert into PostgreSQL
    ↓
Invalidate Redis cache
    ↓
Log sync status
```

## Database Schema

```sql
states (id, code, name)
    ↓
districts (id, code, name, state_code, lat, lng)
    ↓
performance (
    id, district_code, year, month,
    person_days_generated, employment_provided,
    active_job_cards, average_wage,
    total_expenditure, works_completed,
    works_ongoing
)

sync_log (id, sync_type, status, records, timestamp)
```

## API Endpoints

```
GET  /api/health                         - Health check
GET  /api/districts/:stateCode           - List districts
GET  /api/districts/locate/coordinates   - Find by GPS
GET  /api/performance/current/:code      - Current month
GET  /api/performance/history/:code      - 12 months
GET  /api/performance/compare/:code      - State comparison
```

## Performance Targets

- Page load: < 2 seconds
- API response: < 200ms (cached), < 1s (uncached)
- Time to Interactive: < 3 seconds
- Lighthouse score: > 90
- Uptime: 99.9%

## Deployment Architecture

```
VPS Server (Ubuntu 20.04)
    ↓
Docker Engine
    ↓
Docker Compose
    ↓
├─ Nginx (Port 80)
├─ Frontend (React + Nginx)
├─ Backend (Node.js)
├─ PostgreSQL
└─ Redis
```

## Future Enhancements

1. **PWA Support**: Offline functionality, push notifications
2. **SMS Alerts**: Performance updates via SMS
3. **Voice Interface**: For illiterate users
4. **Multi-state Support**: Expand beyond Uttar Pradesh
5. **Analytics Dashboard**: For administrators
6. **Machine Learning**: Predict employment trends
7. **Mobile App**: Native iOS/Android apps
8. **WhatsApp Bot**: Query data via WhatsApp

## Cost Analysis

### Infrastructure Costs (Monthly)
- VPS (2GB RAM): $6-18
- Domain: $1-2
- SSL Certificate: Free (Let's Encrypt)
- **Total: ~$10-20/month**

### Comparison with Alternatives
- Vercel/Netlify: Limited backend, $20-50/month
- AWS/Azure: $30-100/month for similar setup
- Heroku: $25-50/month

### Cost per User
Assuming 100,000 monthly active users:
- **$0.0001-0.0002 per user**

## Accessibility Features

- WCAG 2.1 AA compliant
- High contrast mode support
- Large clickable areas (min 44x44px)
- Screen reader compatible
- Keyboard navigation support
- Reduced motion support

## Localization

- Hindi: Primary language for rural users
- English: Secondary language
- Font: Noto Sans Devanagari for Hindi
- RTL support: Not needed (Hindi is LTR)

## Conclusion

This architecture prioritizes:
1. **Reliability**: Offline-first, cached data
2. **Performance**: Sub-second response times
3. **Accessibility**: Low-literacy friendly
4. **Scalability**: Handles millions of users
5. **Cost-effectiveness**: $10-20/month hosting
6. **Maintainability**: Simple, documented codebase
