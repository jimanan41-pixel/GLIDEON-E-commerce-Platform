import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Store",
    details: ["123 Fitness Avenue", "Health District, HD 12345", "United States"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+1 (555) 123-4567", "Mon-Fri: 9AM-6PM EST", "Sat: 10AM-4PM EST"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["support@glideon.com", "sales@glideon.com", "info@glideon.com"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Monday - Friday: 9AM-6PM", "Saturday: 10AM-4PM", "Sunday: Closed"],
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 text-white py-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
              alt="Contact GLIDEON"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="contact-title">
              Contact <span className="text-glideon-red">GLIDEON</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto" data-testid="contact-description">
              We're here to help with your fitness journey. Reach out to us for product questions, support, or just to say hello.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300" data-testid={`contact-info-${index}`}>
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-glideon-red rounded-full mb-4">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-gray-600 dark:text-gray-300 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" data-testid="form-title">
                  Send us a <span className="text-glideon-red">Message</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8" data-testid="form-description">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1"
                            data-testid="contact-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1"
                            data-testid="contact-email"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="mt-1"
                          data-testid="contact-subject"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="Tell us how we can help you..."
                          data-testid="contact-message"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-glideon-red hover:bg-red-700 text-white font-semibold py-3"
                        data-testid="contact-submit"
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Map & Additional Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" data-testid="location-title">
                  Visit Our <span className="text-glideon-red">Location</span>
                </h2>
                
                {/* Map Placeholder */}
                <Card className="mb-6">
                  <CardContent className="p-0">
                    <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center" data-testid="map-placeholder">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-300">Interactive Map</p>
                        <p className="text-sm text-gray-500">123 Fitness Avenue, Health District</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ */}
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="faq-title">Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4" data-testid="faq-content">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          How long does shipping take?
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Standard shipping takes 3-7 business days. Express shipping is available for 1-2 day delivery.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Do you offer returns?
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Yes! We offer a 30-day return policy on all unopened products in original packaging.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Can I track my order?
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Absolutely! You'll receive a tracking number via email once your order ships.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartModal />
    </div>
  );
}