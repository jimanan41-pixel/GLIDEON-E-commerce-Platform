-- GLIDEON E-commerce Database Setup Script
-- Run this script on your local PostgreSQL database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS cms_content CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar UNIQUE NOT NULL,
    password varchar NOT NULL,
    first_name varchar NOT NULL,
    last_name varchar NOT NULL,
    phone varchar,
    role varchar DEFAULT 'customer' NOT NULL,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Create Categories table
CREATE TABLE categories (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    slug varchar UNIQUE NOT NULL,
    description text,
    image_url varchar,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Create Products table
CREATE TABLE products (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar NOT NULL,
    slug varchar UNIQUE NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    category_id varchar REFERENCES categories(id),
    featured_image varchar,
    image_urls text[],
    stock_quantity integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Create Sessions table (for authentication)
CREATE TABLE sessions (
    sid varchar PRIMARY KEY,
    sess jsonb NOT NULL,
    expire timestamp NOT NULL
);

-- Create Site Settings table (for CMS)
CREATE TABLE site_settings (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    key varchar UNIQUE NOT NULL,
    value text,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Create CMS Content table
CREATE TABLE cms_content (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    type varchar NOT NULL,
    title varchar,
    content text,
    image_url varchar,
    meta_data jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Create Offers table
CREATE TABLE offers (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    code varchar UNIQUE NOT NULL,
    title varchar NOT NULL,
    description text,
    discount_type varchar NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value numeric(10,2) NOT NULL,
    minimum_order_amount numeric(10,2) DEFAULT 0,
    usage_limit integer,
    usage_count integer DEFAULT 0,
    starts_at timestamp,
    expires_at timestamp,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Create Reviews table
CREATE TABLE reviews (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id varchar NOT NULL REFERENCES products(id),
    user_id varchar NOT NULL REFERENCES users(id),
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- Create Cart Items table
CREATE TABLE cart_items (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id varchar NOT NULL REFERENCES users(id),
    product_id varchar NOT NULL REFERENCES products(id),
    quantity integer NOT NULL DEFAULT 1,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create Orders table
CREATE TABLE orders (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id varchar NOT NULL REFERENCES users(id),
    status varchar DEFAULT 'pending' NOT NULL,
    total numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    shipping_amount numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    offer_code varchar,
    shipping_address jsonb,
    billing_address jsonb,
    payment_status varchar DEFAULT 'pending',
    payment_method varchar,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Create Order Items table
CREATE TABLE order_items (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id varchar NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id varchar NOT NULL REFERENCES products(id),
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Create Addresses table
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

-- Create Wishlist table
CREATE TABLE wishlist (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id varchar NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX idx_sessions_expire ON sessions(expire);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);

-- Insert demo admin user (password: admin123)
INSERT INTO users (id, email, password, first_name, last_name, role) VALUES
('admin-user-id', 'admin@glideon.com', '$2b$12$iNlxIsk6dRmD0Rjm/I7MRuafrVAjdltS7h0CPx/xMm2aK.A9a/7la', 'Admin', 'User', 'admin');

-- Insert demo customer user (password: customer123)  
INSERT INTO users (id, email, password, first_name, last_name, phone, role) VALUES
('customer-user-id', 'customer@glideon.com', '$2b$12$5JfxIJrLiqczFLeOFUQSdOoMfcWTEWV7QNP0aCdrhxdPoSvDYGXTu', 'John', 'Doe', '+1 (555) 123-4567', 'customer');

-- Insert categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
('cat-supplements', 'Supplements', 'supplements', 'High-quality nutritional supplements for optimal health and performance', '/public-objects/categories/supplements.jpg'),
('cat-equipment', 'Equipment', 'equipment', 'Professional fitness equipment and accessories for home and gym use', '/public-objects/categories/equipment.jpg'),
('cat-apparel', 'Apparel', 'apparel', 'Comfortable and stylish workout clothing and accessories', '/public-objects/categories/apparel.jpg'),
('cat-nutrition', 'Nutrition', 'nutrition', 'Healthy foods and meal plans to fuel your fitness journey', '/public-objects/categories/nutrition.jpg');

-- Insert sample products
INSERT INTO products (id, name, slug, description, price, category_id, featured_image, image_urls, stock_quantity, is_featured) VALUES
('prod-protein-powder', 'Premium Whey Protein Powder', 'premium-whey-protein-powder', 'High-quality whey protein isolate with 25g protein per serving. Perfect for muscle building and recovery.', 49.99, 'cat-supplements', '/public-objects/products/protein-powder-1.jpg', ARRAY['/public-objects/products/protein-powder-1.jpg', '/public-objects/products/protein-powder-2.jpg'], 100, true),
('prod-resistance-bands', 'Resistance Band Set', 'resistance-band-set', 'Complete set of resistance bands with different resistance levels. Perfect for home workouts.', 29.99, 'cat-equipment', '/public-objects/products/resistance-bands-1.jpg', ARRAY['/public-objects/products/resistance-bands-1.jpg'], 50, true),
('prod-workout-shirt', 'Performance T-Shirt', 'performance-t-shirt', 'Moisture-wicking athletic t-shirt made from premium materials for ultimate comfort during workouts.', 24.99, 'cat-apparel', '/public-objects/products/tshirt-1.jpg', ARRAY['/public-objects/products/tshirt-1.jpg'], 75, false),
('prod-pre-workout', 'Pre-Workout Formula', 'pre-workout-formula', 'Energy-boosting pre-workout supplement with natural caffeine and amino acids.', 34.99, 'cat-supplements', '/public-objects/products/pre-workout-1.jpg', ARRAY['/public-objects/products/pre-workout-1.jpg'], 80, true);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
('site_theme', 'light'),
('site_logo_url', ''),
('site_brand_name', 'GLIDEON'),
('home_banners', '[
  {
    "id": "banner-1",
    "title": "Transform Your Fitness Journey",
    "subtitle": "Premium supplements and equipment to help you reach your goals",
    "imageUrl": "/public-objects/banners/fitness-banner-1.jpg",
    "ctaText": "Shop Now",
    "ctaLink": "/products",
    "isActive": true
  },
  {
    "id": "banner-2", 
    "title": "New Arrivals",
    "subtitle": "Discover our latest collection of fitness essentials",
    "imageUrl": "/public-objects/banners/fitness-banner-2.jpg",
    "ctaText": "Explore",
    "ctaLink": "/products",
    "isActive": true
  }
]'),
('about_us', '{
  "title": "About GLIDEON",
  "content": "<p>Welcome to GLIDEON, your premier destination for health and fitness excellence. We are dedicated to providing top-quality supplements, equipment, and apparel to support your fitness journey.</p><p>Our mission is to empower individuals to achieve their health and wellness goals through premium products, expert guidance, and unwavering commitment to quality.</p><p>Founded by fitness enthusiasts, GLIDEON combines years of industry experience with a passion for helping people transform their lives through fitness.</p>",
  "imageUrl": "/public-objects/about/about-us.jpg"
}');

-- Insert sample offers
INSERT INTO offers (code, title, description, discount_type, discount_value, minimum_order_amount, usage_limit, starts_at, expires_at, is_active) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off your first order', 'percentage', 10.00, 0, 1000, NOW(), NOW() + INTERVAL '30 days', true),
('SAVE20', '20% Off Orders Over $75', 'Save 20% on orders over $75', 'percentage', 20.00, 75.00, 500, NOW(), NOW() + INTERVAL '14 days', true),
('FREESHIP', 'Free Shipping', 'Free shipping on any order', 'fixed', 9.99, 0, 200, NOW(), NOW() + INTERVAL '7 days', true);

-- Insert sample addresses for demo customer
INSERT INTO addresses (user_id, type, first_name, last_name, street, city, state, zip_code, country, phone, is_default) VALUES
('customer-user-id', 'shipping', 'John', 'Doe', '123 Main Street', 'New York', 'NY', '10001', 'US', '+1 (555) 123-4567', true),
('customer-user-id', 'billing', 'John', 'Doe', '456 Oak Avenue', 'New York', 'NY', '10002', 'US', '+1 (555) 123-4567', false);

-- Insert sample wishlist items for demo customer
INSERT INTO wishlist (user_id, product_id) VALUES
('customer-user-id', 'prod-protein-powder'),
('customer-user-id', 'prod-resistance-bands');

-- Insert sample order for demo customer
INSERT INTO orders (id, user_id, status, total, subtotal, tax_amount, shipping_amount, discount_amount, offer_code, shipping_address, billing_address, payment_status, payment_method) VALUES
('order-demo-1', 'customer-user-id', 'delivered', 89.97, 79.98, 6.40, 9.99, 6.40, 'WELCOME10', 
'{"firstName": "John", "lastName": "Doe", "street": "123 Main Street", "city": "New York", "state": "NY", "zipCode": "10001", "country": "US", "phone": "+1 (555) 123-4567"}',
'{"firstName": "John", "lastName": "Doe", "street": "456 Oak Avenue", "city": "New York", "state": "NY", "zipCode": "10002", "country": "US", "phone": "+1 (555) 123-4567"}',
'completed', 'credit_card');

-- Insert order items for the sample order
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('order-demo-1', 'prod-protein-powder', 1, 49.99),
('order-demo-1', 'prod-resistance-bands', 1, 29.99);

-- Insert sample reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
('prod-protein-powder', 'customer-user-id', 5, 'Excellent protein powder! Great taste and quality. Highly recommend for anyone serious about fitness.'),
('prod-resistance-bands', 'customer-user-id', 4, 'Good quality bands, perfect for home workouts. The variety of resistance levels is great.');

-- Update usage count for the used offer
UPDATE offers SET usage_count = 1 WHERE code = 'WELCOME10';

COMMIT;

-- Display completion message
SELECT 'Database setup completed successfully! You can now login with:' as message
UNION ALL
SELECT '- Admin: admin@glideon.com / admin123' as message
UNION ALL  
SELECT '- Customer: customer@glideon.com / customer123' as message;