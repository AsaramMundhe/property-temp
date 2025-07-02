import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/search-bar";
import PropertyCard from "@/components/property-card";
import { api } from "@/lib/api";
import { TrendingUp, Users, MapPin, Award } from "lucide-react";

export default function Home() {
  const { data: featuredProperties, isLoading } = useQuery({
    queryKey: ["/api/properties/featured"],
    queryFn: () => api.getFeaturedProperties(6),
  });

  const stats = [
    { icon: TrendingUp, label: "Verified Properties", value: "15,000+", color: "text-blue-600" },
    { icon: Users, label: "Happy Customers", value: "25,000+", color: "text-green-600" },
    { icon: MapPin, label: "Cities Covered", value: "50+", color: "text-red-600" },
    { icon: Award, label: "Years Experience", value: "10+", color: "text-gray-800" },
  ];

  return (
    <>
      <Helmet>
        <title>PropertyHub - Find Your Dream Property | Premium Real Estate Platform</title>
        <meta name="description" content="Discover premium properties across Mumbai, Delhi, Bangalore, and more with verified listings and expert guidance. Find your dream home today." />
        <meta name="keywords" content="real estate, property search, buy property, rent property, premium properties, Mumbai, Delhi, Bangalore" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream<br />
              <span className="text-yellow-400">Property</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
              Discover premium properties across Mumbai, Delhi, Bangalore, and more with verified listings and expert guidance.
            </p>
          </div>
          
          <SearchBar />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`text-3xl lg:text-4xl font-bold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked premium properties with exceptional value and prime locations
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="bg-gray-200 h-64 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="bg-gray-200 h-6 rounded animate-pulse" />
                      <div className="bg-gray-200 h-4 rounded animate-pulse" />
                      <div className="bg-gray-200 h-4 w-2/3 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties?.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  showInterestButton={true}
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/properties">
              <Button variant="outline" size="lg">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream homes with PropertyHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button size="lg" variant="secondary">
                Browse Properties
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              Post Your Property
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
