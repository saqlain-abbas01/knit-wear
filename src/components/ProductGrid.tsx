"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
}

export default function ProductGrid({
  products,
  isLoading,
  error,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const isOnSale = product.discountPercentage > 0;
        const originalPrice = isOnSale
          ? product.price / (1 - product.discountPercentage / 100)
          : product.price;
        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {isOnSale && (
                <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded">
                  SALE
                </div>
              )}
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h3 className="font-medium">{product.name || product.title}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {isOnSale ? (
                    <>
                      <span className="text-muted-foreground line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                      <span className="font-medium text-rose-600">
                        ${product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {product.category}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
