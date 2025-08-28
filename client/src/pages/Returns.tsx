import { Link } from "wouter";
import { ArrowLeft, RotateCcw, Clock, CheckCircle, AlertCircle, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Returns() {
  const returnProcess = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Contact our support team or use your account dashboard to start a return request",
      icon: RotateCcw
    },
    {
      step: 2,
      title: "Package Items",
      description: "Securely package items in original packaging with all accessories included",
      icon: Package
    },
    {
      step: 3,
      title: "Ship Back",
      description: "Use the prepaid return label we provide or drop off at designated locations",
      icon: Package
    },
    {
      step: 4,
      title: "Processing",
      description: "We inspect returned items and process your refund within 3-5 business days",
      icon: CheckCircle
    }
  ];

  const returnPolicies = [
    {
      category: "Supplements & Nutrition",
      timeframe: "30 days",
      condition: "Unopened items in original packaging",
      exceptions: "Opened items accepted if unsatisfied with results",
      color: "green"
    },
    {
      category: "Equipment & Gear",
      timeframe: "45 days",
      condition: "Like-new condition with original packaging",
      exceptions: "Must include all accessories and manuals",
      color: "blue"
    },
    {
      category: "Apparel & Accessories",
      timeframe: "30 days",
      condition: "Unworn with tags attached",
      exceptions: "Underwear and custom items non-returnable",
      color: "purple"
    }
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="returns-title">
            Returns & Exchanges
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Easy returns and exchanges to ensure your complete satisfaction
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-glideon-red/20 bg-glideon-red/5">
          <AlertCircle className="h-4 w-4 text-glideon-red" />
          <AlertDescription className="text-gray-700 dark:text-gray-300">
            <strong>30-Day Satisfaction Guarantee:</strong> If you're not completely satisfied with your purchase, 
            return it within 30 days for a full refund. No questions asked!
          </AlertDescription>
        </Alert>

        {/* Return Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How to Return Items
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnProcess.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="relative">
                  <CardContent className="p-6 text-center">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-glideon-red text-white px-3 py-1">
                        Step {step.step}
                      </Badge>
                    </div>
                    <div className="mt-4 mb-4">
                      <div className="w-16 h-16 bg-glideon-red/10 rounded-full flex items-center justify-center mx-auto">
                        <IconComponent className="h-8 w-8 text-glideon-red" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Return Policies by Category */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Return Policies by Product Category
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {returnPolicies.map((policy, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">
                      {policy.category}
                    </span>
                    <Badge variant="outline" className="text-glideon-red border-glideon-red">
                      {policy.timeframe}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Condition Required:
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {policy.condition}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Special Notes:
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {policy.exceptions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Refund Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-glideon-red" />
                <span>Refund Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Return Processing:</span>
                  <span className="font-semibold">1-2 business days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Refund Processing:</span>
                  <span className="font-semibold">3-5 business days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Bank Processing:</span>
                  <span className="font-semibold">5-10 business days</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white font-semibold">Total Time:</span>
                    <span className="font-bold text-glideon-red">7-15 business days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What We Cover</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Free return shipping labels</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Full refund of purchase price</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Original shipping costs (if item is defective)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Easy exchange for different size/color</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Non-Returnable Items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-glideon-red">Non-Returnable Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Personalized or custom-made products</li>
                <li>• Perishable items and foods</li>
                <li>• Intimate or sanitary goods</li>
                <li>• Gift cards and digital downloads</li>
              </ul>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Items damaged by misuse</li>
                <li>• Products returned after policy timeframe</li>
                <li>• Items missing original packaging</li>
                <li>• Final sale or clearance items</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border-glideon-red/20 bg-glideon-red/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Need Help with a Return?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our customer service team is ready to help make your return process as smooth as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-glideon-red hover:bg-red-700 text-white">
                Start Return Process
              </Button>
              <Button variant="outline" className="border-glideon-red text-glideon-red hover:bg-glideon-red hover:text-white">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}