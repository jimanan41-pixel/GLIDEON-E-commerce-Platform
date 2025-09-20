import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Star, Heart, ShoppingCart, Plus, Minus, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { formatPrice } from "@/lib/utils";
import type { Product, Review, ProductVariant } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  
  // Get product images from database or fallback to placeholder
  const getProductImages = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    // Fallback to placeholder if no images
    return [`https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop`];
  };
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found");
        }
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
    enabled: !!id,
  });

  const { data: variants, isLoading: variantsLoading } = useQuery<ProductVariant[]>({
    queryKey: ["/api/products", id, "variants"],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}/variants`);
      if (!response.ok) throw new Error("Failed to fetch variants");
      return response.json();
    },
    enabled: !!product?.id,
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews", product?.id],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?productId=${product?.id}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
    enabled: !!product?.id,
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: { productId: string; rating: number; comment: string }) => {
      await apiRequest("POST", "/api/reviews", reviewData);
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your review! It will be published after approval.",
      });
      setReviewText("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", product?.id] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Helper functions for variant management
  const getAvailableSizes = () => {
    if (!variants) return [];
    const sizes = new Set<string>();
    variants.forEach(variant => {
      const sizeKey = `${variant.size} ${variant.unit}`;
      sizes.add(sizeKey);
    });
    return Array.from(sizes);
  };

  const getAvailableFlavors = (selectedSizeKey?: string) => {
    if (!variants) return [];
    let filteredVariants = variants;
    
    if (selectedSizeKey) {
      filteredVariants = variants.filter(variant => 
        `${variant.size} ${variant.unit}` === selectedSizeKey
      );
    }
    
    const flavors = new Set<string>();
    filteredVariants.forEach(variant => {
      if (variant.flavor) {
        flavors.add(variant.flavor);
      }
    });
    
    // Add "No Flavor" option if there are variants without flavor
    if (filteredVariants.some(v => !v.flavor)) {
      flavors.add("No Flavor");
    }
    
    return Array.from(flavors);
  };

  const getCurrentVariant = () => {
    if (!variants || !selectedSize) return null;
    
    return variants.find(variant => {
      const sizeMatch = `${variant.size} ${variant.unit}` === selectedSize;
      const flavorMatch = selectedFlavor === "No Flavor" 
        ? !variant.flavor 
        : variant.flavor === selectedFlavor;
      
      return sizeMatch && (selectedFlavor ? flavorMatch : true);
    }) || null;
  };

  const handleAddToCart = () => {
    const currentVariant = getCurrentVariant();
    if (!product || !currentVariant) {
      toast({
        title: "Please select all options",
        description: "Choose size and flavor before adding to cart",
        variant: "destructive",
      });
      return;
    }
    addToCart(product.id, quantity, currentVariant.id);
  };

  // Set default selections when variants are loaded
  useEffect(() => {
    if (variants && variants.length > 0 && !selectedSize) {
      const firstVariant = variants[0];
      const firstSize = `${firstVariant.size} ${firstVariant.unit}`;
      setSelectedSize(firstSize);
      
      const availableFlavors = getAvailableFlavors(firstSize);
      if (availableFlavors.length > 0) {
        setSelectedFlavor(availableFlavors[0]);
      }
    }
  }, [variants, selectedSize]);

  // Auto-select first available flavor when size changes
  useEffect(() => {
    if (selectedSize && variants) {
      const availableFlavors = getAvailableFlavors(selectedSize);
      if (availableFlavors.length > 0) {
        // If current flavor is not available for this size, select the first available one
        if (!selectedFlavor || !availableFlavors.includes(selectedFlavor)) {
          setSelectedFlavor(availableFlavors[0]);
        }
      } else {
        // No flavors available for this size, clear selection
        setSelectedFlavor("");
      }
    }
  }, [selectedSize, variants]);

  // Update selected variant when size or flavor changes
  useEffect(() => {
    const currentVariant = getCurrentVariant();
    setSelectedVariant(currentVariant);
  }, [selectedSize, selectedFlavor, variants]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !isAuthenticated) return;
    
    createReviewMutation.mutate({
      productId: product.id,
      rating,
      comment: reviewText,
    });
  };

  if (isLoading || variantsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Product not found
            </h1>
            <Link href="/products">
              <Button className="bg-glideon-red hover:bg-red-700 text-white">
                Back to Products
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Use selected variant pricing or fallback to product pricing
  const price = selectedVariant ? Number(selectedVariant.price) : parseFloat(product.price);
  const salePrice = selectedVariant?.salePrice ? Number(selectedVariant.salePrice) : (product.salePrice ? parseFloat(product.salePrice) : null);
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  const currentPrice = salePrice || price;
  const images = getProductImages(product);
  const currentStock = selectedVariant?.stock ? Number(selectedVariant.stock) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/products">
            <Button variant="ghost" className="flex items-center space-x-2 text-glideon-red hover:text-red-700" data-testid="back-to-products">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Products</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative group">
              <div className="aspect-square mobilecustomhyt w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                  className="w-full h-full  object-cover group-hover:scale-105 transition-transform duration-300"
                  data-testid="product-main-image"
                />
              </div>
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    data-testid="image-prev"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    data-testid="image-next"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
            
            {/* Thumbnail Slider */}
            <div className="flex space-x-2 overflow-x-auto pb-2 mobilecustomthumbnail">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    selectedImage === index 
                      ? "border-glideon-red shadow-lg" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  data-testid={`product-thumbnail-${index}`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
            
            {/* Image Description */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click thumbnails to view different angles • Hover to zoom
              </p>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              {product.isFeatured && (
                <Badge className="bg-glideon-red text-white mb-2" data-testid="featured-badge">
                  Featured
                </Badge>
              )}
              {salePrice && (
                <Badge className="bg-green-600 text-white ml-2" data-testid="sale-badge">
                  {discount}% OFF
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" data-testid="product-title">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400 ml-2" data-testid="review-count">
                ({reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="current-price">
                  {formatPrice(currentPrice)}
                </span>
                {salePrice && (
                  <span className="text-xl text-gray-500 dark:text-gray-400 line-through" data-testid="original-price">
                    {formatPrice(price)}
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-6" data-testid="product-short-description">
              {product.shortDescription || product.description}
            </p>

            {/* Size and Flavor Selection */}
            {variants && variants.length > 0 && (
              <div className="mb-6 space-y-4">
                <h3 className="text-lg font-medium">Select Options</h3>
                
                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Size *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {getAvailableSizes().map((size) => {
                      const sizeVariants = variants.filter(v => `${v.size} ${v.unit}` === size);
                      const hasStock = sizeVariants.some(v => (v.stock || 0) > 0);
                      const minPrice = Math.min(...sizeVariants.map(v => parseFloat(v.salePrice || v.price)));
                      const isSelected = selectedSize === size;
                      
                      return (
                        <button
                          key={size}
                          onClick={() => hasStock && setSelectedSize(size)}
                          disabled={!hasStock}
                          className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                            isSelected
                              ? "border-glideon-red bg-red-50 dark:bg-red-950 text-glideon-red"
                              : hasStock
                              ? "border-gray-200 dark:border-gray-700 hover:border-glideon-red hover:bg-red-50 dark:hover:bg-red-950 text-gray-900 dark:text-white"
                              : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                          }`}
                          data-testid={`size-tile-${size.replace(/ /g, '-')}`}
                        >
                          <div className="font-medium text-sm mb-1">{size}</div>
                          <div className="text-xs">
                            {hasStock ? `from ${formatPrice(minPrice)}` : 'Out of stock'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Flavor Selection */}
                {selectedSize && getAvailableFlavors(selectedSize).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-3">Flavor</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {getAvailableFlavors(selectedSize).map((flavor) => {
                        const flavorVariant = variants.find(v => 
                          `${v.size} ${v.unit}` === selectedSize && 
                          (flavor === "No Flavor" ? !v.flavor : v.flavor === flavor)
                        );
                        const hasStock = flavorVariant && (flavorVariant.stock || 0) > 0;
                        const isSelected = selectedFlavor === flavor;
                        
                        return (
                          <button
                            key={flavor}
                            onClick={() => hasStock && setSelectedFlavor(flavor)}
                            disabled={!hasStock}
                            className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                              isSelected
                                ? "border-glideon-red bg-red-50 dark:bg-red-950 text-glideon-red"
                                : hasStock
                                ? "border-gray-200 dark:border-gray-700 hover:border-glideon-red hover:bg-red-50 dark:hover:bg-red-950 text-gray-900 dark:text-white"
                                : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                            }`}
                            data-testid={`flavor-tile-${flavor.replace(/ /g, '-')}`}
                          >
                            <div className="font-medium text-sm mb-1">
                              {flavor === "No Flavor" ? "Original" : flavor}
                            </div>
                            {flavorVariant && (
                              <div className="text-xs">
                                {hasStock ? formatPrice(flavorVariant.salePrice || flavorVariant.price) : 'Out of stock'}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Current Selection Info */}
                {selectedVariant && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Selected: {selectedSize}</span>
                      <span className="text-lg font-bold text-glideon-red">
                        {formatPrice(selectedVariant.salePrice || selectedVariant.price)}
                      </span>
                    </div>
                    {selectedFlavor && selectedFlavor !== "No Flavor" && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Flavor: {selectedFlavor}
                      </div>
                    )}
                    {selectedVariant.salePrice && (
                      <div className="text-sm text-gray-500 line-through mb-1">
                        Original: {formatPrice(selectedVariant.price)}
                      </div>
                    )}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {(selectedVariant.stock || 0) > 0 ? `${selectedVariant.stock || 0} in stock` : 'Out of stock'}
                      {selectedVariant.sku && ` • SKU: ${selectedVariant.sku}`}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {currentStock > 0 ? (
                <span className="text-green-600 font-medium" data-testid="in-stock">
                  In Stock ({currentStock} available)
                </span>
              ) : (
                <span className="text-red-600 font-medium" data-testid="out-of-stock">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 p-0"
                  data-testid="decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium" data-testid="quantity-display">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 p-0"
                  data-testid="increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || currentStock <= 0 || !selectedSize}
                className="flex-1 bg-glideon-red hover:bg-red-700 text-white font-semibold py-3 transition-colors duration-200"
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {!selectedSize ? "Select Size" : !selectedVariant ? "Select Options" : currentStock <= 0 ? "Out of Stock" : "Add to Cart"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="p-3 border-gray-300 dark:border-gray-600 hover:text-glideon-red"
                data-testid="add-to-wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Details */}
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {selectedVariant?.sku && (
                <div data-testid="product-sku">
                  <span className="font-medium">SKU:</span> {selectedVariant.sku}
                </div>
              )}
              {product.weight && (
                <div data-testid="product-weight">
                  <span className="font-medium">Weight:</span> {product.weight}
                </div>
              )}
              {product.dimensions && (
                <div data-testid="product-dimensions">
                  <span className="font-medium">Dimensions:</span> {product.dimensions}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description" data-testid="description-tab">Description</TabsTrigger>
              <TabsTrigger value="reviews" data-testid="reviews-tab">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <div className="prose max-w-none dark:prose-invert" data-testid="product-description">
                <p>{product.description || "No description available."}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-8">
                {/* Add Review Form */}
                {isAuthenticated && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-semibold mb-4" data-testid="add-review-title">Add a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className={`h-8 w-8 ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                              data-testid={`rating-star-${star}`}
                            >
                              <Star className="h-full w-full fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Review</label>
                        <Textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your thoughts about this product..."
                          rows={4}
                          data-testid="review-textarea"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={createReviewMutation.isPending || !reviewText.trim()}
                        className="bg-glideon-red hover:bg-red-700 text-white"
                        data-testid="submit-review"
                      >
                        {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md" data-testid={`review-${review.id}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {/* User initial placeholder */}
                                U
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">Customer</div>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : ""}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8" data-testid="no-reviews">
                      <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <CartModal />
    </div>
  );
}
