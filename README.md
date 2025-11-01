# MGNREGA District Performance Dashboard

## Our Voice, Our Rights

A production-ready web application that makes MGNREGA district performance data accessible to rural Indian citizens with low literacy levels.

## Features

- 📊 Simple, visual representation of district performance
- 🗺️ Automatic district detection using geolocation
- 📈 Historical data and trends
- 🔄 Offline-first architecture with data caching
- 🌐 Multi-language support (Hindi, English)
- 📱 Mobile-responsive design
- ⚡ High performance and scalability

## Technical Architecture

### Stack
- **Frontend**: React with TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **Deployment**: Docker + Nginx

### Key Design Decisions

1. **Data Caching**: Local database stores all API responses to handle rate limits and API downtime
2. **Background Sync**: Scheduled job syncs data from data.gov.in API every 6 hours
3. **Geolocation**: Uses browser geolocation + reverse geocoding to detect user's district
4. **Progressive Web App**: Works offline with cached data
5. **CDN**: Static assets served via CDN for faster loading

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

### Local Development

1. Clone the repository
2. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Set up environment variables:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Start PostgreSQL and Redis
5. Run database migrations:
```bash
cd backend && npm run migrate
```

6. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Production Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## State Coverage

For this implementation, we're focusing on **Uttar Pradesh** - India's most populous state with significant MGNREGA participation.

## Project Structure

```
Fellowship/
├── frontend/           # React frontend application
├── backend/            # Node.js Express API server
├── database/           # Database schemas and migrations
├── scripts/            # Deployment and utility scripts
├── docker/             # Docker configuration
└── docs/               # Additional documentation
```

## API Integration

Data source: https://www.data.gov.in/catalog/mahatma-gandhi-national-rural-employment-guarantee-act-mgnrega

## License

MIT
