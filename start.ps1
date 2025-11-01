# Quick Start Script for Windows
# Run this in PowerShell

Write-Host "=====================================" -ForegroundColor Green
Write-Host "MGNREGA Dashboard - Quick Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "[OK] Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
DB_PASSWORD=postgres123
DATA_GOV_API_KEY=your_api_key_here
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "[OK] .env file created" -ForegroundColor Green
    Write-Host "[INFO] Please update DATA_GOV_API_KEY in .env file" -ForegroundColor Yellow
} else {
    Write-Host "[OK] .env file already exists" -ForegroundColor Green
}

# Build Docker images
Write-Host ""
Write-Host "Building Docker images (this may take a few minutes)..." -ForegroundColor Yellow
docker-compose build
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Docker images built successfully" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to build Docker images" -ForegroundColor Red
    exit 1
}

# Start services
Write-Host ""
Write-Host "Starting services..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Services started successfully" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to start services" -ForegroundColor Red
    exit 1
}

# Wait for services to be ready
Write-Host ""
Write-Host "Waiting for services to initialize (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check service health
Write-Host "Checking service health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/api/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] Backend is healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "[WARNING] Backend health check failed, but services may still be starting" -ForegroundColor Yellow
}

# Generate mock data
Write-Host ""
Write-Host "Generating mock data..." -ForegroundColor Yellow
docker-compose exec -T backend node dist/jobs/dataSync.js
Write-Host "[OK] Mock data generated" -ForegroundColor Green

# Get local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.InterfaceAlias -notlike "*VirtualBox*"} | Select-Object -First 1).IPAddress

# Display success message
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application at:" -ForegroundColor Cyan
Write-Host "  Frontend:     http://localhost" -ForegroundColor White
Write-Host "  API:          http://localhost/api" -ForegroundColor White
Write-Host "  Health Check: http://localhost/api/health" -ForegroundColor White
if ($localIP) {
    Write-Host ""
    Write-Host "Or from other devices on your network:" -ForegroundColor Cyan
    Write-Host "  http://$localIP" -ForegroundColor White
}
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:       docker-compose logs -f" -ForegroundColor White
Write-Host "  Stop services:   docker-compose down" -ForegroundColor White
Write-Host "  Restart:         docker-compose restart" -ForegroundColor White
Write-Host "  Status:          docker-compose ps" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to open the application in your browser..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser
Start-Process "http://localhost"

Write-Host ""
Write-Host "Enjoy! 🎉" -ForegroundColor Green
