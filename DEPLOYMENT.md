# Deployment Guide

## Prerequisites

- Ubuntu 20.04+ VPS with at least 2GB RAM
- Docker and Docker Compose installed
- Domain name (optional, can use IP)
- SSH access to server

## Quick Deployment Steps

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone Repository

```bash
git clone <your-repo-url>
cd Fellowship
```

### 3. Configuration

Create a `.env` file in the root directory:

```bash
DB_PASSWORD=your_secure_password_here
DATA_GOV_API_KEY=your_api_key_here
```

### 4. Build and Deploy

```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 5. Initialize Database

```bash
# The database will be automatically initialized with the schema
# To manually run migrations:
docker-compose exec backend node dist/migrations/run.js
```

### 6. Generate Initial Data

```bash
# Generate mock data for testing
docker-compose exec backend node -e "
const { dataSyncService } = require('./dist/jobs/dataSync.js');
dataSyncService.generateMockData();
"
```

### 7. Access Application

- Frontend: http://your-server-ip
- Backend API: http://your-server-ip/api
- Health Check: http://your-server-ip/api/health

## SSL Configuration (Optional but Recommended)

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is set up by default
```

## Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres mgnrega_db > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T postgres psql -U postgres mgnrega_db < backup_20250101.sql
```

## Production Optimizations

### 1. Increase Docker Resources

Edit `/etc/docker/daemon.json`:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

### 2. Set Up Cron Job for Data Sync

```bash
# Edit crontab
crontab -e

# Add line to sync data every 6 hours
0 */6 * * * docker-compose -f /path/to/Fellowship/docker-compose.yml exec -T backend node dist/jobs/dataSync.js
```

### 3. Configure Firewall

```bash
# Allow SSH
sudo ufw allow 22

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

### 4. Set Up Monitoring

```bash
# Install monitoring tools
sudo apt install htop nethogs -y

# Monitor Docker stats
docker stats
```

## Troubleshooting

### Services Not Starting

```bash
# Check Docker service
sudo systemctl status docker

# Check container logs
docker-compose logs backend
docker-compose logs frontend
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Access database shell
docker-compose exec postgres psql -U postgres mgnrega_db
```

### API Not Responding

```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Check health endpoint
curl http://localhost/api/health
```

## Performance Tuning

### PostgreSQL Optimization

Edit `docker-compose.yml` to add PostgreSQL tuning:

```yaml
postgres:
  command:
    - "postgres"
    - "-c"
    - "shared_buffers=256MB"
    - "-c"
    - "effective_cache_size=1GB"
    - "-c"
    - "maintenance_work_mem=64MB"
    - "-c"
    - "max_connections=100"
```

### Redis Configuration

```yaml
redis:
  command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

## Scaling

### Horizontal Scaling

To handle more traffic, deploy multiple backend instances:

```yaml
backend:
  deploy:
    replicas: 3
```

### Load Balancing

Configure nginx to load balance across multiple backend instances.

## Security Checklist

- [ ] Change default database password
- [ ] Enable SSL/TLS
- [ ] Configure firewall
- [ ] Set up fail2ban
- [ ] Regular security updates
- [ ] Enable rate limiting
- [ ] Set up backup strategy
- [ ] Monitor logs regularly

## Cost Estimation

For a VPS hosting solution:

- DigitalOcean Droplet (2GB RAM, 2 vCPU): $18/month
- AWS EC2 t3.small: ~$15/month
- Linode 2GB: $12/month
- Hetzner Cloud CX21: €5.83/month (~$6)

## Support

For issues or questions, check:
- Application logs: `docker-compose logs`
- Database status: `docker-compose ps`
- System resources: `htop`
- Disk space: `df -h`
