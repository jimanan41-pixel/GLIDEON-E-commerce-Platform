// Migration script to add existing hero slides to banner management system
import { storage } from "./storage";

const existingBanners = [
  {
    id: "banner-1",
    title: "Transform Your FITNESS Journey",
    subtitle: "Discover premium supplements, equipment, and health products designed to fuel your performance and elevate your results.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080",
    buttonText: "Shop Now",
    buttonUrl: "/products",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "banner-2",
    title: "Premium SUPPLEMENTS & Nutrition",
    subtitle: "Scientifically formulated supplements to maximize your gains and accelerate recovery. Trusted by athletes worldwide.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080",
    buttonText: "Explore Supplements",
    buttonUrl: "/products?category=supplements",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "banner-3",
    title: "Professional EQUIPMENT & Gear",
    subtitle: "From home gyms to professional setups, we have everything you need to reach your fitness goals.",
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080",
    buttonText: "View Equipment",
    buttonUrl: "/products?category=equipment",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const defaultAboutContent = {
  title: "About GLIDEON",
  content: "GLIDEON is your premier destination for health and fitness products. We provide high-quality supplements, equipment, and wellness solutions to help you achieve your fitness goals. Our commitment to excellence drives everything we do, from product selection to customer service.",
  mission: "To empower individuals on their fitness journey by providing premium products and expert guidance that deliver real results.",
  vision: "To become the leading platform for health and fitness enthusiasts worldwide, inspiring healthier lifestyles through innovative solutions.",
  values: "Quality, Innovation, Customer Success, Integrity, and Wellness"
};

export async function migrateExistingBanners() {
  try {
    // Create the banners site setting with existing banners
    await storage.upsertSiteSetting({
      key: 'home_banners',
      value: JSON.stringify(existingBanners),
      type: 'json',
      category: 'banner',
      description: 'Homepage banners list migrated from hero slides'
    });

    // Create default About Us content
    await storage.upsertSiteSetting({
      key: 'about_us',
      value: JSON.stringify(defaultAboutContent),
      type: 'json',
      category: 'content',
      description: 'About Us page content'
    });
    
    console.log('✅ Successfully migrated existing banners and created default About Us content');
    return existingBanners;
  } catch (error) {
    console.error('❌ Error migrating existing content:', error);
    throw error;
  }
}