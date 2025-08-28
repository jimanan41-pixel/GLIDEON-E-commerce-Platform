import { X, Star, Zap, Clock } from "lucide-react";
import { useState } from "react";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-glideon-red to-red-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Main Offer */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold" data-testid="banner-discount">
                    20% OFF
                  </span>
                  <span className="text-sm opacity-90">
                    Your First Order
                  </span>
                </div>
                <div className="text-xs opacity-80">
                  Code: GLIDEON20
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-8 bg-white/30"></div>

            {/* Additional Benefits */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span className="text-sm">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Fast Shipping</span>
              </div>
            </div>
          </div>

          {/* CTA and Close */}
          <div className="flex items-center space-x-4">
            <button 
              className="bg-white text-glideon-red font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm"
              onClick={() => window.location.href = "/products"}
              data-testid="banner-shop-now"
            >
              Shop Now
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
              data-testid="banner-close"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Content */}
      <div className="md:hidden relative z-10 px-4 pb-2">
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3" />
            <span>Premium Quality</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Fast Shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
}