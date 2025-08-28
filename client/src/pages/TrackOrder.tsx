import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Search, Package, Truck, CheckCircle, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TrackOrder() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  
  // Mock tracking data - in real app this would come from API
  const mockTrackingData = {
    orderNumber: "ORD-GLD-2024-001",
    status: "In Transit",
    estimatedDelivery: "Tomorrow by 6:00 PM",
    carrier: "GLIDEON Express",
    trackingNumber: "GLD123456789",
    currentLocation: "Distribution Center - New York, NY",
    events: [
      {
        date: "2024-01-20",
        time: "3:45 PM",
        status: "Out for Delivery",
        location: "New York, NY",
        description: "Package is out for delivery and will arrive today",
        icon: Truck,
        completed: false,
        current: true
      },
      {
        date: "2024-01-20",
        time: "8:30 AM",
        status: "In Transit",
        location: "Distribution Center - New York, NY",
        description: "Package arrived at distribution center",
        icon: Package,
        completed: true,
        current: false
      },
      {
        date: "2024-01-19",
        time: "11:20 PM",
        status: "In Transit",
        location: "Sorting Facility - Philadelphia, PA",
        description: "Package in transit to next facility",
        icon: Package,
        completed: true,
        current: false
      },
      {
        date: "2024-01-19",
        time: "2:15 PM",
        status: "Shipped",
        location: "GLIDEON Warehouse - Newark, NJ",
        description: "Package shipped from our warehouse",
        icon: Package,
        completed: true,
        current: false
      },
      {
        date: "2024-01-19",
        time: "10:00 AM",
        status: "Processing",
        location: "GLIDEON Warehouse - Newark, NJ",
        description: "Order processed and prepared for shipment",
        icon: Package,
        completed: true,
        current: false
      }
    ]
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setIsTracking(true);
      // Simulate API call delay
      setTimeout(() => {
        setIsTracking(false);
      }, 1000);
    }
  };

  const isValidTracking = trackingNumber.length >= 8 && trackingNumber.toLowerCase().includes('gld');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2 text-glideon-red hover:text-red-700 mb-4" data-testid="back-home">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="track-order-title">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Enter your tracking number to see real-time updates on your order status
          </p>
        </div>

        {/* Tracking Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-glideon-red" />
              <span>Track Your Package</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter tracking number (e.g., GLD123456789)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="text-lg py-3"
                  data-testid="tracking-input"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Tracking numbers start with "GLD" followed by 9 digits
                </p>
              </div>
              <Button 
                type="submit" 
                className="bg-glideon-red hover:bg-red-700 text-white w-full"
                disabled={!trackingNumber.trim() || isTracking}
                data-testid="track-button"
              >
                {isTracking ? "Tracking..." : "Track Package"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {isValidTracking && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Order Number:</span>
                        <span className="ml-2 font-semibold">{mockTrackingData.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Tracking Number:</span>
                        <span className="ml-2 font-semibold">{mockTrackingData.trackingNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Carrier:</span>
                        <span className="ml-2 font-semibold">{mockTrackingData.carrier}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Status:</span>
                        <Badge className="ml-2 bg-blue-100 text-blue-800">
                          {mockTrackingData.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Current Location:</span>
                        <span className="ml-2 font-semibold">{mockTrackingData.currentLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-glideon-red" />
                        <span className="font-semibold text-glideon-red">
                          Estimated Delivery: {mockTrackingData.estimatedDelivery}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockTrackingData.events.map((event, index) => {
                    const IconComponent = event.icon;
                    return (
                      <div key={index} className="flex space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`p-3 rounded-full ${
                            event.current 
                              ? 'bg-glideon-red text-white' 
                              : event.completed 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-400'
                          }`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          {index < mockTrackingData.events.length - 1 && (
                            <div className={`w-0.5 h-16 mt-2 ${
                              event.completed ? 'bg-green-200' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-semibold ${
                              event.current ? 'text-glideon-red' : 'text-gray-900 dark:text-white'
                            }`}>
                              {event.status}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {event.date} at {event.time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {event.location}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                <strong>Delivery Note:</strong> Please ensure someone is available to receive the package. 
                If you're not home, we'll leave it in a safe location or with a neighbor. 
                You'll receive a photo confirmation once delivered.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 border-glideon-red/20 bg-glideon-red/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Need Help with Your Order?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you can't find your tracking number or have questions about your delivery, 
              our customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-glideon-red hover:bg-red-700 text-white">
                Contact Support
              </Button>
              <Link href="/help-center">
                <Button variant="outline" className="border-glideon-red text-glideon-red hover:bg-glideon-red hover:text-white">
                  Visit Help Center
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Where do I find my tracking number?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your tracking number is sent via email once your order ships. You can also find it in your account under "My Orders".
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Why isn't my tracking number working?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  It can take up to 24 hours for tracking information to appear after your order ships. If it's been longer, please contact support.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What if my package is delayed?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Delays can happen due to weather or high volume. We'll keep you updated via email and text if you've opted in for notifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}