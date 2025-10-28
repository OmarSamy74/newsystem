# Deployment Guide

This guide will help you deploy the Football Analysis System to various platforms.

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/OmarSamy74/newsystem.git
cd newsystem
```

### 2. Frontend Deployment (Vercel/Netlify)

#### Option A: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend: `cd football-app`
3. Deploy: `vercel --prod`

#### Option B: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Navigate to frontend: `cd football-app`
3. Build: `npm run build`
4. Deploy: `netlify deploy --prod --dir=dist`

### 3. Backend Deployment (Railway/Heroku)

#### Option A: Railway
1. Connect your GitHub repository to Railway
2. Add `railway.json` configuration:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python -m uvicorn src.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/docs"
  }
}
```

#### Option B: Heroku
1. Create `Procfile` in football_api directory:
```
web: uvicorn src.main:app --host 0.0.0.0 --port $PORT
```
2. Deploy using Heroku CLI or GitHub integration

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=Football Analysis System
```

### Backend (.env)
```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
CORS_ORIGINS=https://your-frontend-url.com
```

## Docker Deployment

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./football-app
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000
  
  backend:
    build: ./football_api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./football.db
```

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### Setup
```bash
# Clone repository
git clone https://github.com/OmarSamy74/newsystem.git
cd newsystem

# Frontend setup
cd football-app
npm install
npm run dev

# Backend setup (in new terminal)
cd ../football_api
pip install -r requirements.txt
python -m uvicorn src.main:app --reload
```

## Production Checklist

- [ ] Update API URLs in frontend
- [ ] Set up CORS for production domains
- [ ] Configure environment variables
- [ ] Set up database (if using external DB)
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all features in production environment

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend domain
2. **API Connection**: Verify API URL in frontend environment variables
3. **Build Failures**: Check Node.js and Python versions match requirements
4. **Database Issues**: Ensure database connection string is correct

### Support

For deployment issues, please:
1. Check the logs for error messages
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Create an issue on GitHub with detailed error information

## Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### Backend
- Use connection pooling
- Implement caching
- Add rate limiting
- Monitor performance metrics
