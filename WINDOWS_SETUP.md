# Windows Setup Guide

## MGNREGA Dashboard - Local Development on Windows

This guide helps you set up and run the project on Windows.

## Prerequisites

### 1. Install Node.js

Download and install Node.js 18+ from: https://nodejs.org/

```powershell
# Verify installation
node --version
npm --version
```

### 2. Install Docker Desktop for Windows

Download from: https://www.docker.com/products/docker-desktop/

After installation:
1. Enable WSL 2 backend (recommended)
2. Start Docker Desktop
3. Verify in PowerShell:

```powershell
docker --version
docker-compose --version
```

### 3. Install Git (if not already installed)

Download from: https://git-scm.com/download/win

## Local Development Setup (Without Docker)

If you want to run the project locally without Docker:

### Step 1: Install PostgreSQL

Download from: https://www.postgresql.org/download/windows/

Default settings:
- Port: 5432
- User: postgres
- Create database: `mgnrega_db`

### Step 2: Install Redis

Option 1 - Using WSL:
```powershell
wsl --install
wsl
sudo apt update
sudo apt install redis-server
redis-server
```

Option 2 - Using Docker just for Redis:
```powershell
docker run -d -p 6379:6379 redis:7-alpine
```

### Step 3: Setup Backend

```powershell
# Navigate to backend
cd "c:\Users\Nitin Pandey\Downloads\Fellowship\backend"

# Install dependencies
npm install

# Create .env file
New-Item -Path ".env" -ItemType File

# Edit .env with:
# PORT=5000
# NODE_ENV=development
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=mgnrega_db
# DB_USER=postgres
# DB_PASSWORD=your_password
# REDIS_HOST=localhost
# REDIS_PORT=6379

# Run database migrations
# (First, manually create tables using database/schema.sql in pgAdmin)

# Start backend
npm run dev
```

### Step 4: Setup Frontend

```powershell
# Open NEW PowerShell window
cd "c:\Users\Nitin Pandey\Downloads\Fellowship\frontend"

# Install dependencies
npm install

# Start frontend
npm run dev
```

### Step 5: Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Docker Setup (Recommended)

### Step 1: Start Docker Desktop

Make sure Docker Desktop is running.

### Step 2: Create Environment File

```powershell
cd "c:\Users\Nitin Pandey\Downloads\Fellowship"

# Create .env file
@"
DB_PASSWORD=postgres123
DATA_GOV_API_KEY=your_api_key_here
"@ | Out-File -FilePath ".env" -Encoding utf8
```

### Step 3: Build and Run

```powershell
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 4: Initialize Data

```powershell
# Wait for services to be ready (30 seconds)
Start-Sleep -Seconds 30

# Generate mock data
docker-compose exec backend node dist/jobs/dataSync.js
```

### Step 5: Access Application

- Frontend: http://localhost
- Backend API: http://localhost/api
- Health Check: http://localhost/api/health

## Common Windows Issues

### Issue 1: Port Already in Use

```powershell
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue 2: Docker not starting

1. Open Docker Desktop
2. Go to Settings → Resources → WSL Integration
3. Enable integration with your WSL distro
4. Restart Docker Desktop

### Issue 3: Line Ending Issues (CRLF vs LF)

```powershell
# Configure Git to handle line endings
git config --global core.autocrlf true
```

### Issue 4: Permission Denied on Scripts

```powershell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Development Workflow

### Backend Changes

```powershell
cd backend

# Auto-reload is enabled with ts-node-dev
# Just save your files and server will restart
npm run dev
```

### Frontend Changes

```powershell
cd frontend

# Vite hot reload is enabled
# Changes appear instantly in browser
npm run dev
```

### Database Changes

```powershell
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres mgnrega_db

# Run query
SELECT * FROM districts LIMIT 5;

# Exit
\q
```

### Redis Cache

```powershell
# Connect to Redis
docker-compose exec redis redis-cli

# View all keys
KEYS *

# Get a value
GET districts:UP

# Clear all cache
FLUSHALL

# Exit
exit
```

## Building for Production

### Backend

```powershell
cd backend
npm run build
npm start
```

### Frontend

```powershell
cd frontend
npm run build

# Built files in frontend/dist/
# Deploy to any static hosting
```

## Useful Commands

### Docker Commands

```powershell
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Rebuild specific service
docker-compose build backend

# View logs for specific service
docker-compose logs backend

# Execute command in container
docker-compose exec backend npm run migrate

# Access container shell
docker-compose exec backend sh
```

### Package Management

```powershell
# Update all dependencies
cd backend
npm update

cd ../frontend
npm update
```

## IDE Setup (VS Code)

### Recommended Extensions

1. **ESLint** - Linting JavaScript/TypeScript
2. **Prettier** - Code formatting
3. **Docker** - Docker management
4. **PostgreSQL** - Database management
5. **Thunder Client** - API testing
6. **Tailwind CSS IntelliSense** - Tailwind autocomplete

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Testing

### Run Backend Tests

```powershell
cd backend
npm test
```

### Run Frontend Tests

```powershell
cd frontend
npm test
```

### API Testing

Use Thunder Client extension or:

```powershell
# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:5000/api/health" | Select-Object -Expand Content

# Test districts endpoint
Invoke-WebRequest -Uri "http://localhost:5000/api/districts/UP" | Select-Object -Expand Content
```

## Troubleshooting

### Reset Everything

```powershell
# Stop all containers
docker-compose down -v

# Remove all images
docker-compose rm -f

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

### Check Service Health

```powershell
# Backend health
curl http://localhost:5000/api/health

# Database connection
docker-compose exec postgres pg_isready

# Redis connection
docker-compose exec redis redis-cli ping
```

### View Detailed Logs

```powershell
# All services
docker-compose logs

# Specific service with timestamps
docker-compose logs -f --timestamps backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

## Performance Tips

1. **Use WSL 2** instead of Hyper-V for better Docker performance
2. **Increase Docker memory** in Docker Desktop settings (minimum 4GB)
3. **Use SSD** for Docker data directory
4. **Close unnecessary applications** to free up resources

## Next Steps

1. ✅ Install all prerequisites
2. ✅ Choose setup method (Docker recommended)
3. ✅ Run the application
4. ✅ Generate mock data
5. ✅ Test all features
6. ✅ Start development!

## Getting Help

If you encounter issues:

1. Check Docker Desktop is running
2. Verify all ports are available (5000, 3000, 5432, 6379, 80)
3. Check logs: `docker-compose logs`
4. Restart services: `docker-compose restart`
5. Full reset: `docker-compose down -v && docker-compose up -d`

## Additional Resources

- Node.js docs: https://nodejs.org/docs/
- Docker docs: https://docs.docker.com/
- React docs: https://react.dev/
- PostgreSQL docs: https://www.postgresql.org/docs/
- Redis docs: https://redis.io/docs/

---

Happy coding! 🚀
