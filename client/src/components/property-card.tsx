import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Camera, Phone, Eye, MapPin, Bed, Square, Calendar } from "lucide-react";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  showInterestButton?: boolean;
  variant?: "card" | "list";
}

export default function PropertyCard({ 
  property, 
  showInterestButton = true, 
  variant = "card" 
}: PropertyCardProps) {
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} L`;
    }
    return `₹${num.toLocaleString()}`;
  };

  const getStatusBadge = () => {
    if (property.isFeatured) {
      return <Badge className="bg-green-500 hover:bg-green-600">Featured</Badge>;
    }
    if (property.projectStatus === "ongoing") {
      return <Badge variant="destructive">Hot Deal</Badge>;
    }
    if (property.projectStatus === "completed" && property.possessionStatus === "ready") {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Ready</Badge>;
    }
    return null;
  };

  if (variant === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="relative">
              <img
                src={property.featuredImageUrl || "/api/placeholder/400/300"}
                alt={property.title}
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                {getStatusBadge()}
              </div>
              <div className="absolute top-4 right-4">
                <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary">
                  <Camera className="h-3 w-3 mr-1" />
                  {property.images.length || 0} Photos
                </Badge>
              </div>
            </div>
          </div>
          <CardContent className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{property.title}</h3>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.location}, {property.city}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</div>
                {property.pricePerSqft && (
                  <div className="text-sm text-gray-500">₹{property.pricePerSqft}/sq ft</div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              {property.bhkType && (
                <span>
                  <Bed className="h-4 w-4 mr-1 inline" />
                  {property.bhkType}
                </span>
              )}
              <span>
                <Square className="h-4 w-4 mr-1 inline" />
                {property.area} sq ft
              </span>
              {property.floor && (
                <span>
                  <Calendar className="h-4 w-4 mr-1 inline" />
                  Floor {property.floor}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 mb-4">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  Shortlist
                </Button>
                <Button variant="ghost" size="sm">
                  <Camera className="h-4 w-4 mr-1" />
                  Virtual Tour
                </Button>
              </div>
              <div className="flex space-x-3">
                {showInterestButton && (
                  <Button size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                )}
                <Link href={`/property/${property.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow group property-card">
      <div className="relative">
        <img
          src={property.featuredImageUrl || "/api/placeholder/400/300"}
          alt={property.title}
          className="w-full h-64 object-cover property-image"
        />
        <div className="absolute top-4 left-4">
          {getStatusBadge()}
        </div>
        <div className="absolute top-4 right-4">
          <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary">
            <Camera className="h-3 w-3 mr-1" />
            {property.images.length || 0} Photos
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</div>
            {property.pricePerSqft && (
              <div className="text-sm text-gray-500">₹{property.pricePerSqft}/sq ft</div>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{property.location}, {property.city}</span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          {property.bhkType && (
            <span>
              <Bed className="h-4 w-4 mr-1 inline" />
              {property.bhkType}
            </span>
          )}
          <span>
            <Square className="h-4 w-4 mr-1 inline" />
            {property.area} sq ft
          </span>
          <span>
            <Calendar className="h-4 w-4 mr-1 inline" />
            {property.possessionStatus === "ready" ? "Ready" : "Under Construction"}
          </span>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex space-x-3">
          {showInterestButton && (
            <Button className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
          )}
          <Link href={`/property/${property.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
