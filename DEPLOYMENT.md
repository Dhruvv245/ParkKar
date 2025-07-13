# ParkKar - Deployment Guide

This document provides instructions for containerizing and deploying the ParkKar parking management application.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- MongoDB (for local development)

## Container Structure

The application has been containerized with the following components:

### Files Created:

- `Dockerfile` - Main application container
- `docker-compose.yml` - Development environment
- `docker-compose.prod.yml` - Production environment with nginx
- `.dockerignore` - Files to exclude from Docker build
- `.env.docker` - Environment variables for Docker
- `nginx.conf` - Nginx reverse proxy configuration
- `k8s-deployment.yml` - Kubernetes deployment configuration

## Quick Start (Development)

1. **Build and run with Docker Compose:**

   ```bash
   docker-compose up --build
   ```

2. **Access the application:**

   - Frontend: http://localhost:3000
   - Health Check: http://localhost:3000/health

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

## Production Deployment

### Using Docker Compose

1. **Build the production image:**

   ```bash
   docker build -t parkkar-app:latest .
   ```

2. **Run production environment:**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **View logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f app
   ```

### Using Kubernetes

1. **Apply the deployment:**

   ```bash
   kubectl apply -f k8s-deployment.yml
   ```

2. **Check deployment status:**
   ```bash
   kubectl get pods
   kubectl get services
   ```

## Environment Variables

Key environment variables for production:

- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `STRIPE_SECRET_KEY` - Stripe payment processing
- `EMAIL_*` - Email configuration

## Container Features

### Security

- Non-root user execution
- Minimal Alpine Linux base image
- Environment variable isolation
- Rate limiting via nginx

### Performance

- Multi-stage builds for optimization
- Gzip compression
- Static file caching
- Health checks for container orchestration

### Scalability

- Horizontal scaling support
- Load balancing with nginx
- Persistent volume mounts for uploads
- Resource limits and requests

## Monitoring and Health Checks

- Health endpoint: `/health`
- Docker health checks every 30 seconds
- Kubernetes liveness and readiness probes
- Nginx access and error logs

## File Uploads

The container handles file uploads for:

- Parking images (`/public/img/parkings/`)
- Ownership proofs (`/public/img/proofs/`)
- User avatars (`/public/img/users/`)

Volumes are mounted to persist uploaded files across container restarts.

## Database

- **MongoDB Atlas** - Cloud-hosted database with existing data
- **Connection String:** `mongodb+srv://dhruv:***@cluster0.ezsavro.mongodb.net/parking-solns`
- **12 parking entries** - All existing data accessible
- **No local database container** - Uses Atlas for all environments

## Troubleshooting

### Common Issues:

1. **Port already in use:**

   ```bash
   docker-compose down
   sudo lsof -i :3000
   ```

2. **Permission denied for uploads:**

   ```bash
   docker exec -it <container_id> chown -R nodeuser:nodejs /app/public/img
   ```

3. **Database connection issues:**
   Check MongoDB container logs:
   ```bash
   docker-compose logs mongo
   ```

## Production Checklist

Before deploying to production:

- [ ] Update JWT_SECRET with a secure random string
- [ ] Configure production database connection
- [ ] Set up production email service (replace Mailtrap)
- [ ] Update Stripe keys to production values
- [ ] Configure SSL certificates for nginx
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for MongoDB
- [ ] Review and update rate limiting rules

## Scaling

For high-traffic deployments:

1. **Increase replica count:**

   ```yaml
   deploy:
     replicas: 5 # In docker-compose.prod.yml
   ```

2. **Add Redis for session storage:**

   ```yaml
   # Redis service already included in prod compose
   ```

3. **Use external managed database:**
   Update DATABASE environment variable to point to managed MongoDB service.

## Support

For issues with containerization or deployment, check:

- Container logs: `docker logs <container_id>`
- Health endpoint: `curl http://localhost:3000/health`
- Resource usage: `docker stats`
