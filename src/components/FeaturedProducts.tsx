"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentProducts } from "@/lib/api/products";
import { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedProducts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", "recent"],
    queryFn: fetchRecentProducts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/5" />
          </div>
        ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="w-full h-full flex justify-center items-center">
        Failed to load products.
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.recentProducts?.map((product: Product) => {
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
                src={`${product.images?.[0]}` || "/placeholder.svg"}
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
              <h3 className="font-medium">{product.title}</h3>
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
              <p className="text-sm text-muted-foreground">
                {product.category}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {product.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Stock: {product.stock}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
