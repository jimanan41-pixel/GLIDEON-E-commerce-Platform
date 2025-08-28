import { Link } from "wouter";
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Target, Heart, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Careers() {
  const jobOpenings = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote / New York, NY",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "Join our engineering team to build cutting-edge e-commerce solutions for the fitness industry.",
      requirements: ["5+ years React/Node.js experience", "E-commerce platform experience", "TypeScript proficiency"],
      posted: "2 days ago"
    },
    {
      title: "Digital Marketing Manager",
      department: "Marketing",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$80k - $110k",
      description: "Lead our digital marketing efforts to grow our fitness community and drive customer acquisition.",
      requirements: ["3+ years digital marketing", "Google Ads & Facebook Ads", "Analytics & conversion optimization"],
      posted: "1 week ago"
    },
    {
      title: "Customer Success Representative",
      department: "Customer Service",
      location: "Remote",
      type: "Full-time",
      salary: "$45k - $60k",
      description: "Help our customers achieve their fitness goals by providing exceptional support and guidance.",
      requirements: ["Customer service experience", "Fitness industry knowledge preferred", "Excellent communication skills"],
      posted: "3 days ago"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$130k - $170k",
      description: "Drive product strategy and roadmap for our health and fitness product lines.",
      requirements: ["5+ years product management", "Health/fitness industry experience", "Data-driven decision making"],
      posted: "1 week ago"
    },
    {
      title: "Warehouse Associate",
      department: "Operations",
      location: "Newark, NJ",
      type: "Full-time",
      salary: "$35k - $45k",
      description: "Join our fulfillment team to ensure fast and accurate order processing and shipping.",
      requirements: ["Physical ability to lift 50lbs", "Attention to detail", "Previous warehouse experience preferred"],
      posted: "5 days ago"
    }
  ];

  const companyValues = [
    {
      title: "Fitness First",
      description: "We believe in the transformative power of fitness and help others achieve their health goals",
      icon: Target
    },
    {
      title: "Customer Obsessed",
      description: "Every decision we make puts our customers and their success at the center",
      icon: Heart
    },
    {
      title: "Team Excellence",
      description: "We collaborate, support each other, and celebrate wins together as one team",
      icon: Users
    },
    {
      title: "Continuous Growth",
      description: "We're always learning, improving, and pushing boundaries in everything we do",
      icon: Award
    }
  ];

  const benefits = [
    "Comprehensive health, dental, and vision insurance",
    "401(k) with company matching up to 6%",
    "Unlimited PTO and flexible work arrangements",
    "Free gym membership and fitness equipment discounts",
    "Professional development budget ($2,000/year)",
    "Catered meals and healthy snacks in office",
    "Remote work stipend for home office setup",
    "Parental leave and family support programs"
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="careers-title">
            Join Our Team
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Help us build the future of fitness and wellness. We're looking for passionate people who share our mission 
            to empower others to live healthier, stronger lives.
          </p>
        </div>

        {/* Company Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-glideon-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-glideon-red" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Current Openings
          </h2>
          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <Badge variant="outline" className="text-glideon-red border-glideon-red">
                          {job.department}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Button className="bg-glideon-red hover:bg-red-700 text-white mb-2">
                        Apply Now
                      </Button>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Posted {job.posted}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {job.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Key Requirements:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits & Perks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Benefits & Perks
          </h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-glideon-red rounded-full flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Our Hiring Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Apply", description: "Submit your application and resume through our careers page" },
              { step: 2, title: "Screen", description: "Initial phone/video screening with our recruiting team" },
              { step: 3, title: "Interview", description: "In-depth interviews with hiring manager and team members" },
              { step: 4, title: "Offer", description: "Reference checks, offer letter, and welcome to the team!" }
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-glideon-red text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card className="border-glideon-red/20 bg-glideon-red/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Don't See the Perfect Role?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're always looking for talented people to join our team. Send us your resume and let us know 
              how you'd like to contribute to our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-glideon-red hover:bg-red-700 text-white">
                Send Resume
              </Button>
              <Button variant="outline" className="border-glideon-red text-glideon-red hover:bg-glideon-red hover:text-white">
                Contact HR Team
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              careers@glideon.com | Equal Opportunity Employer
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}