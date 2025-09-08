import {
  users,
  categories,
  products,
  productVariants,
  cartItems,
  orders,
  orderItems,
  cmsContent,
  reviews,
  offerCodes,
  offers,
  addresses,
  wishlist,
  siteSettings,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductVariant,
  type InsertProductVariant,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CmsContent,
  type InsertCmsContent,
  type Review,
  type InsertReview,
  type OfferCode,
  type InsertOfferCode,
  type Offer,
  type InsertOffer,
  type Address,
  type InsertAddress,
  type WishlistItem,
  type InsertWishlistItem,
  type SiteSetting,
  type InsertSiteSetting,
} from "@shared/schema";
import "dotenv/config";
import { db } from "./db";
import { eq, and, desc, like, ilike, sql, isNull } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: any): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, profileData: Partial<User>): Promise<User>;
  updateUserStatus(id: string, isActive: boolean): Promise<User>;
  changePassword(id: string, newPasswordHash: string): Promise<void>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  
  // Product operations
  getProducts(options?: { categoryId?: string; featured?: boolean; limit?: number; id?: string; fitnessLevel?: string }): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Product Variant operations
  getProductVariants(productId: string): Promise<ProductVariant[]>;
  getVariantById(id: string): Promise<ProductVariant | undefined>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  updateProductVariant(id: string, variant: Partial<InsertProductVariant>): Promise<ProductVariant>;
  deleteProductVariant(id: string): Promise<void>;
  getVariantsByProduct(productId: string): Promise<ProductVariant[]>;
  
  // Cart operations
  getCartItems(userId: string): Promise<CartItem[]>;
  getCartItemsWithVariants(userId: string): Promise<(CartItem & { variant?: ProductVariant; product?: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Order operations
  getOrders(userId?: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // CMS operations
  getCmsContent(): Promise<CmsContent[]>;
  getCmsContentByKey(key: string): Promise<CmsContent | undefined>;
  upsertCmsContent(content: InsertCmsContent): Promise<CmsContent>;
  
  // Review operations
  getReviews(productId?: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, review: Partial<InsertReview>): Promise<Review>;
  deleteReview(id: string): Promise<void>;
  
  // Offers operations (unified system for checkout integration)
  getOffers(): Promise<Offer[]>;
  getOfferByCode(code: string): Promise<Offer | undefined>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  updateOffer(id: string, offer: Partial<InsertOffer>): Promise<Offer>;
  deleteOffer(id: string): Promise<void>;
  incrementOfferUsage(code: string): Promise<void>;

  // Legacy Offer Code operations
  getOfferCodes(): Promise<OfferCode[]>;
  getOfferCodeByCode(code: string): Promise<OfferCode | undefined>;
  createOfferCode(offerCode: InsertOfferCode): Promise<OfferCode>;
  updateOfferCode(id: string, offerCode: Partial<InsertOfferCode>): Promise<OfferCode>;
  deleteOfferCode(id: string): Promise<void>;
  
  // Address operations
  getUserAddresses(userId: string): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: string, address: Partial<InsertAddress>): Promise<Address>;
  deleteAddress(id: string): Promise<void>;
  setDefaultAddress(userId: string, addressId: string): Promise<void>;

  // Wishlist operations
  getUserWishlist(userId: string): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: string, productId: string): Promise<void>;
  isInWishlist(userId: string, productId: string): Promise<boolean>;

  // Site Settings operations
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingByKey(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  deleteSiteSetting(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserProfile(id: string, profileData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async changePassword(id: string, newPasswordHash: string): Promise<void> {
    await db
      .update(users)
      .set({ password: newPasswordHash, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.name);
  }

  async getHighDemandCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(and(eq(categories.isActive, true), eq(categories.isHighDemand, true))).orderBy(categories.name);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(and(eq(categories.slug, slug), eq(categories.isActive, true)));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
  }

  // Product operations
  async getProducts(options: { categoryId?: string; featured?: boolean; limit?: number; id?: string; fitnessLevel?: string } = {}): Promise<Product[]> {
    const conditions = [eq(products.isActive, true)];
    
    if (options.id) {
      conditions.push(eq(products.id, options.id));
    }
    
    if (options.categoryId) {
      conditions.push(eq(products.categoryId, options.categoryId));
    }
    
    if (options.featured) {
      conditions.push(eq(products.isFeatured, true));
    }
    
    if (options.fitnessLevel) {
      if (options.fitnessLevel === 'none') {
        // Show only products with no specific fitness level (null)
        conditions.push(isNull(products.fitnessLevel));
      } else {
        // Show only products with exact fitness level match
        conditions.push(eq(products.fitnessLevel, options.fitnessLevel));
      }
    }
    
    const baseQuery = db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt));
    
    if (options.limit) {
      return await baseQuery.limit(options.limit);
    }
    
    return await baseQuery;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(and(eq(products.slug, slug), eq(products.isActive, true)));
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          ilike(products.name, `%${query}%`)
        )
      )
      .orderBy(products.name);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product as any).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const updateData = { ...product, updatedAt: new Date() };
    const [updatedProduct] = await db
      .update(products)
      .set(updateData as any)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  // Product Variant operations
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    return await db.select().from(productVariants).where(and(eq(productVariants.productId, productId), eq(productVariants.isActive, true))).orderBy(productVariants.size, productVariants.flavor);
  }

  async getVariantById(id: string): Promise<ProductVariant | undefined> {
    const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, id));
    return variant;
  }

  async createProductVariant(variant: InsertProductVariant): Promise<ProductVariant> {
    const [newVariant] = await db.insert(productVariants).values(variant).returning();
    return newVariant;
  }

  async updateProductVariant(id: string, variant: Partial<InsertProductVariant>): Promise<ProductVariant> {
    const [updatedVariant] = await db
      .update(productVariants)
      .set({ ...variant, updatedAt: new Date() } as any)
      .where(eq(productVariants.id, id))
      .returning();
    return updatedVariant;
  }

  async deleteProductVariant(id: string): Promise<void> {
    await db.update(productVariants).set({ isActive: false }).where(eq(productVariants.id, id));
  }

  async getVariantsByProduct(productId: string): Promise<ProductVariant[]> {
    return await db.select().from(productVariants).where(and(eq(productVariants.productId, productId), eq(productVariants.isActive, true))).orderBy(productVariants.size, productVariants.flavor);
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async getCartItemsWithVariants(userId: string): Promise<(CartItem & { variant?: ProductVariant; product?: Product })[]> {
    const result = await db
      .select({
        cartItem: cartItems,
        variant: productVariants,
        product: products,
      })
      .from(cartItems)
      .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    return result.map(row => ({
      ...row.cartItem,
      variant: row.variant || undefined,
      product: row.product || undefined,
    }));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart (considering both product and variant)
    const conditions = [
      eq(cartItems.userId, cartItem.userId),
      eq(cartItems.productId, cartItem.productId)
    ];

    // Add variant condition if provided
    if (cartItem.variantId) {
      conditions.push(eq(cartItems.variantId, cartItem.variantId));
    } else {
      // If no variant provided, look for items without variants
      conditions.push(sql`${cartItems.variantId} IS NULL`);
    }

    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(and(...conditions));

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: (existingItem.quantity || 0) + (cartItem.quantity || 1), updatedAt: new Date() })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Create new cart item
      const [newItem] = await db.insert(cartItems).values(cartItem).returning();
      return newItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Order operations
  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    } else {
      return await db.select().from(orders).orderBy(desc(orders.createdAt));
    }
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // CMS operations
  async getCmsContent(): Promise<CmsContent[]> {
    return await db.select().from(cmsContent).where(eq(cmsContent.isActive, true));
  }

  async getCmsContentByKey(key: string): Promise<CmsContent | undefined> {
    const [content] = await db.select().from(cmsContent).where(and(eq(cmsContent.key, key), eq(cmsContent.isActive, true)));
    return content;
  }

  async upsertCmsContent(content: InsertCmsContent): Promise<CmsContent> {
    const [upsertedContent] = await db
      .insert(cmsContent)
      .values(content)
      .onConflictDoUpdate({
        target: cmsContent.key,
        set: {
          ...content,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedContent;
  }

  // Review operations
  async getReviews(productId?: string): Promise<Review[]> {
    if (productId) {
      return await db.select().from(reviews).where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true))).orderBy(desc(reviews.createdAt));
    } else {
      return await db.select().from(reviews).where(eq(reviews.isApproved, true)).orderBy(desc(reviews.createdAt));
    }
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async updateReview(id: string, review: Partial<InsertReview>): Promise<Review> {
    const [updatedReview] = await db
      .update(reviews)
      .set({ ...review, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return updatedReview;
  }

  async deleteReview(id: string): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // Offer Code operations
  async getOfferCodes(): Promise<OfferCode[]> {
    return await db.select().from(offerCodes).orderBy(desc(offerCodes.createdAt));
  }

  async getOfferCodeByCode(code: string): Promise<OfferCode | undefined> {
    const [offerCode] = await db.select().from(offerCodes).where(eq(offerCodes.code, code));
    return offerCode;
  }

  async createOfferCode(offerCode: InsertOfferCode): Promise<OfferCode> {
    const [newOfferCode] = await db.insert(offerCodes).values(offerCode).returning();
    return newOfferCode;
  }

  async updateOfferCode(id: string, offerCode: Partial<InsertOfferCode>): Promise<OfferCode> {
    const [updatedOfferCode] = await db
      .update(offerCodes)
      .set({ ...offerCode, updatedAt: new Date() })
      .where(eq(offerCodes.id, id))
      .returning();
    return updatedOfferCode;
  }

  async deleteOfferCode(id: string): Promise<void> {
    await db.delete(offerCodes).where(eq(offerCodes.id, id));
  }

  // Site Settings operations
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings).orderBy(siteSettings.category, siteSettings.key);
  }

  async getSiteSettingByKey(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [upsertedSetting] = await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          ...setting,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedSetting;
  }

  async deleteSiteSetting(id: string): Promise<void> {
    await db.delete(siteSettings).where(eq(siteSettings.id, id));
  }

  // Offers operations (unified system for checkout integration)
  async getOffers(): Promise<Offer[]> {
    const result = await db.select().from(offers).orderBy(desc(offers.createdAt));
    return result;
  }

  async getOfferByCode(code: string): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.code, code.toUpperCase()));
    return offer;
  }

  async createOffer(offerData: InsertOffer): Promise<Offer> {
    const [offer] = await db
      .insert(offers)
      .values({
        ...offerData,
        code: offerData.code?.toUpperCase(), // Ensure codes are always uppercase
      })
      .returning();
    return offer;
  }

  async updateOffer(id: string, offerData: Partial<InsertOffer>): Promise<Offer> {
    const [offer] = await db
      .update(offers)
      .set({ 
        ...offerData, 
        code: offerData.code?.toUpperCase(), // Ensure codes are always uppercase
        updatedAt: new Date() 
      })
      .where(eq(offers.id, id))
      .returning();
    return offer;
  }

  async deleteOffer(id: string): Promise<void> {
    await db.delete(offers).where(eq(offers.id, id));
  }

  async incrementOfferUsage(code: string): Promise<void> {
    await db
      .update(offers)
      .set({ 
        currentUses: sql`${offers.currentUses} + 1`,
        updatedAt: new Date() 
      })
      .where(eq(offers.code, code.toUpperCase()));
  }

  // Address operations
  async getUserAddresses(userId: string): Promise<Address[]> {
    return await db.select().from(addresses).where(eq(addresses.userId, userId)).orderBy(desc(addresses.isDefault), desc(addresses.createdAt));
  }

  async createAddress(addressData: InsertAddress): Promise<Address> {
    // If this is set as default, unset other defaults first
    if (addressData.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, addressData.userId));
    }

    const [address] = await db
      .insert(addresses)
      .values(addressData)
      .returning();
    return address;
  }

  async updateAddress(id: string, addressData: Partial<InsertAddress>): Promise<Address> {
    // If this is set as default, unset other defaults first
    if (addressData.isDefault && addressData.userId) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, addressData.userId));
    }

    const [address] = await db
      .update(addresses)
      .set({ ...addressData, updatedAt: new Date() })
      .where(eq(addresses.id, id))
      .returning();
    return address;
  }

  async deleteAddress(id: string): Promise<void> {
    await db.delete(addresses).where(eq(addresses.id, id));
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    // Unset all defaults for this user
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId));

    // Set the specified address as default
    await db
      .update(addresses)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
  }

  // Wishlist operations
  async getUserWishlist(userId: string): Promise<WishlistItem[]> {
    return await db.select().from(wishlist).where(eq(wishlist.userId, userId)).orderBy(desc(wishlist.createdAt));
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const [wishlistItem] = await db
      .insert(wishlist)
      .values(item)
      .returning();
    return wishlistItem;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await db
      .delete(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const [item] = await db
      .select()
      .from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
    return !!item;
  }
}

export const storage = new DatabaseStorage();
