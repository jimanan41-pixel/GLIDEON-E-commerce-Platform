import { Link } from "wouter";
import { ArrowLeft, Truck, Clock, MapPin, Package, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ShippingInfo() {
  const shippingMethods = [
    {
      name: "Standard Shipping",
      time: "3-7 Business Days",
      cost: "Free on orders over $50",
      description: "Reliable delivery to your doorstep",
      icon: Truck
    },
    {
      name: "Express Shipping",
      time: "1-3 Business Days",
      cost: "$9.99",
      description: "Faster delivery for urgent orders",
      icon: Clock
    },
    {
      name: "Same Day Delivery",
      time: "Within 24 hours",
      cost: "$19.99",
      description: "Available in select metro areas",
      icon: Package
    }
  ];

  const shippingZones = [
    { zone: "Zone 1", areas: "Major Cities", time: "1-2 days", cost: "Free over $50" },
    { zone: "Zone 2", areas: "Suburban Areas", time: "3-5 days", cost: "Free over $75" },
    { zone: "Zone 3", areas: "Rural Areas", time: "5-7 days", cost: "$5.99" },
    { zone: "International", areas: "Select Countries", time: "7-14 days", cost: "$25.99" }
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="shipping-info-title">
            Shipping Information
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know about our shipping options and delivery process
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Methods */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Shipping Methods
            </h2>
            
            <div className="space-y-4">
              {shippingMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-glideon-red/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-glideon-red" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {method.name}
                            </h3>
                            <Badge variant="outline" className="text-glideon-red border-glideon-red">
                              {method.time}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {method.description}
                          </p>
                          <p className="text-sm font-semibold text-glideon-red">
                            {method.cost}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Free Shipping Info */}
            <Card className="mt-6 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      Free Shipping Available
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Enjoy free standard shipping on orders over $50. No code needed!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Zones */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Shipping Zones & Rates
            </h2>
            
            <div className="space-y-4">
              {shippingZones.map((zone, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {zone.zone}
                      </h3>
                      <Badge variant="secondary">
                        {zone.time}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      {zone.areas}
                    </p>
                    <p className="text-sm font-semibold text-glideon-red">
                      {zone.cost}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Important Shipping Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Orders placed before 2 PM EST ship same day</li>
                  <li>• Orders placed after 2 PM EST ship next business day</li>
                  <li>• No shipments on weekends or holidays</li>
                  <li>• Custom orders may require 2-3 business days</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Signature required for orders over $200</li>
                  <li>• Safe delivery to doorstep when possible</li>
                  <li>• Delivery attempted up to 3 times</li>
                  <li>• Photo confirmation provided for most deliveries</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Tracking number sent via email once shipped</li>
                  <li>• Real-time updates throughout delivery process</li>
                  <li>• SMS notifications available upon request</li>
                  <li>• Track multiple orders from your account dashboard</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Special Handling</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Supplements shipped in temperature-controlled packaging</li>
                  <li>• Fragile items include extra protection</li>
                  <li>• Discreet packaging available upon request</li>
                  <li>• Gift wrapping service available for $4.99</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <Card className="mt-8 border-glideon-red/20 bg-glideon-red/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Questions About Shipping?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our customer service team is here to help with any shipping questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-glideon-red hover:bg-red-700 text-white">
                Contact Support
              </Button>
              <Link href="/track-order">
                <Button variant="outline" className="border-glideon-red text-glideon-red hover:bg-glideon-red hover:text-white">
                  Track Your Order
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}