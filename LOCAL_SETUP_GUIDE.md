# GLIDEON Local Setup Guide

## Quick Setup Steps

### 1. Database Setup
```bash
# Create database
createdb glideon_new

# IMPORTANT: Use this FIXED script that matches your exact application schema
psql -U postgres -d glideon_new -f reset_database.sql
```

### 2. Environment Variables
Create a `.env` file in your project root with:

```bash
# Local PostgreSQL connection string
DATABASE_URL=postgresql://postgres:Password@123@localhost:5432/glideon_new

# Node environment
NODE_ENV=development

# JWT Secret for authentication (REQUIRED)
JWT_SECRET=glideon-super-secure-jwt-secret-key-2024-health-fitness

# Express session secret
SESSION_SECRET=super-secret-key

# Database connection details
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=Password@123
PGDATABASE=glideon_new
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Application
```bash
npm run dev
```

## Troubleshooting Common Issues

### Database Connection Errors

**Error: `ECONNREFUSED` or `Failed to fetch categories`**

1. **Check PostgreSQL is running:**
   ```bash
   # On macOS with Homebrew
   brew services start postgresql
   
   # On Ubuntu/Debian
   sudo systemctl start postgresql
   
   # On Windows
   # Start PostgreSQL service from Services panel
   ```

2. **Verify database exists:**
   ```bash
   psql -U postgres -l | grep glideon_new
   ```

3. **Test connection manually:**
   ```bash
   psql -U postgres -d glideon_new -c "SELECT COUNT(*) FROM users;"
   ```

4. **Check your DATABASE_URL format:**
   ```bash
   # Correct format:
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   
   # Your specific case:
   DATABASE_URL=postgresql://postgres:Password@123@localhost:5432/glideon_new
   ```

### Authentication Issues

**Error: `JWT_SECRET not set`**
- Make sure `JWT_SECRET` is in your `.env` file
- Restart the server after adding environment variables

**Error: `Unauthorized` (401 errors)**
- Clear localStorage and login again:
  ```javascript
  // In browser console:
  localStorage.clear();
  location.reload();
  ```

### Demo Accounts

After running the database setup script, you can login with:

- **Admin Account**: 
  - Email: `admin@glideon.com`
  - Password: `admin123`

- **Customer Account**:
  - Email: `customer@glideon.com` 
  - Password: `customer123`

### Verify Setup

Run the verification script to check everything is working:
```bash
node verify_setup.js
```

This will verify:
- Password hashes are correct
- Environment variables are set
- Database connection parameters

## Database Schema Verification

Run these commands to verify your database setup:

```sql
-- Check all tables exist
\dt

-- Verify demo data
SELECT email, role FROM users;
SELECT name, price FROM products LIMIT 5;
SELECT code, discount_value FROM offers WHERE is_active = true;

-- Check relationships
SELECT u.email, COUNT(w.id) as wishlist_count 
FROM users u 
LEFT JOIN wishlist w ON u.id = w.user_id 
GROUP BY u.email;
```

## Port Configuration

The application runs on:
- **Backend**: http://localhost:5000
- **Frontend**: Served by the same port (integrated with Vite)

## File Structure

```
project/
├── server/
│   ├── db.ts          # Database connection
│   ├── storage.ts     # Database operations
│   ├── routes.ts      # API endpoints
│   └── index.ts       # Express server
├── client/
│   └── src/
│       ├── pages/     # React pages
│       ├── components/# React components
│       └── hooks/     # Custom hooks
├── shared/
│   └── schema.ts      # Database schema
├── database_setup.sql # Database initialization
└── .env              # Environment variables
```

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Database operations
npm run db:push          # Push schema changes
npm run db:push --force  # Force push (destructive)

# Build for production
npm run build
```

## Next Steps After Setup

1. **Login** with demo accounts
2. **Test features**:
   - Browse products
   - Add to cart
   - Create account profile
   - Use admin panel (with admin account)
3. **Customize** products and categories in admin panel
4. **Configure** site settings and branding

## Support

If you encounter issues:

1. Check PostgreSQL is running and accessible
2. Verify `.env` file has correct DATABASE_URL
3. Ensure database was created and populated with demo data
4. Clear browser cache/localStorage if authentication fails
5. Check server logs for specific error messages

The application includes comprehensive error handling and logging to help identify issues quickly.