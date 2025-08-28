-- GLIDEON E-COMMERCE DATABASE BACKUP
-- Generated: 2025-08-27 21:54:00
-- Database: PostgreSQL with all tables and data

-- =============================================================================
-- USERS TABLE
-- =============================================================================
INSERT INTO users (id, email, first_name, last_name, phone, profile_image_url, password, role, is_active, created_at, updated_at) VALUES 
('46639815', 'jimanan41@gmail.com', 'Naren', 'ji', NULL, NULL, NULL, 'admin', true, '2025-08-19 19:28:04.758052', '2025-08-19 19:28:04.758052'),
('admin-001', 'admin@glideon.com', 'Admin', 'User', NULL, NULL, '$2b$10$pirBinWwbKmbq2EnZYkA8OUFSXPOghKIPaSOYMGSAt4sbh1AscIS.', 'admin', true, '2025-08-19 19:52:04.461717', '2025-08-19 19:52:04.461717'),
('customer-001', 'customer@glideon.com', 'Customer', 'User', NULL, NULL, '$2b$10$zxG3Dq7O7h1fYAOk.jL3QuZzv9UImAJgmKz5l0FqFg81FI4IvGgAO', 'customer', true, '2025-08-19 19:52:04.461717', '2025-08-19 19:52:04.461717'),
('d8e8d06a-bbe2-4f7a-a753-d6bc88ec0a49', 'nareninsa1@gmail.com', 'naren', 'ji', NULL, NULL, '$2b$10$VT3ZEnH14pk6opnx43LNteWltRKCERBCMUgDzN9ZavdSi0nMdov6.', 'customer', true, '2025-08-19 21:34:03.978622', '2025-08-19 21:34:03.978622');

-- =============================================================================
-- CATEGORIES TABLE
-- =============================================================================
INSERT INTO categories (id, name, slug, description, image_url, is_active, is_high_demand, created_at, updated_at) VALUES 
('cat-apparel', 'Wave Protein', 'WaveProtein', 'Whey protein is a top-tier protein known for its easy digestibility and efficient absorption.', '/objects/products/6024c7f6-2767-43c7-8163-8b5c97a7ef80.png', true, false, '2025-08-19 18:05:22.687912', '2025-08-27 20:40:00.464'),
('cat-supplements', 'Weight Gainer', 'WeightGainer', 'Glideon Weight Gainer is designed for those who struggle to put on size and muscle mass.', '/objects/products/5f5d86f7-3047-4ca1-b502-2a88055d7d25.png', true, false, '2025-08-19 18:05:22.687912', '2025-08-27 20:43:15.666'),
('077d41f1-6b21-4dd8-bc1b-c59cf3aeb366', 'Creatine Monohydrate', 'creatine-monohydrate', 'The gold standard in strength and performance.', NULL, true, false, '2025-08-27 20:46:29.418182', '2025-08-27 20:46:29.418182'),
('d4d32897-36a2-4311-97bc-43841bb6a267', 'Pre-Workout', 'pre-workout', 'Ignite your workouts with explosive energy, razor-sharp focus, and enhanced blood flow.', '/objects/products/bbf0e5cd-d1fc-4b90-9637-05d6f2e7f326.png', true, false, '2025-08-27 20:45:53.36236', '2025-08-27 20:50:58.233'),
('cat-nutrition', 'Glideon BCAA', 'bcca', 'Fuel your muscles with the perfect ratio of Leucine, Isoleucine, and Valine', '/objects/products/769747e7-65c2-430a-8c33-6a5171482a2a.png', true, true, '2025-08-19 18:05:22.687912', '2025-08-27 20:47:08.45'),
('cat-equipment', 'Glideon EAA (Essential Amino Acids)', 'eaa', 'Packed with all nine essential amino acids', '/objects/products/441e221b-a5dd-4d0c-91ac-eb6cda1fabb0.png', true, true, '2025-08-19 18:05:22.687912', '2025-08-27 21:45:47.882');

-- =============================================================================
-- PRODUCTS TABLE
-- =============================================================================
INSERT INTO products (id, name, slug, description, short_description, price, sale_price, sku, stock, category_id, images, is_active, is_featured, tags, weight, dimensions, fitness_level, created_at, updated_at) VALUES 
('prod-bcaa-001', 'Glideon BCAA Premium', 'glideon-bcaa-premium', 'High-quality BCAA supplement with optimal 2:1:1 ratio for muscle recovery and growth', 'Premium BCAA supplement for muscle recovery', 2499.00, 1999.00, NULL, 50, 'cat-nutrition', '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"]', true, true, '[]', NULL, NULL, 'intermediate', '2025-08-27 21:45:49.443496', '2025-08-27 21:45:49.443496'),
('prod-bcaa-002', 'Glideon BCAA Instant', 'glideon-bcaa-instant', 'Fast-dissolving BCAA powder for quick absorption and maximum effectiveness', 'Fast-dissolving BCAA powder', 1899.00, 1599.00, NULL, 75, 'cat-nutrition', '["https://images.unsplash.com/photo-1570019681285-3d8cecde8224?w=400"]', true, false, '[]', NULL, NULL, 'beginner', '2025-08-27 21:45:49.443496', '2025-08-27 21:45:49.443496'),
('prod-eaa-001', 'Glideon EAA Complete', 'glideon-eaa-complete', 'Complete essential amino acid formula with all 9 essential amino acids your body needs', 'Complete EAA formula', 3299.00, 2799.00, NULL, 30, 'cat-equipment', '["https://images.unsplash.com/photo-1556909202-4d58d6dceb14?w=400"]', true, true, '[]', NULL, NULL, 'advanced', '2025-08-27 21:45:49.443496', '2025-08-27 21:45:49.443496'),
('prod-eaa-002', 'Glideon EAA Energy', 'glideon-eaa-energy', 'EAA formula with added caffeine for pre-workout energy and amino acid support', 'EAA with energy boost', 2899.00, NULL, NULL, 40, 'cat-equipment', '["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"]', true, false, '[]', NULL, NULL, 'intermediate', '2025-08-27 21:45:49.443496', '2025-08-27 21:45:49.443496');

