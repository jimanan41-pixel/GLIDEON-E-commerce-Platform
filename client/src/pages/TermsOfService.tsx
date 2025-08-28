import { Link } from "wouter";
import { ArrowLeft, FileText, Scale, AlertTriangle, Shield, CreditCard, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TermsOfService() {
  const lastUpdated = "January 15, 2024";
  
  const quickLinks = [
    { title: "Acceptance of Terms", href: "#acceptance" },
    { title: "Use of Website", href: "#website-use" },
    { title: "Orders and Payment", href: "#orders-payment" },
    { title: "Shipping and Returns", href: "#shipping-returns" },
    { title: "Product Information", href: "#product-info" },
    { title: "Limitation of Liability", href: "#liability" },
    { title: "Contact Information", href: "#contact" }
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="terms-of-service-title">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Please read these terms carefully before using our website or services.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-glideon-red/20 bg-glideon-red/5">
          <AlertTriangle className="h-4 w-4 text-glideon-red" />
          <AlertDescription className="text-gray-700 dark:text-gray-300">
            <strong>Important:</strong> By accessing and using this website, you accept and agree to be bound by the terms and 
            provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="block text-sm text-glideon-red hover:text-red-700 transition-colors"
                    >
                      {link.title}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Acceptance of Terms */}
            <Card id="acceptance">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Acceptance of Terms
                  </h2>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    Welcome to GLIDEON. These Terms of Service ("Terms") govern your use of our website located at glideon.com 
                    (the "Service") operated by GLIDEON ("us", "we", or "our").
                  </p>
                  <p>
                    Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. 
                    These Terms apply to all visitors, users and others who access or use the Service.
                  </p>
                  <p>
                    By accessing or using our Service you agree to be bound by these Terms. If you disagree with any part of 
                    these terms then you may not access the Service.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Use of Website */}
            <Card id="website-use">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Use of Website
                  </h2>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Permitted Use
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    You may use our website for lawful purposes only. You agree to use the Service only for purposes that are 
                    legal, proper and in accordance with these Terms and any applicable laws or regulations.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Prohibited Activities
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">You agree not to:</p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Use the service for any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>Violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                    <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>Submit false or misleading information</li>
                    <li>Upload or transmit viruses or any other type of malicious code</li>
                    <li>Spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                    <li>Use the service for any obscene or immoral purpose</li>
                    <li>Interfere with or circumvent the security features of the Service</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Orders and Payment */}
            <Card id="orders-payment">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Orders and Payment
                  </h2>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Acceptance
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order 
                    for any reason at any time. We may require additional verifications or information before accepting any order.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pricing and Payment
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li>All prices are subject to change without notice</li>
                    <li>Prices do not include applicable taxes, duties, or shipping charges</li>
                    <li>Currently, we accept Cash on Delivery (COD) as the primary payment method</li>
                    <li>You are responsible for providing accurate billing and shipping information</li>
                    <li>We reserve the right to correct any pricing errors on our website</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Cancellation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    You may cancel your order before it has been shipped. Once an order has been shipped, 
                    it cannot be cancelled, but you may return the products according to our return policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping and Returns */}
            <Card id="shipping-returns">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Package className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Shipping and Returns
                  </h2>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Shipping
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Delivery times are estimates and not guaranteed</li>
                    <li>We are not responsible for delays caused by shipping carriers</li>
                    <li>Risk of loss and title pass to you upon delivery to the carrier</li>
                    <li>We may require a signature confirmation for high-value orders</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Returns and Exchanges
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Most items can be returned within 30 days of purchase</li>
                    <li>Items must be in original condition with all packaging and accessories</li>
                    <li>Some items may not be returnable for health and safety reasons</li>
                    <li>Return shipping costs may apply depending on the reason for return</li>
                    <li>Refunds will be processed to the original payment method</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card id="product-info">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Product Information and Disclaimers
                </h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Product Descriptions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant 
                    that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Health and Safety Disclaimers
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Our products are not intended to diagnose, treat, cure, or prevent any disease</li>
                    <li>Consult with a healthcare professional before starting any supplement regimen</li>
                    <li>Individual results may vary</li>
                    <li>Always read product labels and follow instructions</li>
                    <li>Stop use and consult a doctor if adverse reactions occur</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Age Restrictions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Some products may have age restrictions. You must be 18 years or older to purchase certain items. 
                    By making a purchase, you represent that you meet all age requirements for the products ordered.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Intellectual Property
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    The Service and its original content, features and functionality are and will remain the exclusive property 
                    of GLIDEON and its licensors. The Service is protected by copyright, trademark, and other laws.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our trademarks and trade dress may not be used in connection with any product or service without our 
                    prior written consent.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card id="liability">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Scale className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Limitation of Liability
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    In no event shall GLIDEON, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                    be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                    limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use 
                    of the Service.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our total liability to you for all claims arising from or relating to the Service shall not exceed 
                    the amount you paid us in the twelve (12) months preceding the claim.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Governing Law
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  These Terms shall be interpreted and governed by the laws of the State of New York, without regard to 
                  its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not 
                  be considered a waiver of those rights.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Changes to Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card id="contact" className="border-glideon-red/20 bg-glideon-red/5">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p><strong>Email:</strong> legal@glideon.com</p>
                  <p><strong>Phone:</strong> 1-800-GLIDEON (1-800-454-3366)</p>
                  <p><strong>Mail:</strong> GLIDEON Legal Department<br />123 Fitness Street<br />New York, NY 10001</p>
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