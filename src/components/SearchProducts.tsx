"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api/search";
import { useDebounce } from "@/lib/useDebounce.ts/usedebounce";
// Adjust the import path as needed

export default function SearchComponent() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch search results with React Query
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery),
    enabled: debouncedQuery.length > 1,
    staleTime: 1000 * 60,
  });

  // Handle search input change
  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 1) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  // Handle clicking on a search result
  const handleResultClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setShowDropdown(false);
    setQuery("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search products..."
          className="pl-9 pr-4 w-full"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length > 1 && setShowDropdown(true)}
        />
        {isLoading && (
          <div className="absolute right-2.5 top-2.5">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full bg-background border rounded-md shadow-md max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">
              {isLoading ? "Searching..." : "No products found"}
            </div>
          ) : (
            <ul className="py-1">
              {results.map((product: any) => (
                <li
                  key={product.id}
                  className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                  onClick={() => handleResultClick(product.id)}
                >
                  {product.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
