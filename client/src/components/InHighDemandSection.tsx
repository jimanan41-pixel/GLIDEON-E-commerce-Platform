import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Award } from "lucide-react";
import { Link } from "wouter";
import type { Product, Category } from "@shared/schema";

export default function InHighDemandSection() {
  // Fetch high demand categories from admin selection
  const { data: highDemandCategories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories/high-demand"],
  });

  // Get the category IDs
  const categoryId1 = highDemandCategories[0]?.id;
  const categoryId2 = highDemandCategories[1]?.id;

  // Fetch products for each high demand category (fixed hook order)
  const category1Products = useQuery<Product[]>({
    queryKey: ["/api/products", categoryId1],
    queryFn: () => fetch(`/api/products?categoryId=${categoryId1}&limit=3`).then(res => res.json()),
    enabled: !!categoryId1,
  });

  const category2Products = useQuery<Product[]>({
    queryKey: ["/api/products", categoryId2],
    queryFn: () => fetch(`/api/products?categoryId=${categoryId2}&limit=3`).then(res => res.json()),
    enabled: !!categoryId2,
  });

  if (categoriesLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glideon-red mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading high demand products...</p>
          </div>
        </div>
      </section>
    );
  }

  // If no high demand categories are selected by admin
  if (highDemandCategories.length === 0) {
    return null; // Don't show the section at all
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-glideon-red mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              In High Demand
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Most popular products flying off our shelves. Get yours before they're gone!
          </p>
        </div>

        {/* Dynamic Tabs Based on Admin Selection */}
        <Tabs defaultValue={highDemandCategories[0]?.slug} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mb-8">
            {highDemandCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.slug}
                className="flex items-center space-x-2"
                data-testid={`tab-${category.slug}`}
              >
                <Zap className="h-4 w-4" />
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {highDemandCategories.map((category, index) => {
            const categoryProducts = index === 0 ? (category1Products?.data || []) : (category2Products?.data || []);
            const isLoading = index === 0 ? category1Products?.isLoading : category2Products?.isLoading;

            return (
              <TabsContent key={category.id} value={category.slug} className="mt-8">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glideon-red"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map((product) => (
                      <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <img
                              src={product.images[0] || "https://images.unsplash.com/photo-1556909202-f91e91ba7e6e?w=400"}
                              alt={product.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.salePrice && (
                              <Badge className="absolute top-3 left-3 bg-glideon-red text-white">
                                Sale
                              </Badge>
                            )}
                            {product.isFeatured && (
                              <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                                <Award className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          
                          <div className="p-6">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-glideon-red transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                              {product.shortDescription || product.description}
                            </p>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                  ₹{product.salePrice || product.price}
                                </span>
                                {product.salePrice && (
                                  <span className="text-lg text-gray-500 line-through">
                                    ₹{product.price}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <Link href={`/products/${product.id}`}>
                              <Button className="w-full bg-glideon-red hover:bg-red-700 text-white">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                {!isLoading && categoryProducts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">No products available in {category.name}</p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}