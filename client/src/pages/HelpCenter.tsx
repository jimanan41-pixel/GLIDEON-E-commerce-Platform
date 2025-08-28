import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Search, HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "Orders & Shipping",
      faqs: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-7 business days. Express shipping (1-3 business days) is available for an additional fee. Delivery times may vary based on your location."
        },
        {
          question: "Can I track my order?",
          answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order by visiting the 'Track Order' page on our website."
        },
        {
          question: "What if my order is damaged or missing items?",
          answer: "We're sorry this happened! Please contact our customer service team within 48 hours of delivery with photos of the damaged items. We'll arrange a replacement or refund immediately."
        }
      ]
    },
    {
      title: "Products & Supplements",
      faqs: [
        {
          question: "Are your supplements third-party tested?",
          answer: "Yes, all our supplements undergo rigorous third-party testing for purity, potency, and safety. Each product comes with a certificate of analysis available upon request."
        },
        {
          question: "How do I know which supplement is right for me?",
          answer: "We recommend consulting with a healthcare professional before starting any supplement regimen. Our product descriptions include detailed information about intended use and benefits."
        },
        {
          question: "What's your return policy on opened supplements?",
          answer: "We accept returns on opened supplements within 30 days of purchase if you're not satisfied. Please see our return policy page for complete details."
        }
      ]
    },
    {
      title: "Account & Payment",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign In' at the top of any page and select 'Create Account'. You can also create an account during checkout. Account creation is free and gives you access to order tracking and exclusive offers."
        },
        {
          question: "What payment methods do you accept?",
          answer: "Currently, we accept Cash on Delivery (COD) for all orders. Additional payment methods including credit cards and digital wallets will be available soon."
        },
        {
          question: "Is my personal information secure?",
          answer: "Absolutely. We use industry-standard encryption to protect your personal and payment information. We never share your data with third parties without your consent."
        }
      ]
    }
  ];

  const quickHelp = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      action: "Start Chat",
      available: "Mon-Fri 9AM-6PM EST"
    },
    {
      title: "Phone Support",
      description: "Speak directly with a specialist",
      icon: Phone,
      action: "Call Now",
      available: "1-800-GLIDEON"
    },
    {
      title: "Email Support",
      description: "Get detailed help via email",
      icon: Mail,
      action: "Send Email",
      available: "support@glideon.com"
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="help-center-title">
            Help Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to your questions or get in touch with our support team
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3"
              data-testid="help-search-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            
            {filteredFAQs.length > 0 ? (
              <div className="space-y-6">
                {filteredFAQs.map((category, categoryIndex) => (
                  <Card key={categoryIndex}>
                    <CardHeader>
                      <CardTitle className="text-xl text-glideon-red">
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible>
                        {category.faqs.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 dark:text-gray-300">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try searching with different keywords or browse our categories
                </p>
              </div>
            )}
          </div>

          {/* Quick Help Sidebar */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Need More Help?
            </h2>
            
            <div className="space-y-4">
              {quickHelp.map((help, index) => {
                const IconComponent = help.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-glideon-red/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-glideon-red" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {help.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {help.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {help.available}
                          </p>
                          <Button size="sm" className="bg-glideon-red hover:bg-red-700 text-white">
                            {help.action}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Popular Links */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Popular Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/shipping-info" className="block text-glideon-red hover:text-red-700 transition-colors">
                    Shipping Information
                  </Link>
                  <Link href="/returns" className="block text-glideon-red hover:text-red-700 transition-colors">
                    Returns & Exchanges
                  </Link>
                  <Link href="/track-order" className="block text-glideon-red hover:text-red-700 transition-colors">
                    Track Your Order
                  </Link>
                  <Link href="/privacy-policy" className="block text-glideon-red hover:text-red-700 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms-of-service" className="block text-glideon-red hover:text-red-700 transition-colors">
                    Terms of Service
                  </Link>
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