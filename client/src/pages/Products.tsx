import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import type { Product, Category } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    const category = params.get("category");
    const fitnessLevel = params.get("fitnessLevel");
    
    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
    if (fitnessLevel) setSelectedFitnessLevel(fitnessLevel);
  }, [location]);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory, selectedFitnessLevel, searchQuery],
    enabled: !!categories,
    queryFn: async () => {
      let url = "/api/products";
      const params = new URLSearchParams();
      
      if (selectedCategory && selectedCategory !== "all") {
        const category = categories?.find(c => c.slug === selectedCategory);
        if (category) params.append("categoryId", category.id);
      }
      
      if (selectedFitnessLevel && selectedFitnessLevel !== "all") {
        params.append("fitnessLevel", selectedFitnessLevel);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log("Products page - Fetching with URL:", url);
      
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error("Failed to fetch products");
      let data = await response.json();
      console.log("Products page - Received:", data.length, "products");
      
      // Client-side search filtering
      if (searchQuery) {
        data = data.filter((product: Product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Client-side sorting
      data.sort((a: Product, b: Product) => {
        switch (sortBy) {
          case "price-low":
            return parseFloat(a.salePrice || a.price) - parseFloat(b.salePrice || b.price);
          case "price-high":
            return parseFloat(b.salePrice || b.price) - parseFloat(a.salePrice || a.price);
          case "name":
          default:
            return a.name.localeCompare(b.name);
        }
      });
      
      return data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedFitnessLevel && selectedFitnessLevel !== "all") params.set("fitnessLevel", selectedFitnessLevel);
    
    const newUrl = params.toString() ? `/products?${params.toString()}` : "/products";
    window.history.pushState({}, "", newUrl);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedFitnessLevel("all");
    setSortBy("name");
    window.history.pushState({}, "", "/products");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" data-testid="products-title">
            Products
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300" data-testid="products-description">
            Discover our complete range of health and fitness products
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                data-testid="products-search"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                data-testid="products-search-button"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Fitness Level Filter */}
            <Select value={selectedFitnessLevel} onValueChange={setSelectedFitnessLevel}>
              <SelectTrigger data-testid="fitness-level-filter">
                <SelectValue placeholder="All Fitness Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fitness Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="none">No Specific Level</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger data-testid="sort-filter">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center space-x-2"
              data-testid="clear-filters"
            >
              <Filter className="h-4 w-4" />
              <span>Clear Filters</span>
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600 dark:text-gray-300" data-testid="products-count">
              Showing {products.length} products
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4" data-testid="no-products">
              No products found matching your criteria.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-glideon-red hover:bg-red-700 text-white"
              data-testid="no-products-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <CartModal />
    </div>
  );
}
