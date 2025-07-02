import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ContactForm from "@/components/contact-form";
import { api } from "@/lib/api";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Building, 
  Calendar,
  Heart,
  Share,
  Camera,
  Phone,
  Eye,
  Car,
  Dumbbell,
  Waves,
  Shield,
  Trees,
  CableCar
} from "lucide-react";

const amenityIcons: Record<string, any> = {
  "Swimming Pool": Waves,
  "Gym": Dumbbell,
  "Parking": Car,
  "Security": Shield,
  "Garden": Trees,
  "CableCar": CableCar,
};

export default function PropertyDetail() {
  const [match, params] = useRoute("/property/:id");
  const propertyId = params?.id ? parseInt(params.id) : null;

  const { data: property, isLoading, error } = useQuery({
    queryKey: ["/api/properties", propertyId],
    queryFn: () => propertyId ? api.getProperty(propertyId) : null,
    enabled: !!propertyId,
  });

  if (!match || !propertyId) {
    return <div>Property not found</div>;
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded" />
              <div className="bg-gray-200 h-6 rounded w-2/3" />
              <div className="bg-gray-200 h-32 rounded" />
            </div>
            <div className="bg-gray-200 h-96 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
        <p className="text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

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

  const allImages = [
    property.featuredImageUrl,
    ...property.images,
  ].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{property.title} - {property.location}, {property.city} | PropertyHub</title>
        <meta name="description" content={`${property.bhkType} ${property.propertyType} for sale in ${property.location}, ${property.city}. ${property.area} sq ft. Price: ${formatPrice(property.price)}. ${property.description}`} />
        <meta name="keywords" content={`${property.city} property, ${property.bhkType}, ${property.propertyType}, ${property.location}, real estate`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={`${property.title} - ${property.location}, ${property.city}`} />
        <meta property="og:description" content={`${property.bhkType} ${property.propertyType} for sale. ${property.area} sq ft. Price: ${formatPrice(property.price)}`} />
        <meta property="og:image" content={property.featuredImageUrl} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Images */}
        <div className="mb-8">
          {allImages.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {allImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative">
                      <img
                        src={image || "/api/placeholder/800/500"}
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
                      />
                      <div className="absolute top-4 left-4">
                        {getStatusBadge()}
                      </div>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary">
                          <Camera className="h-3 w-3 mr-1" />
                          {allImages.length} Photos
                        </Badge>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          ) : (
            <div className="bg-gray-200 h-96 lg:h-[500px] rounded-2xl flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{property.address || `${property.location}, ${property.city}, ${property.state}`}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{formatPrice(property.price)}</div>
                  {property.pricePerSqft && (
                    <div className="text-gray-500">₹{property.pricePerSqft}/sq ft</div>
                  )}
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                )}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{property.area}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                {property.floor && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{property.floor}</div>
                    <div className="text-sm text-gray-600">Floor</div>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
                {property.bhkType && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{property.bhkType}</span>
                  </div>
                )}
                {property.furnishing && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="capitalize">{property.furnishing}</span>
                  </div>
                )}
                {property.facing && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="capitalize">{property.facing} Facing</span>
                  </div>
                )}
                {property.possessionStatus && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="capitalize">{property.possessionStatus}</span>
                  </div>
                )}
                {property.parkingSpaces && property.parkingSpaces > 0 && (
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{property.parkingSpaces} Parking</span>
                  </div>
                )}
                {property.builderName && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <span>By {property.builderName}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            {property.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            <Separator className="my-6" />

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || Building;
                    return (
                      <div key={index} className="flex items-center">
                        <Icon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-gray-600">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Virtual Tour */}
            {property.virtualTourUrl && (
              <>
                <Separator className="my-6" />
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Virtual Tour</h2>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <iframe
                      src={property.virtualTourUrl}
                      width="100%"
                      height="100%"
                      allowFullScreen
                      className="border-0"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ContactForm
                propertyId={property.id}
                propertyTitle={property.title}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
