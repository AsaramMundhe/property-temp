import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterOptions {
  budget: string[];
  propertyType: string[];
  bhkType: string[];
  possessionStatus: string;
  amenities: string[];
}

interface PropertyFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export default function PropertyFilters({ onFiltersChange, onClearFilters }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    budget: [],
    propertyType: [],
    bhkType: [],
    possessionStatus: "",
    amenities: [],
  });

  const budgetOptions = [
    { value: "0-5000000", label: "Under ₹50L" },
    { value: "5000000-10000000", label: "₹50L - ₹1Cr" },
    { value: "10000000-20000000", label: "₹1Cr - ₹2Cr" },
    { value: "20000000-", label: "Above ₹2Cr" },
  ];

  const propertyTypeOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "plot", label: "Plot" },
    { value: "commercial", label: "Commercial" },
  ];

  const bhkOptions = [
    { value: "1BHK", label: "1 BHK" },
    { value: "2BHK", label: "2 BHK" },
    { value: "3BHK", label: "3 BHK" },
    { value: "4+BHK", label: "4+ BHK" },
  ];

  const amenityOptions = [
    "Swimming Pool",
    "Gym",
    "Parking",
    "Garden",
    "Security",
    "Elevator",
    "Club House",
    "Children's Play Area",
  ];

  const handleCheckboxChange = (category: keyof FilterOptions, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    
    if (Array.isArray(newFilters[category])) {
      const currentArray = newFilters[category] as string[];
      if (checked) {
        newFilters[category] = [...currentArray, value] as any;
      } else {
        newFilters[category] = currentArray.filter(item => item !== value) as any;
      }
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRadioChange = (category: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [category]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleBhkClick = (value: string) => {
    const newFilters = { ...filters };
    const currentBhk = newFilters.bhkType as string[];
    
    if (currentBhk.includes(value)) {
      newFilters.bhkType = currentBhk.filter(item => item !== value);
    } else {
      newFilters.bhkType = [...currentBhk, value];
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterOptions = {
      budget: [],
      propertyType: [],
      bhkType: [],
      possessionStatus: "",
      amenities: [],
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Range */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Budget Range</h4>
          <div className="space-y-2">
            {budgetOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`budget-${option.value}`}
                  checked={filters.budget.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("budget", option.value, checked as boolean)
                  }
                />
                <Label htmlFor={`budget-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Property Type */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Property Type</h4>
          <div className="space-y-2">
            {propertyTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${option.value}`}
                  checked={filters.propertyType.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("propertyType", option.value, checked as boolean)
                  }
                />
                <Label htmlFor={`type-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* BHK */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">BHK</h4>
          <div className="grid grid-cols-2 gap-2">
            {bhkOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.bhkType.includes(option.value) ? "default" : "outline"}
                size="sm"
                onClick={() => handleBhkClick(option.value)}
                className="text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Possession Status */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Possession</h4>
          <RadioGroup
            value={filters.possessionStatus}
            onValueChange={(value) => handleRadioChange("possessionStatus", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ready" id="ready" />
              <Label htmlFor="ready" className="text-sm">Ready to Move</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="under-construction" id="under-construction" />
              <Label htmlFor="under-construction" className="text-sm">Under Construction</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Amenities */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Amenities</h4>
          <div className="space-y-2">
            {amenityOptions.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("amenities", amenity, checked as boolean)
                  }
                />
                <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full">Apply Filters</Button>
          <Button variant="outline" className="w-full" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
