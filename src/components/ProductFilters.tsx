"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { fecthAllBrands } from "@/lib/api/brands";
import { Brand } from "@/lib/types";
import { Divide } from "lucide-react";

interface ProductFiltersProps {
  filters: {
    category: string;
    size: string;
    _sort: string;
    brands: string[];
  };
  setFilters: (filters: any) => void;
}

export default function ProductFilters({
  filters,
  setFilters,
}: ProductFiltersProps) {
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: fecthAllBrands,
  });

  const handleBrandChange = (brand: string) => {
    if (filters.brands.includes(brand)) {
      setFilters({
        ...filters,
        brands: filters.brands.filter((b) => b !== brand),
      });
    } else {
      setFilters({
        ...filters,
        brands: [...filters.brands, brand],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <Accordion
          type="multiple"
          defaultValue={["category", "size", "brand", "sort"]}
          className="w-full"
        >
          <AccordionItem value="category">
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="category-all" />
                  <Label htmlFor="category-all">All Products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="women" id="category-women" />
                  <Label htmlFor="category-women">Women</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="men" id="category-men" />
                  <Label htmlFor="category-men">Men</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brand">
            <AccordionTrigger>Brand</AccordionTrigger>
            <AccordionContent>
              {brands ? (
                <div className="space-y-2">
                  {brands.map((brand: Brand) => (
                    <div
                      key={brand.id}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={filters.brands.includes(brand.value)}
                        onCheckedChange={() => handleBrandChange(brand.value)}
                      />
                      <Label htmlFor={`brand-${brand}`}>{brand.value}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">no brands to show</div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="size">
            <AccordionTrigger>Size</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={filters.size}
                onValueChange={(value) =>
                  setFilters({ ...filters, size: value })
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="size-all" />
                  <Label htmlFor="size-all">All Sizes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xs" id="size-xs" />
                  <Label htmlFor="size-xs">XS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="s" id="size-s" />
                  <Label htmlFor="size-s">S</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="m" id="size-m" />
                  <Label htmlFor="size-m">M</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="l" id="size-l" />
                  <Label htmlFor="size-l">L</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xl" id="size-xl" />
                  <Label htmlFor="size-xl">XL</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sort">
            <AccordionTrigger>Sort By</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={filters._sort}
                onValueChange={(value) =>
                  setFilters({ ...filters, _sort: value })
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="sort-newest" />
                  <Label htmlFor="sort-newest">Newest First</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-low" id="sort-price-low" />
                  <Label htmlFor="sort-price-low">Price: Low to High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-high" id="sort-price-high" />
                  <Label htmlFor="sort-price-high">Price: High to Low</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
