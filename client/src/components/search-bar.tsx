import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBarProps {
  onSearch?: (params: any) => void;
  showBackground?: boolean;
}

export default function SearchBar({ onSearch, showBackground = true }: SearchBarProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ value: string; label: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length > 2) {
      fetchSuggestions(debouncedSearchQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchQuery]);

  const fetchSuggestions = async (query: string) => {
    try {
      const results = await api.getSearchSuggestions(query);
      setSuggestions(results);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.append("location", searchQuery);
    if (propertyType && propertyType !== "all") params.append("propertyType", propertyType);
    if (budget && budget !== "any") {
      const [min, max] = budget.split("-");
      if (min) params.append("minPrice", min);
      if (max) params.append("maxPrice", max);
    }

    if (onSearch) {
      onSearch({
        location: searchQuery,
        propertyType,
        budget,
      });
    } else {
      setLocation(`/properties?${params.toString()}`);
    }
  };

  const handleSuggestionClick = (suggestion: { value: string; label: string }) => {
    setSearchQuery(suggestion.value);
    setShowSuggestions(false);
  };

  const containerClass = showBackground
    ? "bg-white rounded-2xl p-6 shadow-2xl max-w-5xl mx-auto"
    : "bg-gray-50 rounded-xl p-6";

  return (
    <div className={containerClass}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Location Search */}
        <div className="flex-1 relative">
          <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Enter city, area, or landmark"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <MapPin className="inline h-4 w-4 mr-2 text-gray-400" />
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Property Type */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-2">Property Type</label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="plot">Plot</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-2">Budget</label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger>
              <SelectValue placeholder="Any Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Budget</SelectItem>
              <SelectItem value="0-5000000">Under ₹50L</SelectItem>
              <SelectItem value="5000000-10000000">₹50L - ₹1Cr</SelectItem>
              <SelectItem value="10000000-20000000">₹1Cr - ₹2Cr</SelectItem>
              <SelectItem value="20000000-">Above ₹2Cr</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button onClick={handleSearch} className="px-8 py-3 h-11">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
