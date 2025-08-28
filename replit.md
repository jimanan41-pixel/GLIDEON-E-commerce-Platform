# Glideon Health & Fitness E-commerce Platform

## Project Overview
A comprehensive health and fitness e-commerce platform featuring product catalog, shopping cart, user authentication, CMS functionality, and admin panel. Built with React + Vite frontend, Express backend, and PostgreSQL database.

## Features
- **Frontend**: Responsive UI with dark/light themes, product catalog, cart, checkout, user authentication
- **Backend**: REST APIs, JWT authentication, product/category management, CMS module
- **Database**: PostgreSQL with Users, Products, Categories, Orders, Cart, CMS_Content tables
- **Admin Panel**: Product management, category management, CMS content management
- **Authentication**: Role-based access (Admin, Customer), secure password hashing
- **Payment**: Stripe integration for payments
- **SEO**: Friendly URLs, meta tags, Open Graph support

## Tech Stack
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Wouter routing, TanStack Query
- Backend: Node.js + Express, JWT authentication, bcrypt password hashing
- Database: PostgreSQL with Drizzle ORM
- Storage: Database-backed storage
- Deployment: Replit-ready configuration

## User Preferences
- Health and fitness theme with red accent colors (matching Glideon brand)
- Clean, modern design with professional aesthetic
- Comprehensive feature set with admin capabilities

## Project Architecture
- Shared schema definitions in `shared/schema.ts`
- Database storage interface with full CRUD operations
- RESTful API routes for all entities
- Role-based authentication and authorization
- CMS functionality for dynamic content management

## Recent Changes
- Initial project setup with comprehensive e-commerce features
- Database schema for all required entities
- Traditional JWT-based authentication system (replaced Replit auth)
- Demo admin and customer accounts with proper role-based access
- Object storage setup for server-side image uploads
- Dedicated admin product management pages with multiple image support
- Featured image system for product cards vs gallery images for detail pages
- Server-side image storage with database path storage
- Migrated hardcoded homepage banners to database-driven banner management system
- Enhanced CMS with comprehensive banner list view, CRUD operations, and image uploads
- Homepage now dynamically loads banners from admin panel with real-time updates
- Implemented prefilled forms for About Us content with default company information
- Fixed banner title display to show custom headings properly on homepage
- Connected About Us page to CMS system for real-time content updates from admin panel
- Implemented database-driven theme management with admin panel light/dark selection
- Created logo synchronization system between admin panel and website header display
- Unified offers and offer codes system with complete checkout integration
- Real-time discount validation and usage tracking for promotional codes
- Comprehensive user account management system with profile, orders, and wishlist
- Enhanced database schema with phone numbers, address book, and wishlist functionality
- Fixed JWT authentication flow - resolved cart and API authentication issues (January 2025)
- Improved theme parsing to handle both JSON objects and plain text values
- Cart system now fully operational with proper user authentication
- Fixed edit product "no data" issue by simplifying product lookup logic
- Resolved Shop by Category images not displaying with updated fallback mappings
- Removed Replit Auth completely - now uses JWT authentication only for all deployments
- Simplified authentication system for universal deployment compatibility
- Fixed logo upload from CMS - now displays correctly in header with URL conversion
- Enhanced theme system to apply custom colors from CMS settings to CSS variables
- Added fitness level categorization system to products (Beginner, Intermediate, Advanced, Professional)
- Updated product add/edit forms with fitness level dropdown selection
- Implemented complete high demand category selection system with max 2 category limit and dynamic homepage display
- Fixed product category pages by adding sample products to empty database (August 2025)
- Updated footer shop links to match actual database categories for proper navigation

## Development Status
- ✅ Project initialized with full e-commerce features
- ✅ Traditional authentication with role-based dashboards
- ✅ Server-side image upload and management system
- ✅ Dedicated admin product management pages
- ✅ Database-driven homepage banner management with CMS integration
- ✅ Dynamic banner system with list view, editing, and image upload capabilities
- ✅ Prefilled CMS forms for easy content editing and updates
- ✅ Unified offers management system with checkout integration
- ✅ Real-time discount code validation and automatic usage tracking
- ✅ Comprehensive user account management with profile, orders, and wishlist features
- ✅ Enhanced user database schema with phone numbers and address book functionality
- ✅ JWT authentication system fully operational with cart functionality
- ✅ Theme management supporting both JSON and plain text configurations
- → Fully functional e-commerce platform with complete authentication, cart system, user management, admin tools, and dynamic content management