-- Complete database reset script for local development
-- This drops everything and recreates with the exact schema your app expects

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop all tables in correct order
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS addresses CASCADE; 
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS offer_codes CASCADE;
DROP TABLE IF EXISTS cms_content CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (exact match to schema.ts)
CREATE TABLE users (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar UNIQUE,
    first_name varchar,
    last_name varchar,
    phone varchar,
    profile_image_url varchar,
    password varchar,
    role varchar DEFAULT 'customer' NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
    sid varchar PRIMARY KEY,
    sess jsonb NOT NULL,
    expire timestamp NOT NULL
);

-- Categories table
CREATE TABLE categories (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    slug varchar UNIQUE NOT NULL,
    description text,
    image_url varchar,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Products table (exact match to schema.ts)
CREATE TABLE products (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    slug varchar UNIQUE NOT NULL,
    description text,
    short_description text,
    price numeric(10,2) NOT NULL,
    sale_price numeric(10,2),
    sku varchar UNIQUE,
    stock integer DEFAULT 0,
    category_id varchar REFERENCES categories(id),
    images jsonb DEFAULT '[]',
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    tags jsonb DEFAULT '[]',
    weight varchar,
    dimensions varchar,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- CMS Content table (exact match to schema.ts with "type" column)
CREATE TABLE cms_content (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    key varchar UNIQUE NOT NULL,
    type varchar NOT NULL,
    value text NOT NULL,
    title varchar,
    description text,
    content jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Reviews table  
CREATE TABLE reviews (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id varchar NOT NULL REFERENCES users(id),
    product_id varchar NOT NULL REFERENCES products(id),
    rating integer NOT NULL,
    comment text,
    is_approved boolean DEFAULT false,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Offer Codes table (exact match to schema.ts)
CREATE TABLE offer_codes (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar UNIQUE NOT NULL,
    description text,
    discount_type varchar NOT NULL,
    discount_value numeric(10,2) NOT NULL,
    min_order_amount numeric(10,2),
    max_discount numeric(10,2),
    usage_limit integer,
    used_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    valid_from timestamp DEFAULT NOW(),
    valid_to timestamp,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Site Settings table (exact match to schema.ts)
CREATE TABLE site_settings (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    key varchar UNIQUE NOT NULL,
    value text,
    type varchar DEFAULT 'text',
    description text,
    category varchar DEFAULT 'general',
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Cart Items table
CREATE TABLE cart_items (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id varchar NOT NULL REFERENCES users(id),
    product_id varchar NOT NULL REFERENCES products(id),
    quantity integer NOT NULL DEFAULT 1,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id varchar NOT NULL REFERENCES users(id),
    status varchar DEFAULT 'pending' NOT NULL,
    total numeric(10,2) NOT NULL,
    shipping_address jsonb,
    payment_status varchar DEFAULT 'pending' NOT NULL,
    payment_method varchar,
    notes text,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Order Items table
CREATE TABLE order_items (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id varchar NOT NULL REFERENCES orders(id),
    product_id varchar NOT NULL REFERENCES products(id),
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp DEFAULT NOW()
);

-- Addresses table
CREATE TABLE addresses (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type varchar NOT NULL,
    first_name varchar,
    last_name varchar,
    company varchar,
    street varchar NOT NULL,
    street2 varchar,
    city varchar NOT NULL,
    state varchar NOT NULL,
    zip_code varchar NOT NULL,
    country varchar DEFAULT 'US' NOT NULL,
    phone varchar,
    is_default boolean DEFAULT false,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE wishlist (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id varchar NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX idx_sessions_expire ON sessions(expire);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);

-- Insert demo users with correct password hashes
INSERT INTO users (id, email, password, first_name, last_name, role) VALUES
('admin-user-id', 'admin@glideon.com', '$2b$12$iNlxIsk6dRmD0Rjm/I7MRuafrVAjdltS7h0CPx/xMm2aK.A9a/7la', 'Admin', 'User', 'admin'),
('customer-user-id', 'customer@glideon.com', '$2b$12$5JfxIJrLiqczFLeOFUQSdOoMfcWTEWV7QNP0aCdrhxdPoSvDYGXTu', 'John', 'Doe', 'customer');

-- Insert categories
INSERT INTO categories (id, name, slug, description, is_active) VALUES
('cat-supplements', 'Supplements', 'supplements', 'High-quality nutritional supplements', true),
('cat-equipment', 'Equipment', 'equipment', 'Professional fitness equipment', true),
('cat-apparel', 'Apparel', 'apparel', 'Workout clothing and accessories', true),
('cat-nutrition', 'Nutrition', 'nutrition', 'Healthy foods and meal plans', true);

-- Insert products
INSERT INTO products (id, name, slug, description, short_description, price, category_id, images, stock, is_featured, is_active) VALUES
('prod-protein-powder', 'Premium Whey Protein Powder', 'premium-whey-protein-powder', 'High-quality whey protein isolate with 25g protein per serving. Perfect for muscle building and recovery.', 'Premium whey protein with 25g protein per serving', 49.99, 'cat-supplements', '[]', 100, true, true),
('prod-resistance-bands', 'Resistance Band Set', 'resistance-band-set', 'Complete set of resistance bands with different resistance levels. Perfect for home workouts.', 'Complete resistance band set for home workouts', 29.99, 'cat-equipment', '[]', 50, true, true),
('prod-workout-shirt', 'Performance T-Shirt', 'performance-t-shirt', 'Moisture-wicking athletic t-shirt made from premium materials for ultimate comfort during workouts.', 'Moisture-wicking performance t-shirt', 24.99, 'cat-apparel', '[]', 75, false, true),
('prod-pre-workout', 'Pre-Workout Formula', 'pre-workout-formula', 'Energy-boosting pre-workout supplement with natural caffeine and amino acids.', 'Energy-boosting pre-workout with natural caffeine', 34.99, 'cat-supplements', '[]', 80, true, true);

-- Insert site settings  
INSERT INTO site_settings (key, value, type, category, description) VALUES
('site_theme', 'light', 'text', 'theme', 'Current site theme'),
('site_logo_url', '', 'text', 'theme', 'Site logo URL'),
('site_brand_name', 'GLIDEON', 'text', 'general', 'Brand name'),
('home_banners', '[{"id":"banner-1","title":"Transform Your FITNESS Journey","subtitle":"Discover premium supplements, equipment, and health products designed to fuel your performance and elevate your results.","imageUrl":"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080","buttonText":"Shop Now","buttonUrl":"/products","isActive":true},{"id":"banner-2","title":"Premium SUPPLEMENTS & Nutrition","subtitle":"Scientifically formulated supplements to maximize your gains and accelerate recovery. Trusted by athletes worldwide.","imageUrl":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080","buttonText":"Explore Supplements","buttonUrl":"/products?category=supplements","isActive":true},{"id":"banner-3","title":"Professional EQUIPMENT & Gear","subtitle":"From home gyms to professional setups, we have everything you need to reach your fitness goals.","imageUrl":"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080","buttonText":"View Equipment","buttonUrl":"/products?category=equipment","isActive":true}]', 'json', 'banner', 'Homepage banners'),
('about_us', '{"title":"About GLIDEON","content":"<p>Welcome to GLIDEON, your premier destination for health and fitness excellence.</p>","imageUrl":""}', 'json', 'content', 'About us content');

-- Insert demo offer codes
INSERT INTO offer_codes (code, description, discount_type, discount_value, min_order_amount, usage_limit, is_active, valid_to) VALUES
('WELCOME10', 'Welcome discount - 10% off first order', 'percentage', 10.00, 0, 1000, true, NOW() + INTERVAL '30 days'),
('SAVE20', '20% off orders over $75', 'percentage', 20.00, 75.00, 500, true, NOW() + INTERVAL '14 days');

COMMIT;

-- Success message
SELECT 'Database reset complete! Login with admin@glideon.com/admin123 or customer@glideon.com/customer123' as status;