#!/bin/bash

# MGNREGA Dashboard Deployment Script
# This script automates the deployment process

set -e

echo "======================================"
echo "MGNREGA Dashboard Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run this script as root"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_warning "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    print_status "Docker installed successfully"
else
    print_status "Docker is already installed"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose not found. Installing..."
    sudo apt install docker-compose -y
    print_status "Docker Compose installed successfully"
else
    print_status "Docker Compose is already installed"
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_warning "Creating .env file..."
    cat > .env << EOF
DB_PASSWORD=$(openssl rand -base64 32)
DATA_GOV_API_KEY=your_api_key_here
EOF
    print_status ".env file created"
    print_warning "Please update DATA_GOV_API_KEY in .env file"
else
    print_status ".env file already exists"
fi

# Create necessary directories
mkdir -p nginx/ssl
mkdir -p backend/logs

print_status "Building Docker images..."
docker-compose build

print_status "Starting services..."
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "Services are running!"
    
    # Get server IP
    SERVER_IP=$(hostname -I | awk '{print $1}')
    
    echo ""
    echo "======================================"
    echo "Deployment Complete!"
    echo "======================================"
    echo ""
    echo "Access your application at:"
    echo "  Frontend: http://$SERVER_IP"
    echo "  API: http://$SERVER_IP/api"
    echo "  Health Check: http://$SERVER_IP/api/health"
    echo ""
    echo "To generate mock data, run:"
    echo "  docker-compose exec backend node dist/jobs/dataSync.js"
    echo ""
    echo "To view logs:"
    echo "  docker-compose logs -f"
    echo ""
else
    print_error "Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
