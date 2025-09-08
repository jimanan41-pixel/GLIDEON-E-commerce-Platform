import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: string;
  product?: {
    id: string;
    name: string;
    images?: string[];
  };
  variant?: {
    id: string;
    size: string;
    unit: string;
    flavor?: string;
    price: string;
    salePrice?: string;
  };
}

interface Order {
  id: string;
  userId: string;
  total: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items?: OrderItem[];
}

const formatPrice = (price: string | number) => {
  return `$${parseFloat(price.toString()).toFixed(2)}`;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "shipped":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function OrderDetail() {
  const [match, params] = useRoute("/order/:orderId");
  const orderId = params?.orderId;

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const { data: orderItems = [] } = useQuery<OrderItem[]>({
    queryKey: ["/api/orders", orderId, "items"],
    enabled: !!orderId,
  });

  const calculateItemTotal = (item: OrderItem) => {
    const price = parseFloat(item.price);
    return price * item.quantity;
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/profile">
              <Button className="bg-glideon-red hover:bg-red-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile">
            <Button variant="ghost" className="mb-4" data-testid="back-to-orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(order.status)} data-testid="order-status">
                {order.status}
              </Badge>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => {
                    const imageUrl = item.product?.images?.[0] || "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100";
                    const itemPrice = parseFloat(item.price);

                    return (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        data-testid={`order-item-${item.id}`}
                      >
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={item.product?.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.product?.name || "Unknown Product"}
                          </h3>
                          {item.variant && (
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              <span className="font-medium">{item.variant.size} {item.variant.unit}</span>
                              {item.variant.flavor && (
                                <span className="ml-2">• {item.variant.flavor}</span>
                              )}
                            </div>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {formatPrice(itemPrice)} × {item.quantity}
                          </p>
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(calculateItemTotal(item))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Info */}
          <div className="space-y-6">
            {/* Payment & Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment & Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Method</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </p>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)} data-testid="payment-status">
                    {order.paymentStatus}
                  </Badge>
                </div>
                
                {order.shippingAddress && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Shipping Address
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatPrice(calculateSubtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">
                      {calculateSubtotal() >= 50 ? "Free" : "$9.99"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatPrice(calculateSubtotal() * 0.08)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}