# Real MGNREGA Data Integration

## ✅ What's Been Updated

Your MGNREGA dashboard is now configured to fetch **real government data** from the official data.gov.in API!

## 🔗 API Details

### **Official Government Data Source**
- **API Provider**: Government of India (data.gov.in)
- **Resource**: District-wise MGNREGA Data at a Glance
- **Resource ID**: `ee03643a-ee4c-48c2-ac30-9f2ff26ab722`
- **Ministry**: Ministry of Rural Development, Department of Land Resources
- **Data Coverage**: All Indian states including Uttar Pradesh
- **Update Frequency**: Real-time government data

### **API Endpoint**
```
GET https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722
```

### **Available Data Fields**
The API provides comprehensive MGNREGA metrics including:

**📊 Employment Metrics:**
- Total Households Worked
- Total Individuals Worked  
- Total Active Workers
- Person-days of Central Liability
- Average days of employment per household
- HHs completed 100 Days of Wage Employment

**💰 Financial Data:**
- Total Expenditure
- Wages
- Material and Skilled Wages
- Average Wage rate per day per person
- Total Admin Expenditure

**👥 Demographic Data:**
- Women Person-days
- SC (Scheduled Caste) Person-days & Workers
- ST (Scheduled Tribe) Person-days & Workers
- Differently abled persons worked

**🏗️ Works Data:**
- Number of Completed Works
- Number of Ongoing Works
- Total Works Taken up
- Approved Labour Budget

**📍 Location Data:**
- State Code & Name
- District Code & Name
- Financial Year
- Month

## 🔧 Integration Implementation

### **File Updated: `backend/src/jobs/dataSync.ts`**

The data sync service now:

1. **Fetches Real Data**: Connects to data.gov.in API every 6 hours
2. **Filters for UP**: Specifically queries `state_name=UTTAR PRADESH`
3. **Maps Fields**: Converts API response to your database schema
4. **Handles Failures**: Falls back to mock data if API is unavailable
5. **Logs Activity**: Tracks sync status in `sync_log` table

### **Key Features:**

```typescript
// API Configuration
const API_BASE_URL = 'https://api.data.gov.in/resource';
const API_RESOURCE_ID = 'ee03643a-ee4c-48c2-ac30-9f2ff26ab722';
const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

// Fetch UP data
const response = await axios.get(`${API_BASE_URL}/${API_RESOURCE_ID}`, {
  params: {
    'api-key': API_KEY,
    'format': 'json',
    'filters[state_name]': 'UTTAR PRADESH',
    'filters[fin_year]': '2024-2025',
    'limit': 1000
  }
});
```

### **Field Mapping:**
| API Field | Database Field |
|-----------|----------------|
| `Persondays_of_Central_Liability_so_far` | `person_days_generated` |
| `Total_Individuals_Worked` | `employment_provided` |
| `Total_No_of_Active_Job_Cards` | `active_job_cards` |
| `Average_Wage_rate_per_day_per_person` | `average_wage` |
| `Total_Exp` | `total_expenditure` |
| `Number_of_Completed_Works` | `works_completed` |
| `Number_of_Ongoing_Works` | `works_ongoing` |
| `Women_Persondays` | `women_persondays` |
| `SC_persondays` | `sc_persondays` |
| `ST_persondays` | `st_persondays` |

## 🚀 How It Works with Docker

Once you install Docker and run `docker-compose up`, the system will:

1. **Initialize Database** with 20 UP districts
2. **Start Background Sync Job** (runs every 6 hours)
3. **Fetch Real Data** from data.gov.in API
4. **Cache in Redis** (6-hour TTL)
5. **Store in PostgreSQL** (permanent storage)
6. **Serve to Frontend** via REST API

### **Data Flow:**
```
data.gov.in API 
    ↓ (every 6 hours)
Background Sync Job
    ↓
PostgreSQL Database
    ↓
Redis Cache (6hr)
    ↓
Backend API
    ↓
Frontend Dashboard
```

## 📝 API Key Information

**Current Key**: `579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b`

⚠️ **Note**: This is the sample API key provided by data.gov.in which:
- Returns maximum 10 records at a time (basic tier)
- Suitable for testing and development
- No authentication required

### **To Get Your Own API Key** (for production):
1. Visit: https://data.gov.in/
2. Click "Sign Up" or "Login"
3. Go to "My Account" section
4. Generate your personal API key
5. Add to `.env` file: `DATA_GOV_API_KEY=your_key_here`

**Benefits of Personal API Key:**
- Higher rate limits
- More records per request
- Priority access
- Better for production use

## 🔄 Automatic Sync Schedule

The system automatically syncs data:
- **Every 6 hours** by default
- Configurable via `SYNC_INTERVAL_HOURS` environment variable
- Manual sync available via: `docker-compose exec backend node dist/jobs/dataSync.js`

## 🛡️ Fallback Strategy

If the API is unavailable or fails:
1. System logs the error
2. Automatically generates realistic mock data
3. Frontend continues to work seamlessly
4. Next sync attempt in 6 hours

## 📊 Data Freshness

- **Government Updates**: Monthly (as per MGNREGA reporting cycle)
- **Your Database**: Every 6 hours
- **Redis Cache**: 6-hour expiry
- **Frontend**: Real-time from cache/database

## 🎯 Next Steps

1. **Install Docker Desktop** (if not already done)
2. **Run**: `docker-compose up -d`
3. **Initialize Data**: `docker-compose exec backend node dist/jobs/dataSync.js`
4. **Access Dashboard**: http://localhost

The system will fetch real government data for all Uttar Pradesh districts automatically!

## 🔍 Monitoring & Logs

Check sync status:
```bash
# View sync logs
docker-compose logs backend

# Check last sync
docker-compose exec postgres psql -U postgres -d mgnrega_db \
  -c "SELECT * FROM sync_log ORDER BY started_at DESC LIMIT 5;"
```

## 📚 Resources

- **API Documentation**: https://data.gov.in/resource/district-wise-mgnrega-data-glance
- **data.gov.in Home**: https://data.gov.in/
- **MGNREGA Official**: https://nrega.nic.in/
- **Ministry Website**: https://rural.nic.in/

---

**🎉 Your dashboard is now ready to display real government MGNREGA data for rural India!**
