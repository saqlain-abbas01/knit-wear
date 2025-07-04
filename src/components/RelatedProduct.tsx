"use client";
import React from "react";
import { Skeleton } from "./ui/skeleton";
import { fetchFilterProducts } from "@/lib/api/products";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import ProductPageCart from "./ProductPageCart";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 20;

const RelatedProduct = ({ filters }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Set limit in URL if it changes, but do not set page
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("_limit", PAGE_SIZE.toString());
    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", filters, PAGE_SIZE],
    queryFn: ({ pageParam = 1 }) =>
      fetchFilterProducts({
        filters,
        params: { _page: pageParam, _limit: PAGE_SIZE },
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.products || lastPage.products.length < PAGE_SIZE)
        return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  const products = data?.pages.flatMap((page) => page.products) || [];

  console.log("Related products:", products);

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
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductPageCart products={products} />
          </div>
          {hasNextPage && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-4 py-2 mt-4"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
      {isFetchingNextPage && !hasNextPage && (
        <div className="flex justify-center mt-4">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
      )}
    </>
  );
};

export default RelatedProduct;
