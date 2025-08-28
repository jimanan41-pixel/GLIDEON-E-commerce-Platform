import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCart, Users, BarChart3, Plus, ArrowRight, Settings, FileText, Tag } from "lucide-react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Product, Category, Order, CmsContent } from "@shared/schema";

export default function Admin() {
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

  // Queries for dashboard stats
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: cmsContent } = useQuery<CmsContent[]>({
    queryKey: ["/api/cms"],
    enabled: isAuthenticated && user?.role === 'admin',
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

  // Calculate stats
  const totalProducts = products?.length || 0;
  const totalCategories = categories?.length || 0;
  const totalOrders = orders?.length || 0;
  const featuredProducts = products?.filter(p => p.isFeatured)?.length || 0;
  const activeProducts = products?.filter(p => p.isActive)?.length || 0;
  const lowStockProducts = products?.filter(p => (p.stock || 0) < 10)?.length || 0;

  const quickActions = [
    {
      title: "Analytics Dashboard",
      description: "View sales analytics, metrics, and business insights",
      icon: BarChart3,
      href: "/admin/dashboard",
      color: "bg-blue-500",
      stats: "Sales & Analytics",
    },
    {
      title: "User Management",
      description: "Manage customer accounts and view user details",
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-500",
      stats: "Customer accounts",
    },
    {
      title: "Content Management",
      description: "Edit website content, hero sections, and CMS data",
      icon: FileText,
      href: "/admin/content",
      color: "bg-green-500",
      stats: "Website content",
    },
    {
      title: "Manage Products",
      description: "Add, edit, and manage your product catalog with image uploads",
      icon: Package,
      href: "/admin/products",
      color: "bg-red-500",
      stats: `${totalProducts} total, ${activeProducts} active`,
    },
    {
      title: "Categories",
      description: "Organize products with categories and upload images",
      icon: Tag,
      href: "/admin/categories",
      color: "bg-orange-500",
      stats: `${totalCategories} categories`,
    },
    {
      title: "Orders",
      description: "View and manage customer orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-indigo-500",
      stats: `${totalOrders} orders`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Manage your GLIDEON platform.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {activeProducts} active, {featuredProducts} featured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
              <p className="text-xs text-muted-foreground">
                Product categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Customer orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Items below 10 units
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href={action.href}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${action.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {action.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {action.stats}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity or Alerts */}
        {lowStockProducts > 0 && (
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-orange-800 dark:text-orange-200">
                Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-orange-500 text-orange-700">
                  {lowStockProducts} products
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  have low stock levels. Consider restocking soon.
                </span>
                <Link href="/admin/products">
                  <Button variant="outline" size="sm" className="ml-auto">
                    View Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}