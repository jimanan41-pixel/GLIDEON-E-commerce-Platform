import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PromoSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 24,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-glideon-red to-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="promo-title">
              Limited Time Offer
            </h2>
            <p className="text-xl mb-6" data-testid="promo-description">
              Get 25% off on all supplements when you spend over $100. Free shipping on orders above $50.
            </p>
            <div className="flex items-center space-x-6 mb-8" data-testid="countdown">
              <div className="text-center">
                <div className="text-3xl font-bold" data-testid="countdown-days">{timeLeft.days}</div>
                <div className="text-sm">DAYS</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold" data-testid="countdown-hours">{timeLeft.hours}</div>
                <div className="text-sm">HOURS</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold" data-testid="countdown-minutes">{timeLeft.minutes}</div>
                <div className="text-sm">MIN</div>
              </div>
            </div>
            <Button 
              className="bg-white text-glideon-red hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200"
              onClick={() => window.location.href = "/products"}
              data-testid="promo-shop-now"
            >
              Shop Now & Save
            </Button>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Promotional fitness products" 
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-gray-900 font-bold text-2xl p-6 rounded-2xl shadow-lg transform rotate-3" data-testid="promo-badge">
              25% OFF
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
