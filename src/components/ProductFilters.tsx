"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface ProductFiltersProps {
  filters: {
    category: string
    size: string
    sort: string
    brands: string[]
  }
  setFilters: (filters: any) => void
}

export default function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
  const brands = ["Comfort Essentials", "Urban Comfort", "Elegance", "ActiveFit"]

  const handleBrandChange = (brand: string) => {
    if (filters.brands.includes(brand)) {
      setFilters({
        ...filters,
        brands: filters.brands.filter((b) => b !== brand),
      })
    } else {
      setFilters({
        ...filters,
        brands: [...filters.brands, brand],
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <Accordion type="multiple" defaultValue={["category", "size", "brand", "sort"]} className="w-full">
          <AccordionItem value="category">
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
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
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={filters.brands.includes(brand)}
                      onCheckedChange={() => handleBrandChange(brand)}
                    />
                    <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="size">
            <AccordionTrigger>Size</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={filters.size}
                onValueChange={(value) => setFilters({ ...filters, size: value })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="size-all" />
                  <Label htmlFor="size-all">All Sizes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="XS" id="size-xs" />
                  <Label htmlFor="size-xs">XS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="S" id="size-s" />
                  <Label htmlFor="size-s">S</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="size-m" />
                  <Label htmlFor="size-m">M</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="L" id="size-l" />
                  <Label htmlFor="size-l">L</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="XL" id="size-xl" />
                  <Label htmlFor="size-xl">XL</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sort">
            <AccordionTrigger>Sort By</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={filters.sort}
                onValueChange={(value) => setFilters({ ...filters, sort: value })}
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
  )
}
