"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ProductPageCart from "./ProductPageCart";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export default function ProductGrid({
  products,
  isLoading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-square rounded-lg bg-muted animate-pulse" />
              <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
              <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="ml-2">Error loading products</AlertTitle>
        <AlertDescription className="ml-2">
          We couldn't load the products. Please try again later or contact
          support if the problem persists.
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Alert>
    );
  }

  // No products state
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 px-4 text-center">
        <div className="bg-muted/30 p-6 rounded-full mb-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Products Found</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          We couldn't find any products matching your current filter selection.
          Try adjusting your filters or browse our collections.
        </p>
        <Button asChild>
          <Link href="/">View All Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductPageCart products={products} />
      </div>
      {hasNextPage && fetchNextPage && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
            className="px-4 py-2 mt-4"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
}
