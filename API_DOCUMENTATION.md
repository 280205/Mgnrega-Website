# API Documentation

## MGNREGA Dashboard API v1.0

Base URL: `http://your-domain.com/api`

All endpoints return JSON responses.

## Authentication

Currently, no authentication is required for read operations. All endpoints are public.

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** 
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "source": "cache" | "database"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Endpoints

### 1. Health Check

Check if the API is running and healthy.

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2025-11-01T10:30:00.000Z",
  "database": "connected",
  "cache": "connected"
}
```

**Status Codes:**
- `200` - Service healthy
- `503` - Service unavailable

**Example:**

```bash
curl http://localhost/api/health
```

---

### 2. Get Districts by State

Retrieve all districts for a given state.

**Endpoint:** `GET /api/districts/:stateCode`

**Parameters:**
- `stateCode` (path) - State code (e.g., "UP" for Uttar Pradesh)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "UP001",
      "name": "Agra",
      "state_code": "UP",
      "latitude": 27.1767,
      "longitude": 78.0081,
      "created_at": "2025-11-01T00:00:00.000Z",
      "updated_at": "2025-11-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "code": "UP002",
      "name": "Lucknow",
      "state_code": "UP",
      "latitude": 26.8467,
      "longitude": 80.9462,
      "created_at": "2025-11-01T00:00:00.000Z",
      "updated_at": "2025-11-01T00:00:00.000Z"
    }
  ],
  "source": "cache"
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Cache:** 24 hours

**Example:**

```bash
curl http://localhost/api/districts/UP
```

---

### 3. Locate District by Coordinates

Find the nearest district based on GPS coordinates.

**Endpoint:** `GET /api/districts/locate/coordinates`

**Query Parameters:**
- `lat` (required) - Latitude (decimal)
- `lng` (required) - Longitude (decimal)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "code": "UP002",
    "name": "Lucknow",
    "state_code": "UP",
    "latitude": 26.8467,
    "longitude": 80.9462,
    "distance": 5.23
  }
}
```

**Status Codes:**
- `200` - District found
- `400` - Missing parameters
- `404` - No district found
- `500` - Server error

**Example:**

```bash
curl "http://localhost/api/districts/locate/coordinates?lat=26.8467&lng=80.9462"
```

---

### 4. Get Current Performance

Get the most recent performance data for a district.

**Endpoint:** `GET /api/performance/current/:districtCode`

**Parameters:**
- `districtCode` (path) - District code (e.g., "UP001")

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "district_code": "UP001",
    "district_name": "Agra",
    "state_code": "UP",
    "year": 2025,
    "month": 10,
    "person_days_generated": 450000,
    "employment_provided": 8500,
    "active_job_cards": 45000,
    "total_households": 75000,
    "women_persondays": 225000,
    "sc_persondays": 135000,
    "st_persondays": 90000,
    "average_wage": 225.50,
    "total_expenditure": 101250000.00,
    "material_expenditure": 30375000.00,
    "wage_expenditure": 70875000.00,
    "works_completed": 450,
    "works_ongoing": 120,
    "created_at": "2025-11-01T00:00:00.000Z",
    "updated_at": "2025-11-01T06:00:00.000Z"
  },
  "source": "cache"
}
```

**Status Codes:**
- `200` - Success
- `404` - District not found or no data
- `500` - Server error

**Cache:** 6 hours

**Example:**

```bash
curl http://localhost/api/performance/current/UP001
```

---

### 5. Get Historical Performance

Get historical performance data for a district.

**Endpoint:** `GET /api/performance/history/:districtCode`

**Parameters:**
- `districtCode` (path) - District code (e.g., "UP001")

**Query Parameters:**
- `months` (optional) - Number of months of history (default: 12, max: 24)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "district_code": "UP001",
      "district_name": "Agra",
      "state_code": "UP",
      "year": 2025,
      "month": 10,
      "person_days_generated": 450000,
      "employment_provided": 8500,
      "active_job_cards": 45000,
      "average_wage": 225.50,
      "total_expenditure": 101250000.00,
      "works_completed": 450,
      "works_ongoing": 120,
      "created_at": "2025-11-01T00:00:00.000Z",
      "updated_at": "2025-11-01T06:00:00.000Z"
    },
    {
      "id": 122,
      "district_code": "UP001",
      "district_name": "Agra",
      "state_code": "UP",
      "year": 2025,
      "month": 9,
      "person_days_generated": 430000,
      "employment_provided": 8200,
      "active_job_cards": 44500,
      "average_wage": 220.00,
      "total_expenditure": 94600000.00,
      "works_completed": 420,
      "works_ongoing": 110,
      "created_at": "2025-10-01T00:00:00.000Z",
      "updated_at": "2025-10-01T06:00:00.000Z"
    }
  ],
  "source": "database"
}
```

**Status Codes:**
- `200` - Success
- `404` - District not found
- `500` - Server error

**Cache:** 12 hours

**Example:**

```bash
curl "http://localhost/api/performance/history/UP001?months=6"
```

---

### 6. Get Comparative Performance

Compare district performance with state average.

**Endpoint:** `GET /api/performance/compare/:districtCode`

**Parameters:**
- `districtCode` (path) - District code (e.g., "UP001")

**Response:**

```json
{
  "success": true,
  "data": {
    "district": {
      "id": 123,
      "district_code": "UP001",
      "district_name": "Agra",
      "state_code": "UP",
      "year": 2025,
      "month": 10,
      "person_days_generated": 450000,
      "employment_provided": 8500,
      "active_job_cards": 45000,
      "average_wage": 225.50,
      "total_expenditure": 101250000.00
    },
    "stateAverage": {
      "avg_person_days": "400000",
      "avg_employment": "7500",
      "avg_job_cards": "42000",
      "avg_wage": "215.00"
    }
  },
  "source": "cache"
}
```

