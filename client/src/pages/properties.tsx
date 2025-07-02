import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import SearchBar from "@/components/search-bar";
import PropertyCard from "@/components/property-card";
import PropertyFilters from "@/components/property-filters";
import { api } from "@/lib/api";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import type { PropertySearchParams } from "@shared/schema";

export default function Properties() {
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const [searchParams, setSearchParams] = useState<PropertySearchParams>({
    page: parseInt(urlParams.get("page") || "1"),
    limit: 12,
    location: urlParams.get("location") || undefined,
    propertyType: urlParams.get("propertyType") || undefined,
    city: urlParams.get("city") || undefined,
    sortBy: (urlParams.get("sortBy") as any) || "createdAt",
    sortOrder: (urlParams.get("sortOrder") as any) || "desc",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/properties", searchParams],
    queryFn: () => api.getProperties(searchParams),
  });

  const handleFiltersChange = (filters: any) => {
    const newParams = {
      ...searchParams,
      page: 1, // Reset to first page when filters change
      ...filters,
    };
    setSearchParams(newParams);
  };

  const handleSortChange = (sortBy: string) => {
    setSearchParams({
      ...searchParams,
      sortBy: sortBy as any,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({
      ...searchParams,
      page,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = data ? Math.ceil(data.total / searchParams.limit) : 0;

  return (
    <>
      <Helmet>
        <title>Property Listings - Find Your Perfect Home | PropertyHub</title>
        <meta name="description" content="Browse thousands of verified property listings. Find apartments, villas, plots, and commercial properties with advanced search and filters." />
        <meta name="keywords" content="property listings, real estate search, apartments, villas, buy property, rent property" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Search Section */}
        <section className="bg-white border-b py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchBar onSearch={handleFiltersChange} showBackground={false} />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Property Listings
              {data && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  ({data.total.toLocaleString()} properties found)
                </span>
              )}
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <Select value={searchParams.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Newest First</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="area">Area: Largest First</SelectItem>
                  <SelectItem value="viewCount">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden md:flex border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
              <PropertyFilters
                onFiltersChange={handleFiltersChange}
                onClearFilters={() => {
                  setSearchParams({
                    page: 1,
                    limit: 12,
                    sortBy: "createdAt",
                    sortOrder: "desc",
                  });
                }}
              />
            </div>

            {/* Properties Grid/List */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-white border rounded-2xl p-6 animate-pulse">
                      <div className="flex">
                        <div className="w-1/3 bg-gray-200 h-64 rounded-xl mr-6" />
                        <div className="flex-1 space-y-4">
                          <div className="bg-gray-200 h-6 rounded" />
                          <div className="bg-gray-200 h-4 rounded w-2/3" />
                          <div className="bg-gray-200 h-4 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Failed to load properties. Please try again.</p>
                </div>
              ) : !data || data.properties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No properties found matching your criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchParams({
                        page: 1,
                        limit: 12,
                        sortBy: "createdAt",
                        sortOrder: "desc",
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                    : "space-y-6"
                  }>
                    {data.properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        variant={viewMode}
                        showInterestButton={true}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => handlePageChange(Math.max(1, searchParams.page - 1))}
                              className={searchParams.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                  isActive={page === searchParams.page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => handlePageChange(Math.min(totalPages, searchParams.page + 1))}
                              className={searchParams.page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