-- =============================================================================
-- ORDERS TABLE
-- =============================================================================
INSERT INTO orders (id, user_id, status, total, shipping_address, payment_status, payment_method, notes, created_at, updated_at) VALUES 
('02211019-23c9-41d8-b921-7df3a8a3ba51', '46639815', 'processing', 36.98, '{"city": "dssd", "state": "dss", "street": "dssd", "country": "US", "zipCode": "2332323"}', 'paid', 'credit_card', NULL, '2025-08-19 19:31:30.318484', '2025-08-19 19:31:30.318484');

-- =============================================================================
-- SITE SETTINGS TABLE
-- =============================================================================
INSERT INTO site_settings (id, key, value, type, description, category, is_active, created_at, updated_at) VALUES 
('701381ce-69aa-4de9-bc0f-1e1f5307be3c', 'home_banners', '[{"id":"banner-1","title":"Transform Your FITNESS Journey","subtitle":"Discover premium supplements, equipment, and health products designed to fuel your performance and elevate your results.","imageUrl":"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080","buttonText":"Shop Now","buttonUrl":"/products","isActive":true},{"id":"banner-2","title":"Premium SUPPLEMENTS & Nutrition","subtitle":"Scientifically formulated supplements to maximize your gains and accelerate recovery. Trusted by athletes worldwide.","imageUrl":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080","buttonText":"Explore Supplements","buttonUrl":"/products?category=supplements","isActive":true,"createdAt":"2025-08-19T21:17:27.366Z"},{"id":"banner-3","title":"Professional EQUIPMENT & Gear","subtitle":"From home gyms to professional setups, we have everything you need to reach your fitness goals.","imageUrl":"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080","buttonText":"View Equipment","buttonUrl":"/products?category=equipment","isActive":true,"createdAt":"2025-08-19T21:17:27.366Z"}]', 'json', 'Homepage banners list', 'banner', true, '2025-08-19 21:11:07.739662', '2025-08-27 21:51:47.167'),
('a43becf9-75f3-4f00-befa-c651fef21f7d', 'about_us', '{"title":"About GLIDEON","content":"GLIDEON is your premier destination for health and fitness products. We provide high-quality supplements, equipment, and wellness solutions to help you achieve your fitness goals. Our commitment to excellence drives everything we do, from product selection to customer service.","mission":"To empower individuals on their fitness journey by providing premium products and expert guidance that deliver real results.","vision":"To become the leading platform for health and fitness enthusiasts worldwide, inspiring healthier lifestyles through innovative solutions.","values":"Quality, Innovation, Customer Success, Integrity, and Wellness"}', 'json', 'About Us page content', 'content', true, '2025-08-19 21:17:28.252095', '2025-08-19 21:19:14.565'),
('ac8e2a06-e791-4236-a63e-5f2be95c0ec7', 'site_logo', '{"logoUrl":"https://storage.googleapis.com/replit-objstore-89b71aa2-8b38-4837-b32b-bb0365a2083c/.private/uploads/3fc02dd9-c90c-4f81-83a2-4f8871ee558e","faviconUrl":"","brandName":""}', 'json', 'Site logo and branding', 'branding', true, '2025-08-19 21:21:19.780029', '2025-08-27 20:23:19.477'),
('440e19db-0158-4adb-a05c-51479f0d00ab', 'site_theme', '{"primaryColor":"#aa8a08","secondaryColor":"#1F2937","accentColor":"#F59E0B","fontFamily":"Inter","darkMode":false}', 'json', 'Site theme configuration', 'theme', true, '2025-08-19 21:21:05.556767', '2025-08-27 21:53:07.427');

-- =============================================================================
-- EMPTY TABLES (Structure preserved)
-- =============================================================================
-- cart_items: Empty
-- cms_content: Empty  
-- offers: Empty
-- offer_codes: Empty
-- order_items: Empty
-- reviews: Empty
-- addresses: Empty
-- wishlist: Empty
-- sessions: Empty (system table)

-- =============================================================================
-- NOTES
-- =============================================================================
-- Database Schema Version: Latest (August 2025)
-- 
-- Key Features:
-- - JWT Authentication system with admin/customer roles
-- - High demand category system (BCAA and EAA currently selected)
-- - Product catalog with fitness level categorization
-- - Dynamic homepage banners managed via CMS
-- - Custom theme configuration
-- - Complete e-commerce order management
-- 
-- Active Users:
-- - admin@glideon.com (password: admin123)
-- - customer@glideon.com (password: customer123)
-- 
-- Product Categories:
-- - 6 categories with 2 marked as "high demand" for homepage display
-- - 4 sample products (2 BCAA, 2 EAA) with proper pricing and descriptions
-- 
-- Site Configuration:
-- - Custom logo uploaded and configured
-- - Dynamic homepage banners (3 active)
-- - Custom theme with golden primary color (#aa8a08)
-- - About Us content configured via CMS
-- 
-- =============================================================================