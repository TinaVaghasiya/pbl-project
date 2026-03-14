# Deployment Guide

Complete guide for deploying the Smart Sign Language Interpreter to production.

## Prerequisites

- Node.js 16+ installed
- Python 3.8+ installed
- MongoDB database (local or cloud)
- Domain name (optional)
- SSL certificate (for HTTPS)

## Production Checklist

### Backend
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas or production database
- [ ] Configure CORS for production domain
- [ ] Set up error logging
- [ ] Enable rate limiting
- [ ] Set up monitoring

### Frontend
- [ ] Build production bundle
- [ ] Configure API URLs
- [ ] Enable HTTPS
- [ ] Optimize images
- [ ] Set up CDN
- [ ] Configure caching

### Python AI
- [ ] Install production dependencies
- [ ] Use production WSGI server (Gunicorn)
- [ ] Set up process manager
- [ ] Configure logging
- [ ] Optimize model loading

## Deployment Options

### Option 1: Single Server (VPS)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python
sudo apt install -y python3 python3-pip

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

#### 2. Deploy Backend
```bash
cd /var/www/sign-language/backend
npm install --production
cp .env.example .env
# Edit .env with production values
node seed.js
pm2 start server.js --name backend
pm2 save
pm2 startup
```

#### 3. Deploy Python AI
```bash
cd /var/www/sign-language/python-ai
pip3 install -r requirements.txt
pip3 install gunicorn
pm2 start "gunicorn -w 4 -b 0.0.0.0:5001 app:app" --name python-ai
```

#### 4. Build and Deploy Frontend
```bash
cd /var/www/sign-language/frontend
npm install
npm run build
# Copy dist/ to Nginx web root
sudo cp -r dist/* /var/www/html/
```

#### 5. Configure Nginx
```nginx
# /etc/nginx/sites-available/sign-language
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Python AI API
    location /ai {
        proxy_pass http://localhost:5001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/sign-language /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Cloud Deployment

#### Frontend - Vercel
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

#### Backend - Heroku
```bash
cd backend
heroku login
heroku create sign-language-backend
heroku addons:create mongolab
git push heroku main
```

#### Python AI - Railway
```bash
cd python-ai
# Create railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn -w 4 -b 0.0.0.0:$PORT app:app"
  }
}
# Deploy via Railway dashboard
```

### Option 3: Docker Deployment

#### 1. Create Dockerfiles

**Backend Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Python AI Dockerfile**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn
COPY . .
EXPOSE 5001
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "app:app"]
```

**Frontend Dockerfile**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/sign_language_db
      - PYTHON_SERVICE_URL=http://python-ai:5001
    depends_on:
      - mongodb

  python-ai:
    build: ./python-ai
    ports:
      - "5001:5001"

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
      - python-ai

volumes:
  mongo-data:
```

```bash
docker-compose up -d
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sign_language_db
PYTHON_SERVICE_URL=https://python-ai.yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
```

### Frontend (.env.production)
```
VITE_API_URL=https://api.yourdomain.com
VITE_PYTHON_API_URL=https://python-ai.yourdomain.com
```

## Database Setup

### MongoDB Atlas
1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string
6. Update MONGODB_URI in backend .env

### Seed Production Database
```bash
cd backend
node seed.js
```

## Monitoring & Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### Setup Log Rotation
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Error Tracking
- Sentry.io
- LogRocket
- New Relic

## Performance Optimization

### Backend
- Enable compression
- Use Redis for caching
- Implement rate limiting
- Optimize database queries

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### Python AI
- Use GPU acceleration
- Implement model caching
- Optimize frame processing
- Use connection pooling

## Security

### Backend
- Use helmet.js
- Implement CSRF protection
- Sanitize inputs
- Use HTTPS only

### Database
- Enable authentication
- Use strong passwords
- Restrict IP access
- Regular backups

### API
- Implement rate limiting
- Use API keys
- Validate all inputs
- Log security events

## Backup Strategy

### Database Backup
```bash
# Automated daily backup
mongodump --uri="mongodb+srv://..." --out=/backups/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb+srv://..." /backups/20240101
```

### Application Backup
```bash
# Backup code and configs
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/sign-language
```

## Maintenance

### Update Dependencies
```bash
# Backend
cd backend && npm update

# Frontend
cd frontend && npm update

# Python
cd python-ai && pip install --upgrade -r requirements.txt
```

### Monitor Resources
```bash
# CPU and Memory
htop

# Disk usage
df -h

# PM2 processes
pm2 status
```

## Troubleshooting

### Backend Issues
```bash
pm2 logs backend
pm2 restart backend
```

### Python AI Issues
```bash
pm2 logs python-ai
pm2 restart python-ai
```

### Database Issues
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
```

### Nginx Issues
```bash
sudo nginx -t
sudo systemctl status nginx
sudo systemctl restart nginx
```

## Rollback Strategy

### Quick Rollback
```bash
pm2 stop all
git checkout previous-version
npm install
pm2 restart all
```

### Database Rollback
```bash
mongorestore --uri="mongodb+srv://..." /backups/previous-date
```

## Support

For deployment issues:
1. Check logs: `pm2 logs`
2. Verify environment variables
3. Test API endpoints
4. Check firewall rules
5. Review Nginx configuration
