import { Link } from "wouter";
import { ArrowLeft, Shield, Eye, Lock, UserCheck, Globe, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  const lastUpdated = "January 15, 2024";
  
  const quickLinks = [
    { title: "Information We Collect", href: "#information-collect" },
    { title: "How We Use Your Information", href: "#how-we-use" },
    { title: "Information Sharing", href: "#information-sharing" },
    { title: "Data Security", href: "#data-security" },
    { title: "Your Rights", href: "#your-rights" },
    { title: "Contact Us", href: "#contact-us" }
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="privacy-policy-title">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated}
          </p>
        </div>

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
            {/* Introduction */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Our Commitment to Privacy
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  At GLIDEON, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit 
                  our website, make a purchase, or interact with our services.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card id="information-collect">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Eye className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Information We Collect
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Personal Information
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                      <li>Name, email address, and contact information</li>
                      <li>Billing and shipping addresses</li>
                      <li>Payment information (processed securely by third-party providers)</li>
                      <li>Account credentials and preferences</li>
                      <li>Customer service communications</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Automatically Collected Information
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                      <li>IP address and browser information</li>
                      <li>Device type and operating system</li>
                      <li>Pages visited and time spent on our site</li>
                      <li>Referring websites and search terms</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card id="how-we-use">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <UserCheck className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How We Use Your Information
                  </h2>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-300">We use the information we collect to:</p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send order confirmations and shipping updates</li>
                    <li>Improve our website and services</li>
                    <li>Send promotional emails (with your consent)</li>
                    <li>Prevent fraud and enhance security</li>
                    <li>Comply with legal obligations</li>
                    <li>Analyze website usage and trends</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card id="information-sharing">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Information Sharing and Disclosure
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li><strong>Service Providers:</strong> With trusted third-party service providers who help us operate our business (payment processors, shipping companies, email services)</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>Safety and Security:</strong> To protect our rights, property, or safety, or that of our users</li>
                    <li><strong>Consent:</strong> When you have given explicit consent for sharing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card id="data-security">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Lock className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Data Security
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    We implement industry-standard security measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li>SSL encryption for all data transmission</li>
                    <li>Secure payment processing through certified providers</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Limited access to personal information on a need-to-know basis</li>
                    <li>Employee training on privacy and security practices</li>
                    <li>Regular software updates and security patches</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300">
                    While we strive to protect your information, no method of transmission over the internet is 100% secure. 
                    We cannot guarantee absolute security but are committed to protecting your data.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card id="your-rights">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Privacy Rights
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Depending on your location, you may have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                    <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                    <li><strong>Restriction:</strong> Request limitation of how we process your information</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300">
                    To exercise these rights, please contact us using the information provided below.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Cookies and Tracking Technologies
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    We use cookies and similar technologies to enhance your browsing experience:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li><strong>Essential Cookies:</strong> Necessary for website functionality and security</li>
                    <li><strong>Performance Cookies:</strong> Help us analyze website usage and improve performance</li>
                    <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300">
                    You can control cookie settings through your browser preferences, but some features may not work properly if cookies are disabled.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Updates to Policy */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Updates to This Policy
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. 
                  We will notify you of any material changes by posting the updated policy on our website and updating the 
                  "Last Updated" date. We encourage you to review this policy periodically.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card id="contact-us" className="border-glideon-red/20 bg-glideon-red/5">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="h-6 w-6 text-glideon-red" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Contact Us
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p><strong>Email:</strong> privacy@glideon.com</p>
                  <p><strong>Phone:</strong> 1-800-GLIDEON (1-800-454-3366)</p>
                  <p><strong>Mail:</strong> GLIDEON Privacy Team<br />123 Fitness Street<br />New York, NY 10001</p>
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