**Status Codes:**
- `200` - Success
- `404` - District not found
- `500` - Server error

**Cache:** 12 hours

**Example:**

```bash
curl http://localhost/api/performance/compare/UP001
```

---

## Data Models

### District

```typescript
interface District {
  id: number;
  code: string;           // Unique district code
  name: string;           // District name
  state_code: string;     // State code
  latitude: number;       // GPS latitude
  longitude: number;      // GPS longitude
  created_at: Date;
  updated_at: Date;
}
```

### Performance

```typescript
interface Performance {
  id: number;
  district_code: string;
  year: number;
  month: number;          // 1-12
  person_days_generated: number;
  employment_provided: number;
  active_job_cards: number;
  total_households: number;
  women_persondays: number;
  sc_persondays: number;  // Scheduled Caste
  st_persondays: number;  // Scheduled Tribe
  average_wage: number;   // In Rupees
  total_expenditure: number;
  material_expenditure: number;
  wage_expenditure: number;
  works_completed: number;
  works_ongoing: number;
  created_at: Date;
  updated_at: Date;
}
```

---

## Error Codes

### 400 Bad Request

Request is malformed or missing required parameters.

```json
{
  "success": false,
  "message": "Latitude and longitude are required"
}
```

### 404 Not Found

Requested resource doesn't exist.

```json
{
  "success": false,
  "message": "No performance data found for this district"
}
```

### 429 Too Many Requests

Rate limit exceeded.

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error

Server error occurred.

```json
{
  "success": false,
  "message": "Failed to fetch performance data"
}
```

### 503 Service Unavailable

Service is temporarily unavailable (usually during maintenance).

```json
{
  "success": false,
  "message": "Service unhealthy",
  "error": "Database connection failed"
}
```

---

## Caching Strategy

### Cache Levels

1. **Redis (In-Memory)** - 6-24 hours TTL
2. **PostgreSQL (Database)** - Permanent storage
3. **data.gov.in API** - Fallback source

### Cache Keys

- Districts: `districts:{stateCode}` (24h)
- Current Performance: `performance:current:{districtCode}` (6h)
- Historical Performance: `performance:history:{districtCode}:{months}` (12h)
- Comparison: `performance:compare:{districtCode}` (12h)

### Cache Invalidation

Cache is automatically invalidated:
- When new data is synced (every 6 hours)
- When TTL expires
- Manual flush: `docker-compose exec redis redis-cli FLUSHALL`

---

## Data Sync

### Background Job

Data is automatically synced from data.gov.in API:

- **Frequency:** Every 6 hours (configurable)
- **Time:** 00:00, 06:00, 12:00, 18:00 UTC
- **Process:**
  1. Fetch latest data from API
  2. Update PostgreSQL database
  3. Invalidate Redis cache
  4. Log sync status

### Manual Sync

```bash
docker-compose exec backend node dist/jobs/dataSync.js
```

### Sync Status

Check sync logs:

```sql
SELECT * FROM sync_log ORDER BY created_at DESC LIMIT 10;
```

---

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost/api/health

# Get districts
curl http://localhost/api/districts/UP

# Locate district
curl "http://localhost/api/districts/locate/coordinates?lat=26.8467&lng=80.9462"

# Current performance
curl http://localhost/api/performance/current/UP001

# Historical data
curl "http://localhost/api/performance/history/UP001?months=12"

# Comparison
curl http://localhost/api/performance/compare/UP001
```

### Using JavaScript

```javascript
// Fetch districts
const response = await fetch('http://localhost/api/districts/UP');
const data = await response.json();
console.log(data);

// With error handling
try {
  const response = await fetch('http://localhost/api/performance/current/UP001');
  if (!response.ok) throw new Error('API request failed');
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error('Error:', error);
}
```

### Using Python

```python
import requests

# Get districts
response = requests.get('http://localhost/api/districts/UP')
data = response.json()
print(data)

# Current performance
response = requests.get('http://localhost/api/performance/current/UP001')
if response.status_code == 200:
    data = response.json()
    print(data['data']['person_days_generated'])
```

---

## Best Practices

### 1. Handle Errors Gracefully

Always check `success` field and handle errors:

```javascript
const response = await fetch('/api/districts/UP');
const result = await response.json();

if (result.success) {
  // Use result.data
  console.log(result.data);
} else {
  // Handle error
  console.error(result.message);
}
```

### 2. Respect Rate Limits

Implement exponential backoff:

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url);
    if (response.status !== 429) return response;
    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
  }
  throw new Error('Max retries exceeded');
}
```

### 3. Cache on Client Side

Cache responses to reduce API calls:

```javascript
const cache = new Map();

async function fetchDistricts(stateCode) {
  const cacheKey = `districts:${stateCode}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const response = await fetch(`/api/districts/${stateCode}`);
  const data = await response.json();
  
  cache.set(cacheKey, data);
  return data;
}
```

### 4. Use Appropriate Timeouts

```javascript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, { signal: controller.signal });
  // Process response
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('Request timeout');
  }
} finally {
  clearTimeout(timeout);
}
```

---

## Changelog

### Version 1.0.0 (November 2025)

- Initial API release
- Districts endpoint
- Performance endpoints
- Geolocation support
- Caching implementation
- Rate limiting

---

## Support

For API issues or questions:
- Check logs: `docker-compose logs backend`
- Review documentation
- Test with cURL first
- Check rate limits
- Verify data exists in database

---

**API Version:** 1.0.0  
**Last Updated:** November 2025  
**Status:** Production Ready
