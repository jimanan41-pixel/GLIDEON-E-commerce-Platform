import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Target, Users, Zap, Heart, Shield } from "lucide-react";

interface SiteSetting {
  key: string;
  value: string;
  type: string;
  category: string;
}

interface AboutContent {
  title: string;
  content: string;
  mission: string;
  vision: string;
  values: string;
}

const stats = [
  { icon: Users, label: "Happy Customers", value: "50,000+" },
  { icon: Award, label: "Years of Excellence", value: "15+" },
  { icon: Target, label: "Products Available", value: "500+" },
  { icon: Zap, label: "Countries Served", value: "25+" },
];

const values = [
  {
    icon: Heart,
    title: "Health First",
    description: "We prioritize your health and wellness above all else, ensuring every product meets the highest quality standards."
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Every product is thoroughly tested and certified to provide you with safe, effective results you can trust."
  },
  {
    icon: Target,
    title: "Performance Focus",
    description: "We're dedicated to helping you achieve your fitness goals with scientifically-backed supplements and equipment."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Our community of athletes, trainers, and fitness enthusiasts drives everything we do and every product we create."
  }
];

export default function About() {
  // Fetch About Us content from CMS
  const { data: siteSettings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
  });

  // Get About Us content from settings
  const getAboutContent = (): AboutContent => {
    const aboutData = siteSettings?.find(s => s.key === 'about_us');
    if (!aboutData) {
      return {
        title: "About GLIDEON",
        content: "Empowering fitness enthusiasts worldwide with premium supplements, equipment, and unwavering dedication to health and performance.",
        mission: "To empower individuals on their fitness journey by providing premium products and expert guidance.",
        vision: "To become the leading platform for health and fitness enthusiasts worldwide.",
        values: "Quality, Innovation, Customer Success, and Wellness"
      };
    }
    
    try {
      return JSON.parse(aboutData.value || '{}');
    } catch (error) {
      console.error('Error parsing about content:', error);
      return {
        title: "About GLIDEON",
        content: "Empowering fitness enthusiasts worldwide with premium supplements, equipment, and unwavering dedication to health and performance.",
        mission: "To empower individuals on their fitness journey by providing premium products and expert guidance.",
        vision: "To become the leading platform for health and fitness enthusiasts worldwide.",
        values: "Quality, Innovation, Customer Success, and Wellness"
      };
    }
  };

  const aboutContent = getAboutContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 text-white py-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
              alt={aboutContent.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge className="bg-glideon-red text-white mb-4" data-testid="about-badge">
                Est. 2009
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="about-title">
                {aboutContent.title} <span className="text-glideon-red">GLIDEON</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed" data-testid="about-description">
                {aboutContent.content}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center" data-testid={`stat-${index}`}>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-glideon-red rounded-full mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6" data-testid="story-title">
                  Our <span className="text-glideon-red">Story</span>
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300" data-testid="story-content">
                  <p>
                    Founded in 2009 by fitness enthusiasts who were frustrated with the lack of high-quality, 
                    scientifically-backed supplements in the market, GLIDEON began as a small venture with a big vision.
                  </p>
                  <p>
                    Our founders, former competitive athletes themselves, understood the importance of proper nutrition 
                    and quality equipment in achieving peak performance. They set out to create a brand that would 
                    prioritize effectiveness, safety, and transparency above all else.
                  </p>
                  <p>
                    Today, GLIDEON has grown into a global leader in the fitness industry, serving over 50,000 customers 
                    across 25 countries. We continue to innovate and expand our product line while maintaining our 
                    founding principles of quality, integrity, and customer-first approach.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="GLIDEON Story"
                  className="rounded-lg shadow-xl"
                  data-testid="story-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="values-title">
                Our <span className="text-glideon-red">Values</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-testid="values-description">
                {aboutContent.values}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="group hover:shadow-xl transition-shadow duration-300" data-testid={`value-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-glideon-red rounded-lg">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-glideon-red transition-colors">
                            {value.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-glideon-red">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6" data-testid="values-section-title">
              Our Values
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed" data-testid="values-section-content">
              {aboutContent.values}
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <CartModal />
    </div>
  );
}