import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate newsletter subscription
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-gray-900 dark:bg-black text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="newsletter-title">
          Stay Updated
        </h2>
        <p className="text-xl text-gray-300 mb-8" data-testid="newsletter-description">
          Get the latest fitness tips, product launches, and exclusive offers delivered to your inbox
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-glideon-red focus:border-glideon-red"
            data-testid="newsletter-email-input"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-glideon-red hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
            data-testid="newsletter-subscribe"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        <p className="text-gray-400 text-sm mt-4" data-testid="newsletter-privacy">
          No spam, unsubscribe anytime. Privacy policy protected.
        </p>
      </div>
    </section>
  );
}
