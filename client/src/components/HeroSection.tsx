import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  isActive: boolean;
  createdAt: string;
}

interface SiteSetting {
  key: string;
  value: string;
  type: string;
  category: string;
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, navigate] = useLocation();

  // Fetch banners from database
  const { data: siteSettings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
  });

  // Get active banners from settings
  const getActiveBanners = (): Banner[] => {
    const bannersData = siteSettings?.find(s => s.key === 'home_banners');
    if (!bannersData) return [];
    
    try {
      const banners = JSON.parse(bannersData.value || '[]');
      return Array.isArray(banners) ? banners.filter(banner => banner.isActive) : [];
    } catch (error) {
      console.error('Error parsing banners:', error);
      return [];
    }
  };

  const activeBanners = getActiveBanners();

  useEffect(() => {
    if (activeBanners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeBanners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleButtonClick = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
    }
  };

  // Show fallback if no banners are available
  if (!activeBanners.length) {
    return (
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 text-white  maxhytslider">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-glideon-red">GLIDEON</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Your premier destination for health and fitness products.
            </p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-glideon-red hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg font-semibold"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 text-white maxhytslider">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover opacity-100"
            />
          </div>
        ))}
        {/* via-black/70 className="absolute inset-0 bg-gradient-to-r from-black  to-transparent" */}
        <div ></div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200"
        data-testid="hero-prev"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200"
        data-testid="hero-next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {activeBanners.map((banner, index) => (
          <button
            key={banner.id}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentSlide ? 'bg-glideon-red' : 'bg-white/50'
            }`}
            data-testid={`hero-indicator-${index}`}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 
            className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" 
            data-testid="hero-title"
            dangerouslySetInnerHTML={{ 
              __html: activeBanners[currentSlide]?.title.replace(/FITNESS|SUPPLEMENTS|EQUIPMENT/g, 
                (match) => `<span class="text-glideon-red">${match}</span>`
              ) || ''
            }}
          />
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed" data-testid="hero-description">
            {activeBanners[currentSlide]?.subtitle}
          </p>
         
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center" style={{marginLeft:'-50px'}}>
            {activeBanners[currentSlide]?.buttonText && activeBanners[currentSlide]?.buttonUrl && (
              <Button 
                onClick={() => handleButtonClick(activeBanners[currentSlide].buttonUrl)}
                className="mt20 bg-glideon-red hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-300 whitespace-nowrap" 
                data-testid="hero-cta-button"
              >
                {activeBanners[currentSlide].buttonText}
              </Button>
            )}
            {/* <span className="text-gray-400 text-lg">or explore our collections below</span> */}
          </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 bg-black/40 backdrop-blur-sm border-t border-white/10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div data-testid="stat-products">
              <div className="text-3xl font-bold text-glideon-red">500+</div>
              <div className="text-gray-300">Products</div>
            </div>
            <div data-testid="stat-customers">
              <div className="text-3xl font-bold text-glideon-red">10,000+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div data-testid="stat-rating">
              <div className="text-3xl font-bold text-glideon-red">4.9</div>
              <div className="text-gray-300">Rating</div>
            </div>
            <div data-testid="stat-shipping">
              <div className="text-3xl font-bold text-glideon-red">Free</div>
              <div className="text-gray-300">Shipping</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
