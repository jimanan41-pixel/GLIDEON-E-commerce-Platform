import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/contexts/CartContext";

interface SiteSetting {
  key: string;
  value: string;
  type: string;
  category: string;
}

interface LogoSettings {
  logoUrl: string;
  faviconUrl: string;
  brandName: string;
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { getCartItemCount, setIsCartOpen } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch site settings for logo
  const { data: siteSettings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
  });

  // Get logo settings from database
  const getLogoSettings = (): LogoSettings => {
    const logoData = siteSettings?.find(s => s.key === 'site_logo');
    const defaultLogo = {
      logoUrl: "",
      faviconUrl: "",
      brandName: "GLIDEON"
    };

    if (!logoData) return defaultLogo;
    
    try {
      const parsed = JSON.parse(logoData.value || '{}');
      
      // Convert Google Cloud Storage URLs to local object URLs
      if (parsed.logoUrl && parsed.logoUrl.includes('storage.googleapis.com')) {
        // Extract the file path from the Google Cloud Storage URL
        const matches = parsed.logoUrl.match(/\.private\/uploads\/([^?]+)/);
        if (matches) {
          parsed.logoUrl = `/objects/uploads/${matches[1]}`;
        }
      }
      
      return { ...defaultLogo, ...parsed };
    } catch (error) {
      console.error('Error parsing logo settings:', error);
      return defaultLogo;
    }
  };

  const logoSettings = getLogoSettings();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "All Products" },
    { href: "/about", label: "About" },
   
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              {logoSettings.logoUrl ? (
                <img 
                  src={logoSettings.logoUrl} 
                  alt={logoSettings.brandName || "GLIDEON"} 
                  className="h-8 w-auto max-w-[200px] object-contain" 
                  data-testid="logo-image"
                  onError={(e) => {
                    console.error('Logo failed to load:', logoSettings.logoUrl);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    // Show brand name fallback
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.textContent = logoSettings.brandName || "GLIDEON";
                      fallback.className = "text-2xl font-bold text-glideon-red tracking-wider";
                      fallback.setAttribute('data-testid', 'logo-text-fallback');
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span className="text-2xl font-bold text-glideon-red tracking-wider" data-testid="logo-text">
                  {logoSettings.brandName || "GLIDEON"}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-10 md:flex space-x-8 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-gray-700 dark:text-gray-300 hover:text-glideon-red dark:hover:text-glideon-red transition-colors duration-200 ${
                    location === item.href ? "text-glideon-red" : ""
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="fnt15 text-gray-700 :text-gray-300 hover:text-glideon-red :hover:text-glideon-red transition-colors duration-200 p-0 h-auto font-normal"
                    data-testid="nav-categories-dropdown"
                  >
                    Categories <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/products" 
                      className="w-full cursor-pointer"
                      data-testid="nav-all-categories"
                    >
                      All Categories
                    </Link>
                  </DropdownMenuItem>
                  {categories?.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link 
                        href={`/products?category=${category.slug}`}
                        className="w-full cursor-pointer"
                        data-testid={`nav-category-${category.slug}`}
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-glideon-red focus:border-glideon-red"
                data-testid="search-input"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:text-glideon-red"
                data-testid="search-button"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 hover:text-glideon-red"
              data-testid="theme-toggle"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-glideon-red"
              data-testid="cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-glideon-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-count">
                  {getCartItemCount()}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="fnt15 flex items-center space-x-2 hover:text-glideon-red" data-testid="user-profile">
                    <User className="h-5 w-5" />
                    <span className="hidden md:block">
                      {user?.firstName || "Profile"}
                    </span>
                  </Button>
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="fnt15 hidden md:block hover:text-glideon-red" data-testid="admin-panel">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('authToken');
                    window.location.href = "/";
                  }}
                  className="fnt15 hidden md:block hover:text-glideon-red"
                  data-testid="logout-button"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="fnt13 flex items-center space-x-2 hover:text-glideon-red"
                  data-testid="login-button"
                >
                  <User className="h-5 w-5" />
                  <span className="fnt15 hidden md:block">Sign In</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="hidden md:block bgnone border-glideon-red text-glideon-red hover:  hover:text-white"
                  data-testid="register-button"
                >
                  Sign Up
                </Button>
               
                 
              </div>
            )}
 <a  className="items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:bg-accent h-9 rounded-md px-3 hidden md:block bgnone border-glideon-red text-glideon-red hover: hover:text-white" href="https://verify.glideonhealth.com/" target="_blank" style={{lineHeight:'31px'}}>Verify</a>
            {/* Mobile Menu Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2" data-testid="mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className=" fnt15 block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-glideon-red hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                      data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Mobile Categories */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                    <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Categories
                    </p>
                    <Link
                      href="/products"
                      className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-glideon-red hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                      data-testid="mobile-nav-all-categories"
                    >
                      All Categories
                    </Link>
                    {categories?.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-glideon-red hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                        data-testid={`mobile-nav-category-${category.slug}`}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                      data-testid="mobile-search-input"
                    />
                  </form>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
