"use client";
import React from "react";
import { Skeleton } from "./ui/skeleton";
import { fetchFilterProducts } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import ProductCart from "./ProductCart";

const RelatedProduct = ({ filters }: any) => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", filters],
    queryFn: fetchFilterProducts,
  });
  const relatedProducts = products;
  if (error) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-4 p-8 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-xl font-semibold">Unable to load products</h3>
        <p className="text-muted-foreground max-w-md">
          {error instanceof Error
            ? error.message
            : "There was a problem loading the products. Please try again."}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-2"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCart products={relatedProducts.products} />
        </div>
      )}
    </>
  );
};

export default RelatedProduct;
