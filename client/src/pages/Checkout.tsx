import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [isProcessing, setIsProcessing] = useState(false);
  const [offerCode, setOfferCode] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<any>(null);
  const [offerValidationError, setOfferValidationError] = useState("");
  
  const { isAuthenticated, user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: cartItems.length > 0,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.slice(-8)} has been confirmed.`,
      });
      navigate("/profile");
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
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated or cart is empty
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please sign in to continue
            </h1>
            <Button
              onClick={() => window.location.href = "/api/login"}
              className="bg-glideon-red hover:bg-red-700 text-white"
            >
              Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <Link href="/products">
              <Button className="bg-glideon-red hover:bg-red-700 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const getProductById = (productId: string) => {
    return products?.find(p => p.id === productId);
  };

  const calculateItemTotal = (item: any) => {
    // Use variant price if available, otherwise fallback to product price
    let price = 0;
    if (item.variant?.price) {
      price = item.variant.salePrice ? parseFloat(item.variant.salePrice) : parseFloat(item.variant.price);
    } else {
      const product = getProductById(item.productId);
      if (product) {
        price = product.salePrice ? parseFloat(product.salePrice) : parseFloat(product.price);
      }
    }
    return price * item.quantity;
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  // Offer code validation mutation
  const validateOfferMutation = useMutation({
    mutationFn: async (code: string) => {
      const subtotal = calculateCartTotal();
      const response = await apiRequest("POST", "/api/validate-offer-code", {
        code: code.trim().toUpperCase(),
        cartTotal: subtotal,
        userId: user?.id
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAppliedOffer(data);
      setOfferValidationError("");
      toast({
        title: "Offer applied!",
        description: `You saved ${formatPrice(data.discountAmount)} with code ${data.offer.code}`,
      });
    },
    onError: (error: any) => {
      setAppliedOffer(null);
      setOfferValidationError(error.message || "Invalid offer code");
      toast({
        title: "Invalid offer code",
        description: error.message || "Please check your code and try again",
        variant: "destructive",
      });
    },
  });

  const handleApplyOfferCode = () => {
    if (!offerCode.trim()) {
      setOfferValidationError("Please enter an offer code");
      return;
    }
    validateOfferMutation.mutate(offerCode.trim());
  };

  const handleRemoveOfferCode = () => {
    setAppliedOffer(null);
    setOfferCode("");
    setOfferValidationError("");
  };

  const subtotal = calculateCartTotal();
  const discount = appliedOffer ? appliedOffer.discountAmount : 0;
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = (subtotal - discount) * 0.08;
  const finalTotal = subtotal - discount + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all shipping address fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      createOrderMutation.mutate({
        total: finalTotal.toFixed(2),
        shippingAddress,
        paymentMethod,
        paymentStatus: "paid",
        status: "processing",
        appliedOffer: appliedOffer, // Include applied offer for usage tracking
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="flex items-center space-x-2 text-glideon-red hover:text-red-700 mb-4" data-testid="back-to-cart">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Cart</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="checkout-title">
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping & Payment */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle data-testid="shipping-address-title">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => handleAddressChange("street", e.target.value)}
                      placeholder="1456 Main Bazzar"
                      required
                      data-testid="street-input"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleAddressChange("city", e.target.value)}
                        placeholder="Sirsa"
                        required
                        data-testid="city-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => handleAddressChange("state", e.target.value)}
                        placeholder="NY"
                        required
                        data-testid="state-input"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                        placeholder="10001"
                        required
                        data-testid="zip-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select value={shippingAddress.country} onValueChange={(value) => handleAddressChange("country", value)}>
                        <SelectTrigger data-testid="country-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IN">India</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="MX">Mexico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2" data-testid="payment-method-title">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Cash on Delivery - Default and Only Available Option */}
                    <div className="flex items-center space-x-3 p-4 border-2 border-glideon-red bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <input
                        type="radio"
                        id="cash_on_delivery"
                        name="payment_method"
                        value="cash_on_delivery"
                        checked={paymentMethod === "cash_on_delivery"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-glideon-red focus:ring-glideon-red"
                        data-testid="payment-cod-radio"
                      />
                      <label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Pay when your order arrives at your doorstep</div>
                      </label>
                      <div className="text-green-600 font-semibold text-sm">Available</div>
                    </div>
                    
                    {/* Disabled Payment Options */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-50">
                        <input
                          type="radio"
                          id="credit_card"
                          name="payment_method"
                          value="credit_card"
                          disabled
                          className="text-gray-400"
                          data-testid="payment-card-radio"
                        />
                        <label htmlFor="credit_card" className="flex-1 cursor-not-allowed">
                          <div className="font-semibold text-gray-500 dark:text-gray-400">Credit/Debit Card</div>
                          <div className="text-sm text-gray-400">Coming soon</div>
                        </label>
                        <div className="text-orange-500 font-semibold text-sm">Coming Soon</div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-50">
                        <input
                          type="radio"
                          id="paypal"
                          name="payment_method"
                          value="paypal"
                          disabled
                          className="text-gray-400"
                          data-testid="payment-paypal-radio"
                        />
                        <label htmlFor="paypal" className="flex-1 cursor-not-allowed">
                          <div className="font-semibold text-gray-500 dark:text-gray-400">PayPal</div>
                          <div className="text-sm text-gray-400">Coming soon</div>
                        </label>
                        <div className="text-orange-500 font-semibold text-sm">Coming Soon</div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-50">
                        <input
                          type="radio"
                          id="digital_wallet"
                          name="payment_method"
                          value="digital_wallet"
                          disabled
                          className="text-gray-400"
                          data-testid="payment-wallet-radio"
                        />
                        <label htmlFor="digital_wallet" className="flex-1 cursor-not-allowed">
                          <div className="font-semibold text-gray-500 dark:text-gray-400">Digital Wallet</div>
                          <div className="text-sm text-gray-400">Apple Pay, Google Pay</div>
                        </label>
                        <div className="text-orange-500 font-semibold text-sm">Coming Soon</div>
                      </div>
                    </div>
                    
                    {/* Cash on Delivery Info */}
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-semibold text-green-800 dark:text-green-200">Cash on Delivery Benefits:</p>
                          <ul className="text-sm text-green-700 dark:text-green-300 mt-1 space-y-1">
                            <li>• No need to pay online</li>
                            <li>• Inspect products before payment</li>
                            <li>• Safe and secure</li>
                            <li>• Available across all delivery areas</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle data-testid="order-summary-title">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => {
                      const product = getProductById(item.productId);
                      if (!product) return null;

                      // Use variant price if available, otherwise fallback to product price
                      let price = 0;
                      if (item.variant?.price) {
                        price = item.variant.salePrice ? parseFloat(item.variant.salePrice) : parseFloat(item.variant.price);
                      } else {
                        price = product.salePrice ? parseFloat(product.salePrice) : parseFloat(product.price);
                      }
                      
                      const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100";

                      return (
                        <div key={item.id} className="flex items-center space-x-3" data-testid={`order-item-${item.id}`}>
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            {item.variant && (
                              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                <span className="font-medium">{item.variant.size} {item.variant.unit}</span>
                                {item.variant.flavor && (
                                  <span className="ml-2">• {item.variant.flavor}</span>
                                )}
                              </div>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {formatPrice(price)} × {item.quantity}
                            </p>
                          </div>
                          <div className="font-medium">
                            {formatPrice(calculateItemTotal(item))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Offer Code Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                    {!appliedOffer ? (
                      <div className="space-y-3">
                        <Label htmlFor="offer-code" className="text-sm font-medium">
                          Offer Code
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id="offer-code"
                            value={offerCode}
                            onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                            placeholder="Enter discount code"
                            className="text-sm"
                            data-testid="offer-code-input"
                          />
                          <Button
                            type="button"
                            onClick={handleApplyOfferCode}
                            disabled={validateOfferMutation.isPending || !offerCode.trim()}
                            size="sm"
                            variant="outline"
                            data-testid="apply-offer-button"
                          >
                            {validateOfferMutation.isPending ? "Checking..." : "Apply"}
                          </Button>
                        </div>
                        {offerValidationError && (
                          <p className="text-sm text-red-600 dark:text-red-400" data-testid="offer-error">
                            {offerValidationError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                              {appliedOffer.offer.title} Applied
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-300">
                              Code: {appliedOffer.offer.code} • Save {formatPrice(appliedOffer.discountAmount)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={handleRemoveOfferCode}
                            size="sm"
                            variant="ghost"
                            className="text-green-700 dark:text-green-300 hover:text-red-600 dark:hover:text-red-400"
                            data-testid="remove-offer-button"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span data-testid="checkout-subtotal">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Discount ({appliedOffer.offer.code})</span>
                        <span data-testid="checkout-discount">-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span data-testid="checkout-shipping">
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span data-testid="checkout-tax">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-3">
                      <span>Total</span>
                      <span data-testid="checkout-total">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    disabled={isProcessing || createOrderMutation.isPending}
                    className="w-full mt-6 bg-glideon-red hover:bg-red-700 text-white font-semibold py-3"
                    data-testid="place-order-button"
                  >
                    {isProcessing ? "Processing..." : `Place Order - ${formatPrice(finalTotal)}`}
                  </Button>

                  {/* Security Notice */}
                  <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Lock className="h-4 w-4" />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
