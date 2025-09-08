import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { formatPrice } from "@/lib/utils";

export default function CartModal() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart,
    getCartItemCount 
  } = useCart();

  // Fetch product details for cart items
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

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="w-full max-w-md p-0">
        <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <SheetTitle className="flex items-center justify-between" data-testid="cart-title">
            <span>Shopping Cart</span>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartOpen(false)}
              className="h-8 w-8 p-0"
              data-testid="close-cart"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-cart">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
              <Button
                onClick={() => setIsCartOpen(false)}
                className="bg-glideon-red hover:bg-red-700 text-white"
                data-testid="continue-shopping"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;

                const price = product.salePrice ? parseFloat(product.salePrice) : parseFloat(product.price);
                const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100";

                return (
                  <div 
                    key={item.id}
                    className="flex items-center space-x-4 pb-6 border-b border-gray-200 dark:border-gray-700"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        data-testid={`cart-item-image-${item.id}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white" data-testid={`cart-item-name-${item.id}`}>
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400" data-testid={`cart-item-price-${item.id}`}>
                        ${price.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            data-testid={`decrease-quantity-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-gray-900 dark:text-white font-medium" data-testid={`cart-item-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            data-testid={`increase-quantity-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white" data-testid={`cart-item-total-${item.id}`}>
                          {formatPrice(calculateItemTotal(item.productId, item.quantity))}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-glideon-red h-8 w-8 p-0"
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
              <span className="text-2xl font-bold text-glideon-red" data-testid="cart-total">
                {formatPrice(calculateCartTotal())}
              </span>
            </div>
            <Link href="/checkout">
              <Button 
                className="w-full bg-glideon-red hover:bg-red-700 text-white font-semibold py-3 mb-3 transition-colors duration-200"
                onClick={() => setIsCartOpen(false)}
                data-testid="checkout-button"
              >
                Proceed to Checkout
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setIsCartOpen(false)}
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
