import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Category } from "@shared/schema";

export default function CategorySection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Find exactly what you need to reach your fitness goals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const categoryImages = {
    supplements: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=600&fit=crop&auto=format",
    equipment: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format",
    apparel: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop&auto=format",
    nutrition: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format"
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="categories-title">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300" data-testid="categories-description">
            Find exactly what you need to reach your fitness goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div 
                key={category.id}
                className="group onhover relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                data-testid={`category-${category.slug}`} onClick={() => {
                  window.location.href = `/products?category=${category.slug}`;
                }}
              >
                <img 
                  src={category.imageUrl || categoryImages[category.slug as keyof typeof categoryImages] || categoryImages.supplements}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = categoryImages.supplements;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2" data-testid={`category-name-${category.slug}`}>
                    {category.name}
                  </h3>
                  <p className="text-gray-200 text-sm mb-3" data-testid={`category-description-${category.slug}`}>
                    {category.description}
                  </p>
                  <Link href={`/products?category=${category.slug}`}>
                    <Button 
                      className="bg-glideon-red hover:bg-red-700 text-white text-sm font-medium transition-colors duration-200"
                      data-testid={`category-view-products-${category.slug}`}
                    >
                      View Products
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400" data-testid="no-categories">
                No categories available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
