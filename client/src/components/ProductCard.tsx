import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@shared/schema";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group" data-testid={`product-card-${product.id}`}>
      <div className="relative overflow-hidden rounded-t-2xl">
        <Link href={`/products/${product.slug}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`product-image-${product.id}`}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4">
          {product.isFeatured && (
            <Badge className="bg-glideon-red text-white" data-testid={`product-featured-badge-${product.id}`}>
              Featured
            </Badge>
          )}
          {salePrice && (
            <Badge className="bg-green-600 text-white ml-2" data-testid={`product-new-badge-${product.id}`}>
              Sale
            </Badge>
          )}
        </div>
        
        {/* Wishlist Button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full h-8 w-8"
            data-testid={`product-wishlist-${product.id}`}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 hover:text-glideon-red transition-colors" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2" data-testid={`product-description-${product.id}`}>
          {product.shortDescription || product.description}
        </p>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2" data-testid={`product-reviews-${product.id}`}>
            (124 reviews)
          </span>
        </div>
        
        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white" data-testid={`product-price-${product.id}`}>
              {formatPrice(salePrice ? salePrice : price)}
            </span>
            {salePrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through" data-testid={`product-original-price-${product.id}`}>
                {formatPrice(price)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-green-600 text-sm font-medium" data-testid={`product-discount-${product.id}`}>
              {discount}% OFF
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full bg-glideon-red hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          data-testid={`add-to-cart-${product.id}`}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
