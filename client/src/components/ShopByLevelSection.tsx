import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Award, Target } from "lucide-react";
import { Link } from "wouter";

const fitnessLevels = [
  {
    id: 1,
    level: "Beginner",
    icon: Star,
    title: "Getting Started",
    description: "Perfect for those new to fitness. Essential supplements and basic equipment to begin your journey.",
    features: ["Basic Protein Powder", "Multivitamins", "Resistance Bands", "Yoga Mats"],
    color: "bg-green-500",
    buttonText: "Start Your Journey"
  },
  {
    id: 2,
    level: "Intermediate", 
    icon: TrendingUp,
    title: "Building Momentum",
    description: "Ready to level up? Advanced supplements and equipment for serious progress.",
    features: ["Pre-Workout", "Creatine", "Dumbbells", "Recovery Tools"],
    color: "bg-blue-500",
    buttonText: "Level Up Now"
  },
  {
    id: 3,
    level: "Advanced",
    icon: Award,
    title: "Peak Performance",
    description: "For elite athletes and serious lifters. Professional-grade supplements and equipment.",
    features: ["Mass Gainers", "BCAAs", "Olympic Equipment", "Competition Gear"],
    color: "bg-purple-500",
    buttonText: "Go Pro"
  },
  {
    id: 4,
    level: "Professional",
    icon: Target,
    title: "Elite Training",
    description: "Competition-ready supplements and commercial-grade equipment for the ultimate performance.",
    features: ["Custom Stacks", "Premium Formulas", "Commercial Equipment", "Performance Analysis"],
    color: "bg-glideon-red",
    buttonText: "Train Like a Pro"
  }
];

export default function ShopByLevelSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="shop-by-level-title">
            Shop by <span className="text-glideon-red">Fitness Level</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-testid="shop-by-level-description">
            Find the perfect products for your current fitness level. Whether you're just starting out or training like a pro, we have everything you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fitnessLevels.map((level) => {
            const Icon = level.icon;
            return (
              <Card 
                key={level.id} 
                className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                data-testid={`level-card-${level.level.toLowerCase()}`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 ${level.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <CardContent className="relative p-6 h-full flex flex-col">
                  {/* Icon and Level */}
                  <div className="flex items-center mb-4">
                    <div className={`${level.color} p-3 rounded-full text-white mr-3`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{level.level}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{level.title}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    {level.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {level.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <div className="w-1.5 h-1.5 bg-glideon-red rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/products?fitnessLevel=${level.level.toLowerCase()}`}>
                    <Button 
                      className={`${level.color} hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 w-full mt-auto`}
                      data-testid={`level-button-${level.level.toLowerCase()}`}
                    >
                      {level.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}