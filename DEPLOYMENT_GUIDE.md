# GLIDEON E-commerce Deployment Guide

## Render Deployment (Recommended)

### Prerequisites
1. GitHub repository with your code
2. Render account (free tier available)
3. Your database backup file (`database_backup_complete.sql`)

### Step 1: GitHub Setup
1. Create new repository on GitHub
2. Push all your code:
   ```bash
   git init
   git add .
   git commit -m "Initial GLIDEON e-commerce platform"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### Step 2: Render Deployment
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to start deployment

### Step 3: Database Setup
1. Wait for PostgreSQL database to be created
2. Go to your database in Render dashboard
3. Click "Connect" → "External Connection"
4. Use the connection details to connect via psql or database client
5. Run your database schema setup:
   ```sql
   -- First create tables (from your Drizzle schema)
   -- Then restore data
   \i database_backup_complete.sql
   ```

### Step 4: Environment Variables (Auto-configured)
- `NODE_ENV=production` ✅
- `DATABASE_URL` ✅ (from PostgreSQL service)
- `JWT_SECRET` ✅ (auto-generated)
- `SESSION_SECRET` ✅ (auto-generated)

### Step 5: Domain & SSL
- Render provides free SSL certificates
- Custom domain can be added in service settings
- Default URL: `https://your-app-name.onrender.com`

## Manual Render Setup (Alternative)

If Blueprint doesn't work, set up manually:

### 1. Web Service
- **Name**: glideon-ecommerce
- **Environment**: Node
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18+ (latest recommended)

### 2. PostgreSQL Database
- **Name**: glideon-db
- **Database Name**: glideon
- **User**: glideon_user
- **Plan**: Starter (free)

### 3. Environment Variables
```
NODE_ENV=production
DATABASE_URL=[auto-filled by Render]
JWT_SECRET=[generate random 32+ character string]
SESSION_SECRET=[generate random 32+ character string]
```

## Deployment Features

### ✅ Production Ready
- **Build Process**: Vite builds optimized client bundle
- **Server**: Express serves both API and static files
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based with secure sessions
- **Static Files**: Served directly by Express in production

### ✅ Performance Optimized
- **Bundling**: Client code bundled with Vite
- **Server Bundle**: ESBuild bundles server for fast startup
- **Caching**: Static assets cached with proper headers
- **Database**: Prepared statements with connection pooling

### ✅ Security Features
- **HTTPS**: Automatic SSL via Render
- **CORS**: Configured for production domains
- **Sessions**: Secure HTTP-only cookies
- **Passwords**: bcrypt hashing with salt
- **JWT**: Signed tokens with expiration

## Post-Deployment Steps

### 1. Verify Deployment
1. Check service logs in Render dashboard
2. Test website functionality:
   - Homepage loads with banners ✅
   - Product catalog displays ✅
   - Admin login works ✅
   - Cart and checkout flow ✅

### 2. Admin Account
- **Email**: admin@glideon.com
- **Password**: admin123
- Access admin panel at: `/admin`

### 3. Database Migration
If you need to update database schema later:
```bash
# Connect to production database
npm run db:push
```

## Troubleshooting

### Build Issues
- Check Node.js version (18+ required)
- Verify all dependencies in package.json
- Check build logs in Render dashboard

### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Check database is running in Render dashboard
- Ensure PostgreSQL service is in same region

### Runtime Issues
- Check service logs in Render dashboard
- Verify environment variables are set
- Test database connectivity

## Cost Estimate (Render Free Tier)
- **Web Service**: Free (750 hours/month)
- **PostgreSQL**: Free (90 days, then $7/month)
- **Bandwidth**: 100GB free monthly
- **SSL Certificate**: Free
- **Custom Domain**: Free

## Scaling Options
- **Starter Plan**: $7/month (always-on, more resources)
- **Standard Plan**: $25/month (auto-scaling, more CPU/memory)
- **Database**: Multiple plan options available

Your GLIDEON platform is deployment-ready! 🚀