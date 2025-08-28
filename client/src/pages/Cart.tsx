import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartItemCount } = useCart();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: cartItems.length > 0,
  });

  const getProductById = (productId: string) => {
    return products?.find(p => p.id === productId);
  };

  const calculateItemTotal = (productId: string, quantity: number) => {
    const product = getProductById(productId);
    if (!product) return 0;
    const price = product.salePrice ? parseFloat(product.salePrice) : parseFloat(product.price);
    return price * quantity;
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + calculateItemTotal(item.productId, item.quantity);
    }, 0);
  };

  const shipping = calculateCartTotal() >= 50 ? 0 : 9.99;
  const tax = calculateCartTotal() * 0.08; // 8% tax
  const finalTotal = calculateCartTotal() + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" data-testid="cart-title">
            Shopping Cart
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300" data-testid="cart-item-count">
            {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4" data-testid="empty-cart-title">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8" data-testid="empty-cart-description">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button className="bg-glideon-red hover:bg-red-700 text-white font-semibold px-8 py-3" data-testid="continue-shopping">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;

                    const price = product.salePrice ? parseFloat(product.salePrice) : parseFloat(product.price);
                    const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200";

                    return (
                      <div key={item.id} className="p-6" data-testid={`cart-item-${item.id}`}>
                        <div className="flex items-center space-x-4">
                          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              data-testid={`cart-item-image-${item.id}`}
                            />
                          </div>
                          
                          <div className="flex-1">
                            <Link href={`/products/${product.slug}`}>
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white hover:text-glideon-red transition-colors" data-testid={`cart-item-name-${item.id}`}>
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-gray-600 dark:text-gray-300 mt-1" data-testid={`cart-item-price-${item.id}`}>
                              ${price.toFixed(2)} each
                            </p>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  className="h-10 w-10 p-0"
                                  data-testid={`decrease-quantity-${item.id}`}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-4 py-2 font-medium" data-testid={`quantity-${item.id}`}>
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-10 w-10 p-0"
                                  data-testid={`increase-quantity-${item.id}`}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white" data-testid={`item-total-${item.id}`}>
                                  ${calculateItemTotal(item.productId, item.quantity).toFixed(2)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-600 hover:text-red-700 p-2"
                                  data-testid={`remove-item-${item.id}`}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6" data-testid="order-summary-title">
                  Order Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span data-testid="subtotal">${calculateCartTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Shipping</span>
                    <span data-testid="shipping">
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Tax</span>
                    <span data-testid="tax">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span data-testid="total">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400" data-testid="free-shipping-notice">
                      Add ${(50 - calculateCartTotal()).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <Link href="/checkout">
                    <Button className="w-full bg-glideon-red hover:bg-red-700 text-white font-semibold py-3" data-testid="checkout-button">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <Link href="/products">
                    <Button variant="outline" className="w-full" data-testid="continue-shopping-button">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Security Notice */}
                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <i className="fas fa-shield-alt text-green-500"></i>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
