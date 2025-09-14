import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// JWT-only authentication for deployment
// Object storage removed - now using file system upload
import { insertCategorySchema, insertProductSchema, insertProductVariantSchema, insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, insertCmsContentSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { createClient } from '@supabase/supabase-js';
import nodemailer from "nodemailer";
// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const urlSUPER=process.env.SUPABASE_URL||"SUPERURL"
const urlKey= process.env.SUPABASE_ANON_KEY||"SUPERKey"
const supabase = createClient(
  urlSUPER,
  urlKey
)


// Middleware for JWT authentication
const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // JWT authentication check

  if (token) {
    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        // JWT verification failed
        return res.sendStatus(403);
      }
      try {
        const user = await storage.getUser(decoded.userId);
        // JWT authentication successful
        req.user = user;
        next();
      } catch (error) {
        // User lookup failed
        return res.sendStatus(403);
      }
    });
  } else {
    // No JWT token provided
    res.sendStatus(401);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Using JWT authentication only

  // Initialize default content on first run
  try {
    const { migrateExistingBanners } = await import("./migrateExistingBanners");
    const existingSettings = await storage.getSiteSettings();
    const bannersExist = existingSettings.some(s => s.key === 'home_banners');
    const aboutExists = existingSettings.some(s => s.key === 'about_us');
    
    if (!bannersExist || !aboutExists) {
      await migrateExistingBanners();
      console.log('🎌 Default content initialized (banners and about us)');
    }
  } catch (error) {
    console.log('⚠️ Could not initialize default content:', error);
  }

  // Traditional login/register routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'customer'
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // JWT-based user info route
  app.get('/api/auth/user', authenticateJWT, async (req: any, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile management routes
  app.put('/api/profile', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, email, phone } = req.body;
      
      const updatedUser = await storage.updateUserProfile(userId, {
        firstName,
        lastName, 
        email,
        phone
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.put('/api/profile/password', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      // Get current user to verify password
      const user = await storage.getUser(userId);
      if (!user || !user.password) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      await storage.changePassword(userId, hashedPassword);
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  // Address book routes
  app.get('/api/addresses', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const addresses = await storage.getUserAddresses(userId);
      res.json(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      res.status(500).json({ message: "Failed to fetch addresses" });
    }
  });

  app.post('/api/addresses', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const addressData = { ...req.body, userId };
      
      const address = await storage.createAddress(addressData);
      res.status(201).json(address);
    } catch (error) {
      console.error("Error creating address:", error);
      res.status(500).json({ message: "Failed to create address" });
    }
  });

  app.put('/api/addresses/:id', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;
      const addressData = { ...req.body, userId };
      
      const address = await storage.updateAddress(addressId, addressData);
      res.json(address);
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ message: "Failed to update address" });
    }
  });

  app.delete('/api/addresses/:id', authenticateJWT, async (req: any, res) => {
    try {
      const addressId = req.params.id;
      await storage.deleteAddress(addressId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({ message: "Failed to delete address" });
    }
  });

  app.put('/api/addresses/:id/default', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;
      
      await storage.setDefaultAddress(userId, addressId);
      res.json({ message: "Default address set successfully" });
    } catch (error) {
      console.error("Error setting default address:", error);
      res.status(500).json({ message: "Failed to set default address" });
    }
  });

  // Wishlist routes
  app.get('/api/wishlist', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const wishlistItems = await storage.getUserWishlist(userId);
      res.json(wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post('/api/wishlist', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.body;
      
      const wishlistItem = await storage.addToWishlist({ userId, productId });
      res.status(201).json(wishlistItem);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete('/api/wishlist/:productId', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;
      
      await storage.removeFromWishlist(userId, productId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  app.get('/api/wishlist/check/:productId', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;
      
      const isInWishlist = await storage.isInWishlist(userId, productId);
      res.json({ isInWishlist });
    } catch (error) {
      console.error("Error checking wishlist:", error);
      res.status(500).json({ message: "Failed to check wishlist" });
    }
  });

  // JWT Authentication routes only


  // Image upload route - saves to GitHub repository for persistence
  // app.post('/api/upload/images', authenticateJWT, upload.array('images', 10), async (req: any, res) => {
  //   try {
  //     if (req.user?.role !== 'admin') {
  //       return res.status(403).json({ message: "Admin access required" });
  //     }

  //     if (!req.files || req.files.length === 0) {
  //       return res.status(400).json({ message: "No images provided" });
  //     }

  //     // Save to client/public/uploads directory (part of GitHub repository)
  //     const uploadsDir = path.join(process.cwd(), 'client', 'public', 'uploads');
  //     try {
  //       await fs.access(uploadsDir);
  //     } catch (error) {
  //       console.log('Creating uploads directory:', uploadsDir);
  //       await fs.mkdir(uploadsDir, { recursive: true });
  //     }

  //     const imagePaths: string[] = [];

  //     for (const file of req.files) {
  //       // Generate unique filename with timestamp for better organization
  //       const timestamp = Date.now();
  //       const fileExtension = path.extname(file.originalname);
  //       const uniqueFilename = `${timestamp}-${randomUUID()}${fileExtension}`;
  //       const filePath = path.join(uploadsDir, uniqueFilename);
        
  //       console.log('💾 Saving file to GitHub repository:', filePath);
  //       // Save file to repository uploads directory
  //       await fs.writeFile(filePath, file.buffer);
        
  //       // Verify file was saved
  //       const stats = await fs.stat(filePath);
  //       console.log(`✅ File saved successfully - ${stats.size} bytes`);
        
  //       // Return web-accessible path
  //       const webPath = `/uploads/${uniqueFilename}`;
  //       imagePaths.push(webPath);
  //     }

  //     console.log('✅ Upload successful - files saved to GitHub repository:', imagePaths);
  //     console.log('📁 Files will persist across all Render deployments');
  //     res.json({ imagePaths });
  //   } catch (error) {
  //     console.error("Error uploading images:", error);
  //     res.status(500).json({ message: "Failed to upload images", error: error.message });
  //   }
  // });

  // Object storage routes removed - now using file system uploads directly
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_KEY as string
  );
  
  app.post("/api/upload/images",
    authenticateJWT,
    upload.array("images", 10),
    async (req: any, res) => {
      try {
        if (req.user?.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
  
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No images provided" });
        }
  
        const imagePaths: string[] = [];
  
        for (const file of req.files) {
          // unique filename
          const timestamp = Date.now();
          const fileExtension = path.extname(file.originalname);
          const uniqueFilename = `${timestamp}-${randomUUID()}${fileExtension}`;
  
          // upload to Supabase Storage
          const { error } = await supabase.storage
            .from("uploads") // your bucket name
            .upload(uniqueFilename, file.buffer, {
              contentType: file.mimetype,
              upsert: false,
            });
  
          if (error) {
            console.error("❌ Supabase upload error:", error);
            return res.status(500).json({
              message: "Failed to upload image",
              error: error.message,
            });
          }
  
          // construct public URL (works if bucket is public)
          const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${uniqueFilename}`;
          imagePaths.push(publicUrl);
        }
  
        console.log("✅ Upload successful:", imagePaths);
        res.json({ imagePaths });
      } catch (error: any) {
        console.error("Error uploading images:", error);
        res.status(500).json({
          message: "Failed to upload images",
          error: error.message,
        });
      }
    }
  );
  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/categories/high-demand', async (req, res) => {
    try {
      const categories = await storage.getHighDemandCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching high demand categories:", error);
      res.status(500).json({ message: "Failed to fetch high demand categories" });
    }
  });

  app.get('/api/categories/:slug', async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post('/api/categories', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put('/api/categories/:id', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete('/api/categories/:id', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteCategory(req.params.id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { categoryId, featured, limit, fitnessLevel,stock } = req.query;
      const options: any = {};
      
      if (categoryId) options.categoryId = categoryId as string;
      if (featured === 'true') options.featured = true;
      if (limit) options.limit = parseInt(limit as string);
      if (fitnessLevel) options.fitnessLevel = fitnessLevel as string;

      const products = await storage.getProducts(options);
      console.log(products)
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const products = await storage.searchProducts(q as string);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get('/api/products/:identifier', async (req, res) => {
    try {
      const identifier = req.params.identifier;
      let product;
      
      // Use the direct getProductById method which should work better
      product = await storage.getProductById(identifier);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Product Variant routes
  app.get('/api/products/:productId/variants', async (req, res) => {
    try {
      const variants = await storage.getProductVariants(req.params.productId);
      res.json(variants);
    } catch (error) {
      console.error("Error fetching product variants:", error);
      res.status(500).json({ message: "Failed to fetch product variants" });
    }
  });

  app.get('/api/variants/:id', async (req, res) => {
    try {
      const variant = await storage.getVariantById(req.params.id);
      if (!variant) {
        return res.status(404).json({ message: "Variant not found" });
      }
      res.json(variant);
    } catch (error) {
      console.error("Error fetching variant:", error);
      res.status(500).json({ message: "Failed to fetch variant" });
    }
  });

  app.post('/api/products/:productId/variants', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const variantData = insertProductVariantSchema.parse({
        ...req.body,
        productId: req.params.productId
      });
      const variant = await storage.createProductVariant(variantData);
      res.status(201).json(variant);
    } catch (error) {
      console.error("Error creating product variant:", error);
      res.status(500).json({ message: "Failed to create product variant" });
    }
  });

  app.put('/api/variants/:id', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const variantData = insertProductVariantSchema.partial().parse(req.body);
      const variant = await storage.updateProductVariant(req.params.id, variantData);
      res.json(variant);
    } catch (error) {
      console.error("Error updating product variant:", error);
      res.status(500).json({ message: "Failed to update product variant" });
    }
  });

  // Delete all variants for a product
  app.delete('/api/products/:productId/variants', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteProductVariants(req.params.productId);
      res.json({ message: "Product variants deleted successfully" });
    } catch (error) {
      console.error("Error deleting product variants:", error);
      res.status(500).json({ message: "Failed to delete product variants" });
    }
  });

  app.delete('/api/variants/:id', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteProductVariant(req.params.id);
      res.json({ message: "Product variant deleted successfully" });
    } catch (error) {
      console.error("Error deleting product variant:", error);
      res.status(500).json({ message: "Failed to delete product variant" });
    }
  });

  // Cart routes
  app.get('/api/cart', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const cartItems = await storage.getCartItemsWithVariants(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', authenticateJWT, async (req: any, res) => {
    try {
      console.log("Cart POST request - User ID:", req.user?.id, "Body:", req.body);
      const userId = req.user.id;
      const cartItemData = insertCartItemSchema.parse({ ...req.body, userId });
      console.log("Parsed cart data:", cartItemData);
      const cartItem = await storage.addToCart(cartItemData);
      console.log("Cart item added successfully:", cartItem.id);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      console.error("Error details:", error.message || error);
      res.status(500).json({ message: "Failed to add to cart", error: error.message });
    }
  });

  app.put('/api/cart/:id', authenticateJWT, async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete('/api/cart/:id', authenticateJWT, async (req, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Order routes
  app.get('/api/orders', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
     
      const user = await storage.getUser(userId);
      
      if (user?.role === 'admin') {
        const orders = await storage.getOrders();
        res.json(orders);
      } else {
        const orders = await storage.getOrders(userId);
        console.log(JSON.stringify(orders))
      
        res.json(orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:orderId', authenticateJWT, async (req: any, res) => {
    try {
      const orderId = req.params.orderId;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if user owns the order or is admin
      if (user?.role !== 'admin' && order.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.get('/api/orders/:orderId/items', authenticateJWT, async (req: any, res) => {
    try {
      const orderId = req.params.orderId;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      // First check if user has access to this order
      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      if (user?.role !== 'admin' && order.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const orderItems = await storage.getOrderItemsWithVariants(orderId);
      res.json(orderItems);
    } catch (error) {
      console.error("Error fetching order items:", error);
      res.status(500).json({ message: "Failed to fetch order items" });
    }
  });

  // Admin orders route
  app.get('/api/admin/orders', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Admin dashboard stats
  app.get('/api/admin/dashboard', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      const orders = await storage.getOrders();
      const products = await storage.getProducts();
      
      // Calculate stats
      const totalUsers = users.filter(u => u.role !== 'admin').length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const shippedOrders = orders.filter(o => o.status === 'shipped').length;
      const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
      const refundedOrders = orders.filter(o => o.status === 'refunded').length;
      
      const lowStockProducts = products.filter(p => (p.stock || 0) < 10);
      const recentOrders = orders.slice(0, 10);
      const recentUsers = users.filter(u => u.role !== 'admin').slice(0, 10);

      const dashboardStats = {
        totalUsers,
        totalOrders,
        totalRevenue,
        pendingOrders,
        shippedOrders,
        completedOrders,
        refundedOrders,
        lowStockProducts,
        bestSellingProducts: products.slice(0, 5), // Simplified
        recentOrders,
        recentUsers,
        salesData: {
          daily: [],
          weekly: [],
          monthly: []
        }
      };

      res.json(dashboardStats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Admin users management
  app.get('/api/admin/users', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      const orders = await storage.getOrders();
      
      // Add user stats
      const usersWithStats = users.map(user => {
        const userOrders = orders.filter(o => o.userId === user.id);
        return {
          ...user,
          totalOrders: userOrders.length,
          totalSpent: userOrders.reduce((sum, order) => sum + parseFloat(order.total), 0),
          lastOrderDate: userOrders.length > 0 ? userOrders[0].createdAt : undefined
        };
      });

      res.json(usersWithStats);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/users/:userId/orders', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const orders = await storage.getOrders(req.params.userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  app.put('/api/admin/users/:userId/status', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { isActive } = req.body;
      const user = await storage.updateUserStatus(req.params.userId, isActive);
      res.json(user);
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  app.post('/api/orders', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Get current cart items with variants before creating order
      const cartItems = await storage.getCartItemsWithVariants(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      const orderData = insertOrderSchema.parse({ ...req.body, userId });
      const order = await storage.createOrder(orderData);
      
      // Create order items from cart items (including variant information)
      for (const cartItem of cartItems) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: cartItem.productId,
          variantId: cartItem.variantId,
          quantity: cartItem.quantity,
          price: cartItem.variant?.price || cartItem.product?.price || "0",
        });
      }
      
      // Clear cart after successful order
      await storage.clearCart(userId);
          // format items into text
          const itemsHtml = req.body.cartItems.map((item: any, idx: number) => {
            return `
              <tr>
                <td style="padding:8px; border:1px solid #ddd;">${idx + 1}</td>
                <td style="padding:8px; border:1px solid #ddd;">${item.productName}</td>
                <td style="padding:8px; border:1px solid #ddd;">
                  ${item.variant?.size || ""} ${item.variant?.unit || ""} ${item.variant?.flavor || ""}
                </td>
                <td style="padding:8px; border:1px solid #ddd; text-align:center;">${item.quantity}</td>
                <td style="padding:8px; border:1px solid #ddd; text-align:right;">${item.price}</td>
              </tr>
            `;
          }).join("");
          
          const shipping = req.body.shippingAddress;
          
          const htmlContent = `
            <div style="background:#f9f9f9; padding:20px; font-family:Arial, sans-serif; color:#333;">
              <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background:#E5B806; padding:20px; text-align:center;">
                  <h1 style="margin:0; color:#fff;">🎉 Order Confirmed!</h1>
                </div>
          
                <!-- Body -->
                <div style="padding:20px;">
                  <p style="font-size:16px;">Hi <b>${req.user.name || "Customer"}</b>,</p>
                  <p style="font-size:15px;">
                    Thank you for your purchase! Your order has been placed successfully and is now being processed.
                  </p>
          
                  <h3 style="color:#E5B806;">Order Summary</h3>
                  <p><b>Order ID:</b> ${order.id}</p>
                  <p><b>Payment Method:</b> ${req.body.paymentMethod}</p>
                  <p><b>Status:</b> ${req.body.status}</p>
          
                  <!-- Shipping -->
                  <h3 style="color:#E5B806;">Shipping Address</h3>
                  <p style="font-size:14px; line-height:1.5;">
                    ${shipping.street}, <br/>
                    ${shipping.city}, ${shipping.state} - ${shipping.zipCode}, <br/>
                    ${shipping.country}
                  </p>
          
                  <!-- Items Table -->
                  <h3 style="color:#E5B806;">Items</h3>
                  <table style="width:100%; border-collapse:collapse; font-size:14px;">
                    <thead>
                      <tr style="background:#f1f1f1;">
                        <th style="padding:8px; border:1px solid #ddd;">#</th>
                        <th style="padding:8px; border:1px solid #ddd;">Product</th>
                        <th style="padding:8px; border:1px solid #ddd;">Variant</th>
                        <th style="padding:8px; border:1px solid #ddd;">Qty</th>
                        <th style="padding:8px; border:1px solid #ddd;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>
          
                  <!-- Total -->
                  <div style="margin-top:20px; font-size:16px;">
                    <p><b>Total:</b> <span style="color:#E5B806; font-weight:bold;">${req.body.total}</span></p>
                  </div>
          
                  <p style="margin-top:30px; font-size:14px; color:#555;">
                    We’ll notify you once your items are shipped.  
                    Thank you for shopping with us! 💖
                  </p>
                </div>
          
                <!-- Footer -->
                <div style="background:#333; color:#fff; text-align:center; padding:15px; font-size:12px;">
                  &copy; ${new Date().getFullYear()} Glideon Store. All rights reserved.
                </div>
              </div>
            </div>
          `;
          
      const transporter = nodemailer.createTransport({
        service: 'gmail', // You can replace this with your email service provider
        auth: {
          user: 'sachdevamannji@gmail.com', // Your email address
          pass: 'bwehltlfcquiqgyn'   // Your email password (or app-specific password)
        }
      });
      const mailOptions = {
        from: 'sachdevamannji@gmail.com',
        to: req.user.email, // The recipient's email address (where you want to send the contact info)
        subject: 'Order Places Successfully',
        cc:'sachdevamannji@gmail.com',
        bcc:'bankush28@gmail.com',          
        html: htmlContent, 
            };
   
     transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
        if (error) {
          console.error('Error sending email:', error);
          // Send back the response even if email fails
          return res.status(500).json({ success: false, message: 'Failed to send email notification' });
        }
        console.log('Email sent:', info.response);
        res.status(201).json(order);
      });
     
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // CMS routes
  app.get('/api/cms', async (req, res) => {
    try {
      const content = await storage.getCmsContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching CMS content:", error);
      res.status(500).json({ message: "Failed to fetch CMS content" });
    }
  });

  app.post('/api/cms', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const contentData = insertCmsContentSchema.parse(req.body);
      const content = await storage.upsertCmsContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating CMS content:", error);
      res.status(500).json({ message: "Failed to create CMS content" });
    }
  });

  app.put('/api/cms', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const contentData = insertCmsContentSchema.parse(req.body);
      const content = await storage.upsertCmsContent(contentData);
      res.json(content);
    } catch (error) {
      console.error("Error updating CMS content:", error);
      res.status(500).json({ message: "Failed to update CMS content" });
    }
  });



  // Review routes
  app.get('/api/reviews', async (req, res) => {
    try {
      const { productId } = req.query;
      const reviews = await storage.getReviews(productId as string);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id; // Using JWT user format
      const reviewData = insertReviewSchema.parse({ ...req.body, userId });
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Offers management routes
  app.get('/api/offers', async (req, res) => {
    try {
      const offers = await storage.getOffers();
      res.json(offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  app.post('/api/offers', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const offer = await storage.createOffer(req.body);
      res.status(201).json(offer);
    } catch (error) {
      console.error("Error creating offer:", error);
      res.status(500).json({ message: "Failed to create offer" });
    }
  });

  app.put('/api/offers/:id', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const offer = await storage.updateOffer(req.params.id, req.body);
      res.json(offer);
    } catch (error) {
      console.error("Error updating offer:", error);
      res.status(500).json({ message: "Failed to update offer" });
    }
  });

  app.delete('/api/offers/:id', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      await storage.deleteOffer(req.params.id);
      res.json({ message: "Offer deleted successfully" });
    } catch (error) {
      console.error("Error deleting offer:", error);
      res.status(500).json({ message: "Failed to delete offer" });
    }
  });

  // Offer code validation for checkout
  app.post('/api/validate-offer-code', async (req, res) => {
    try {
      const { code, cartTotal, userId } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "Offer code is required" });
      }

      const offer = await storage.getOfferByCode(code.toUpperCase());
      
      if (!offer) {
        return res.status(404).json({ message: "Invalid offer code" });
      }

      // Check if offer is active
      if (!offer.isActive) {
        return res.status(400).json({ message: "This offer is no longer active" });
      }

      // Check date validity
      const now = new Date();
      if (offer.startDate && new Date(offer.startDate) > now) {
        return res.status(400).json({ message: "This offer is not yet active" });
      }
      if (offer.endDate && new Date(offer.endDate) < now) {
        return res.status(400).json({ message: "This offer has expired" });
      }

      // Check usage limits
      if (offer.maxUses && offer.currentUses >= offer.maxUses) {
        return res.status(400).json({ message: "This offer has reached its usage limit" });
      }

      // Check minimum order amount
      if (offer.minOrderAmount && cartTotal < parseFloat(offer.minOrderAmount)) {
        return res.status(400).json({ 
          message: `Minimum order amount of ₹${parseFloat(offer.minOrderAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} required` 
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (offer.discountType === 'percentage') {
        discountAmount = (cartTotal * parseFloat(offer.discountValue)) / 100;
      } else if (offer.discountType === 'fixed') {
        discountAmount = parseFloat(offer.discountValue);
      }

      // Ensure discount doesn't exceed cart total
      discountAmount = Math.min(discountAmount, cartTotal);

      res.json({
        valid: true,
        offer: {
          id: offer.id,
          code: offer.code,
          title: offer.title,
          discountType: offer.discountType,
          discountValue: offer.discountValue,
        },
        discountAmount,
        finalTotal: cartTotal - discountAmount,
      });
    } catch (error) {
      console.error("Error validating offer code:", error);
      res.status(500).json({ message: "Failed to validate offer code" });
    }
  });

  // Apply offer code (increment usage count)
  app.post('/api/apply-offer-code', async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "Offer code is required" });
      }

      await storage.incrementOfferUsage(code.toUpperCase());
      res.json({ message: "Offer code applied successfully" });
    } catch (error) {
      console.error("Error applying offer code:", error);
      res.status(500).json({ message: "Failed to apply offer code" });
    }
  });

  // Legacy Offer Code routes (maintain backward compatibility)
  app.get('/api/offer-codes', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const offerCodes = await storage.getOfferCodes();
      res.json(offerCodes);
    } catch (error) {
      console.error('Error fetching offer codes:', error);
      res.status(500).json({ message: 'Failed to fetch offer codes' });
    }
  });

  app.post('/api/offer-codes', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const offerCode = await storage.createOfferCode(req.body);
      res.status(201).json(offerCode);
    } catch (error) {
      console.error('Error creating offer code:', error);
      res.status(500).json({ message: 'Failed to create offer code' });
    }
  });

  app.put('/api/offer-codes/:id', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const offerCode = await storage.updateOfferCode(req.params.id, req.body);
      res.json(offerCode);
    } catch (error) {
      console.error('Error updating offer code:', error);
      res.status(500).json({ message: 'Failed to update offer code' });
    }
  });

  app.delete('/api/offer-codes/:id', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      await storage.deleteOfferCode(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting offer code:', error);
      res.status(500).json({ message: 'Failed to delete offer code' });
    }
  });

  // Site Settings routes
  app.get('/api/site-settings', async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      res.status(500).json({ message: 'Failed to fetch site settings' });
    }
  });

  app.post('/api/site-settings', authenticateJWT, async (req: any, res) => {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const setting = await storage.upsertSiteSetting(req.body);
      res.status(201).json(setting);
    } catch (error) {
      console.error('Error creating site setting:', error);
      res.status(500).json({ message: 'Failed to create site setting' });
    }
  });

  // Object Storage routes for file uploads
  // Public objects route removed - now using file system upload

  // Object storage upload route removed - now using file system upload

  // Banner image route removed - now using file system upload

  const httpServer = createServer(app);
  return httpServer;
}
