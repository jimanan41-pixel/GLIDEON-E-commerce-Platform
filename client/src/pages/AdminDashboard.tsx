import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Calendar,
  Clock
} from "lucide-react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Order, Product, User } from "@shared/schema";

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  shippedOrders: number;
  completedOrders: number;
  refundedOrders: number;
  lowStockProducts: Product[];
  bestSellingProducts: Product[];
  recentOrders: Order[];
  recentUsers: User[];
  salesData: {
    daily: { date: string; revenue: number; orders: number }[];
    weekly: { week: string; revenue: number; orders: number }[];
    monthly: { month: string; revenue: number; orders: number }[];
  };
}

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Check authorization
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "Admin access required. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast, navigate]);

  // Dashboard data
  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard"],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      return response.json();
    },
    enabled: isAuthenticated && user?.role === 'admin',
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-glideon-red mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Overview of your business performance and key metrics
          </p>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(dashboardStats?.totalRevenue || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardStats?.totalOrders || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardStats?.totalUsers || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock Items</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardStats?.lowStockProducts?.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
                      <p className="text-xl font-bold text-yellow-600">
                        {dashboardStats?.pendingOrders || 0}
                      </p>
                    </div>
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shipped Orders</p>
                      <p className="text-xl font-bold text-blue-600">
                        {dashboardStats?.shippedOrders || 0}
                      </p>
                    </div>
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Orders</p>
                      <p className="text-xl font-bold text-green-600">
                        {dashboardStats?.completedOrders || 0}
                      </p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Refunded Orders</p>
                      <p className="text-xl font-bold text-red-600">
                        {dashboardStats?.refundedOrders || 0}
                      </p>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Orders
                    <Link href="/admin/orders">
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                        View All
                      </Badge>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardStats?.recentOrders?.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">#{order.id.substring(0, 8)}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(order.total)}</p>
                          <Badge
                            variant={
                              order.status === 'completed' ? 'default' :
                              order.status === 'shipped' ? 'secondary' : 'outline'
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Low Stock Alert
                    <Link href="/admin/products">
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                        Manage Stock
                      </Badge>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardStats?.lowStockProducts?.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                        <Badge variant="destructive">
                          Low Stock
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/admin/users">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">User Management</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage customers and user accounts
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/content">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Content Management</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage website content and CMS
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/analytics">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sales Analytics</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      View detailed sales reports and analytics
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}