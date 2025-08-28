import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ProductCard from "./ProductCard";
import type { Product } from "@shared/schema";

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: true, limit: 4 }],
    queryFn: async () => {
      const response = await fetch("/api/products?featured=true&limit=4");
      if (!response.ok) throw new Error("Failed to fetch featured products");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Our most popular and highly-rated products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="featured-title">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300" data-testid="featured-description">
            Our most popular and highly-rated products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400" data-testid="no-featured-products">
                No featured products available at the moment.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button 
              className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
              data-testid="view-all-products"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
