# Deployment Guide

## Quick Start (Development)

### Prerequisites
- Node.js 18+ installed
- npm package manager

### 1. Install Dependencies
```bash
# Install all dependencies at once
npm run install:all
```

### 2. Start Development Servers
```bash
# Start both backend and frontend
npm run dev
```

This will start:
- Backend on http://localhost:3001
- Frontend on http://localhost:5173

## Production Deployment

### Option 1: Docker (Recommended)

#### Prerequisites
- Docker installed
- Docker Compose installed

#### Steps
1. **Build and run with Docker Compose:**
```bash
docker-compose up --build
```

2. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

3. **Stop the application:**
```bash
docker-compose down
```

### Option 2: Manual Deployment

#### Backend Deployment

1. **Build the backend:**
```bash
cd backend
npm install
npm run build
```

2. **Set environment variables:**
```bash
export NODE_ENV=production
export PORT=3001
export FRONTEND_URL=http://your-frontend-url.com
```

3. **Start the server:**
```bash
npm start
```

#### Frontend Deployment

1. **Build the frontend:**
```bash
cd frontend
npm install
export VITE_API_URL=http://your-backend-url.com
npm run build
```

2. **Serve the built files:**
```bash
# Using any static file server
npx serve -s dist
```

## Cloud Deployment Options

### Vercel (Frontend)

1. **Connect your repository to Vercel**
2. **Set environment variable:**
   - `VITE_API_URL`: Your backend URL
3. **Deploy**

### Heroku (Backend)

1. **Create a Heroku app:**
```bash
heroku create your-watchtogether-backend
```

2. **Set environment variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=your-frontend-url
```

3. **Deploy:**
```bash
git push heroku main
```

### Railway

1. **Connect your repository to Railway**
2. **Add environment variables**
3. **Deploy automatically**

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-here
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Nginx

1. **Install Certbot:**
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. **Get SSL certificate:**
```bash
sudo certbot --nginx -d yourdomain.com
```

3. **Auto-renewal:**
```bash
sudo certbot renew --dry-run
```

### Cloudflare SSL (Easier)

1. **Add your domain to Cloudflare**
2. **Update nameservers**
3. **Enable SSL/TLS encryption**
4. **Configure DNS records**

## Database Setup (Optional)

For persistent storage, you can add a database:

### PostgreSQL with Docker

```yaml
# Add to docker-compose.yml
postgres:
  image: postgres:15
  environment:
    POSTGRES_DB: watchtogether
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: your-password
  volumes:
    - postgres_data:/var/lib/postgresql/data
  ports:
    - "5432:5432"
```

### MongoDB Alternative

```yaml
# Add to docker-compose.yml
mongodb:
  image: mongo:6
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: your-password
  volumes:
    - mongodb_data:/data/db
  ports:
    - "27017:27017"
```

## Monitoring Setup

### PM2 (Process Management)

1. **Install PM2:**
```bash
npm install -g pm2
```

2. **Start with PM2:**
```bash
pm2 start backend/dist/index.js --name "watchtogether-backend"
pm2 start frontend/dist --name "watchtogether-frontend" -- serve
```

3. **Monitor:**
```bash
pm2 monit
```

### Logging

```bash
# View logs
pm2 logs watchtogether-backend
pm2 logs watchtogether-frontend
```

## Backup Strategy

### Database Backup

```bash
# PostgreSQL
pg_dump watchtogether > backup.sql

# MongoDB
mongodump --db watchtogether --out backup/
```

### Application Backup

```bash
# Create backup archive
tar -czf watchtogether-backup.tar.gz \
  backend/dist \
  frontend/dist \
  docker-compose.yml \
  .env files
```

## Scaling

### Horizontal Scaling

1. **Use a load balancer (Nginx):**
```nginx
upstream backend {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}
```

2. **Use Redis for Socket.io:**
```javascript
// In backend/src/index.ts
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

### CDN Setup

1. **Use Cloudflare:**
   - Add domain to Cloudflare
   - Configure DNS
   - Enable CDN

2. **Configure caching:**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Security Hardening

### 1. Rate Limiting

```javascript
// In backend/src/index.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. CORS Configuration

```javascript
// Restrict to specific origins
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

### 3. Input Validation

```javascript
// Add validation middleware
import { body, validationResult } from 'express-validator';

app.post('/api/rooms', [
  body('username').isLength({ min: 1, max: 50 }),
  body('roomName').isLength({ min: 1, max: 100 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ...
});
```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check firewall settings
   - Ensure SSL certificate is valid
   - Verify CORS configuration

2. **Video Not Syncing**
   - Check host permissions
   - Verify video URL accessibility
   - Check network latency

3. **High Memory Usage**
   - Monitor room cleanup
   - Check for memory leaks
   - Implement rate limiting

### Debug Commands

```bash
# Check running processes
ps aux | grep node

# Check network connections
netstat -tlnp | grep :3001

# Check logs
tail -f /var/log/watchtogether.log

# Test WebSocket connection
wscat -c ws://localhost:3001/socket.io/
```

## Support

For deployment issues:
1. Check the logs
2. Verify environment variables
3. Test connectivity
4. Review configuration
5. Contact support if needed

## Next Steps

1. **Set up monitoring** (Prometheus, Grafana)
2. **Add analytics** (Google Analytics, Mixpanel)
3. **Implement A/B testing**
4. **Set up CI/CD pipeline**
5. **Add automated backups**
6. **Create admin dashboard**

---

For more help, refer to the main README.md and ARCHITECTURE.md files.