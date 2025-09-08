import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CartItem, Product } from "@shared/schema";

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const fetchCartItems = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      console.log("Fetching cart items with token check...");
      const response = await apiRequest("GET", "/api/cart");
      const items = await response.json();
      setCartItems(items);
      console.log("Cart items fetched successfully:", items.length);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity = 1, variantId?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Attempting to add to cart:", productId, quantity, variantId ? `variant: ${variantId}` : "no variant");
      const requestData = variantId 
        ? { productId, quantity, variantId }
        : { productId, quantity };
      const response = await apiRequest("POST", "/api/cart", requestData);
      console.log("Cart response received:", response.status);
      await fetchCartItems();
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    } catch (error) {
      console.error("Cart add error:", error);
      toast({
        title: "Error",
        description: `Failed to add item to cart: ${error}`,
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
      await fetchCartItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart item.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await apiRequest("DELETE", `/api/cart/${itemId}`);
      await fetchCartItems();
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // This would need product data to calculate actual total
      return total + (item.quantity * 0); // Placeholder
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
