import { Link } from "wouter";
import { ArrowLeft, Home, ShoppingBag, Users, HelpCircle, FileText, Shield, Package, RotateCcw, Search, MapPin, Briefcase } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Sitemap() {
  const siteStructure = [
    {
      category: "Main Pages",
      icon: Home,
      pages: [
        { name: "Home", url: "/", description: "Our main homepage with featured products and promotions" },
        { name: "About Us", url: "/about", description: "Learn about GLIDEON's mission and values" },
        { name: "Contact", url: "/contact", description: "Get in touch with our team" }
      ]
    },
    {
      category: "Shopping",
      icon: ShoppingBag,
      pages: [
        { name: "All Products", url: "/products", description: "Browse our complete product catalog" },
        { name: "Supplements", url: "/products?category=supplements", description: "Premium fitness supplements" },
        { name: "Equipment", url: "/products?category=equipment", description: "High-quality fitness equipment" },
        { name: "Apparel", url: "/products?category=apparel", description: "Comfortable workout clothing" },
        { name: "Nutrition", url: "/products?category=nutrition", description: "Healthy nutrition products" },
        { name: "Shopping Cart", url: "/cart", description: "View and manage your cart items" },
        { name: "Checkout", url: "/checkout", description: "Complete your purchase securely" }
      ]
    },
    {
      category: "Customer Support",
      icon: HelpCircle,
      pages: [
        { name: "Help Center", url: "/help-center", description: "Frequently asked questions and support articles" },
        { name: "Shipping Info", url: "/shipping-info", description: "Shipping methods, rates, and delivery information" },
        { name: "Returns & Exchanges", url: "/returns", description: "Easy returns and exchange policy" },
        { name: "Track Your Order", url: "/track-order", description: "Track your package in real-time" }
      ]
    },
    {
      category: "Account & Legal",
      icon: Users,
      pages: [
        { name: "My Profile", url: "/profile", description: "Manage your account and view order history" },
        { name: "Privacy Policy", url: "/privacy-policy", description: "How we protect and handle your information" },
        { name: "Terms of Service", url: "/terms-of-service", description: "Terms and conditions for using our service" }
      ]
    },
    {
      category: "Company",
      icon: Briefcase,
      pages: [
        { name: "Careers", url: "/careers", description: "Join our team and build the future of fitness" },
        { name: "Sitemap", url: "/sitemap", description: "Complete overview of our website structure" }
      ]
    }
  ];

  const quickActions = [
    { name: "Search Products", icon: Search, url: "/products", color: "bg-blue-500" },
    { name: "Track Order", icon: Package, url: "/track-order", color: "bg-green-500" },
    { name: "Get Help", icon: HelpCircle, url: "/help-center", color: "bg-purple-500" },
    { name: "Start Return", icon: RotateCcw, url: "/returns", color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2 text-glideon-red hover:text-red-700 mb-4" data-testid="back-home">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="sitemap-title">
            Site Map
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Complete overview of all pages and sections on our website
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.url}>
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {action.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Site Structure */}
        <div className="space-y-8">
          {siteStructure.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            return (
              <Card key={sectionIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-glideon-red/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-glideon-red" />
                    </div>
                    <span>{section.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.pages.map((page, pageIndex) => (
                      <Link key={pageIndex} href={page.url}>
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-glideon-red hover:bg-glideon-red/5 transition-colors duration-200 cursor-pointer">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {page.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {page.description}
                          </p>
                          <p className="text-xs text-glideon-red font-medium">
                            {page.url}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Website Statistics */}
        <Card className="mt-12 border-glideon-red/20 bg-glideon-red/5">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Website Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-glideon-red mb-2">
                  {siteStructure.reduce((total, section) => total + section.pages.length, 0)}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Total Pages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-glideon-red mb-2">
                  {siteStructure.length}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Main Sections</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-glideon-red mb-2">
                  4
                </div>
                <div className="text-gray-600 dark:text-gray-300">Product Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-glideon-red" />
              <span>Additional Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Customer Service</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-gray-600 dark:text-gray-300">Email: </span>
                    <span className="text-glideon-red">support@glideon.com</span>
                  </li>
                  <li>
                    <span className="text-gray-600 dark:text-gray-300">Phone: </span>
                    <span className="text-glideon-red">1-800-GLIDEON</span>
                  </li>
                  <li>
                    <span className="text-gray-600 dark:text-gray-300">Hours: </span>
                    <span className="text-gray-600 dark:text-gray-300">Mon-Fri 9AM-6PM EST</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Business Info</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>123 Fitness Street</li>
                  <li>New York, NY 10001</li>
                  <li>United States</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Follow Us</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>Facebook: @GlideonFitness</li>
                  <li>Instagram: @glideon_official</li>
                  <li>Twitter: @GlideonHealth</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sitemap last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}