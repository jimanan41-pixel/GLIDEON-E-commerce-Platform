import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

const FITNESS_LEVELS = [
  { value: "beginner", label: "Beginner", description: "Perfect for those starting their fitness journey" },
  { value: "intermediate", label: "Intermediate", description: "For those with some fitness experience" },
  { value: "advanced", label: "Advanced", description: "For experienced fitness enthusiasts" },
  { value: "professional", label: "Professional", description: "For athletes and fitness professionals" },
  { value: "none", label: "No Specific Level", description: "Suitable for all fitness levels" }
];

export default function FitnessLevels() {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string>("beginner");

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products", "fitness-filter", selectedLevel],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedLevel && selectedLevel !== "all") {
        params.append("fitnessLevel", selectedLevel);
      }
      
      const url = params.toString() ? `/api/products?${params.toString()}` : "/api/products";
      console.log("FitnessLevels - Fetching products with URL:", url);
      
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      console.log("FitnessLevels - Products received:", data.length, "products");
      return data;
    },
  });

  const selectedLevelInfo = FITNESS_LEVELS.find(level => level.value === selectedLevel);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shop by Fitness Level</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Find products tailored to your fitness experience and goals
        </p>

        {/* Fitness Level Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {FITNESS_LEVELS.map((level) => (
            <Button
              key={level.value}
              variant={selectedLevel === level.value ? "default" : "outline"}
              onClick={() => setSelectedLevel(level.value)}
              className="flex-1 min-w-[140px]"
              data-testid={`filter-fitness-${level.value}`}
            >
              {level.label}
            </Button>
          ))}
        </div>

        {/* Selected Level Info */}
        {selectedLevelInfo && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <h2 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">
              {selectedLevelInfo.label} Products
            </h2>
            <p className="text-blue-700 dark:text-blue-300">
              {selectedLevelInfo.description}
            </p>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {isLoadingProducts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We don't have any products for {selectedLevelInfo?.label.toLowerCase()} level yet.
          </p>
          <Link href="/products">
            <Button variant="outline">Browse All Products</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              Showing {products.length} product{products.length !== 1 ? 's' : ''} for {selectedLevelInfo?.label.toLowerCase()} level
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={product.images?.[0] || "/api/placeholder/300/200"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/300/200";
                      }}
                    />
                    {product.isFeatured && (
                      <Badge className="absolute top-2 left-2" variant="secondary">
                        Featured
                      </Badge>
                    )}
                    {product.fitnessLevel && (
                      <Badge className="absolute top-2 right-2" variant="outline">
                        {FITNESS_LEVELS.find(level => level.value === product.fitnessLevel)?.label || product.fitnessLevel}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 group-hover:text-red-600 transition-colors">
                    <Link href={`/products/${product.id}`} className="hover:underline">
                      {product.name}
                    </Link>
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/products?fitnessLevel=${selectedLevel}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        Browse More
                      </Button>
                    </Link>
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <Button size="sm" data-testid={`view-product-${product.id}`} className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}