import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <span className="text-6xl font-bold text-glideon-red tracking-wider" data-testid="landing-logo">
            GLIDEON
          </span>
        </div>
        
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardContent className="p-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="landing-title">
              Welcome to GLIDEON
            </h1>
            <p className="text-xl text-gray-300 mb-8" data-testid="landing-description">
              Your premier destination for health and fitness products. Transform your fitness journey with our premium supplements, equipment, and wellness solutions.
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="bg-glideon-red hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 w-full sm:w-auto"
                data-testid="landing-signin"
              >
                Sign In to Continue
              </Button>
              
              <div className="text-gray-400 text-sm">
                New to GLIDEON? Signing in will create your account automatically.
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div data-testid="landing-feature-1">
                <div className="text-3xl font-bold text-glideon-red mb-2">500+</div>
                <div className="text-gray-300">Premium Products</div>
              </div>
              <div data-testid="landing-feature-2">
                <div className="text-3xl font-bold text-glideon-red mb-2">10,000+</div>
                <div className="text-gray-300">Satisfied Customers</div>
              </div>
              <div data-testid="landing-feature-3">
                <div className="text-3xl font-bold text-glideon-red mb-2">4.9</div>
                <div className="text-gray-300">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
