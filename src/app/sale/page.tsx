"use client";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDiscountProducts } from "@/lib/api/products";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/error";
import { Product } from "@/lib/types";
import ProductPageCart from "@/components/ProductPageCart";
import { Percent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 20;

const page = () => {
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
  } = useInfiniteQuery({
    queryKey: ["discount-products", PAGE_SIZE],
    queryFn: ({ pageParam = 1 }) =>
      fetchDiscountProducts({ pageParam, pageSize: PAGE_SIZE }),
    getNextPageParam: (lastPage, allPages) => {
      // If the last page returned less than PAGE_SIZE, no more pages
      if (!lastPage?.products || lastPage.products.length < PAGE_SIZE)
        return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  if (isLoading)
    return (
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
    );
  if (isError)
    return (
      <ErrorComponent title="Sale Products" discription="discounted products" />
    );

  const products = data?.pages.flatMap((page) => page.products) as Product[];
  const hasNoProducts = !products || products.length === 0;

  return (
    <div className="py-6 sm:py-10 container mx-auto max-w-7xl">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4 sm:mb-8 ">
        <Percent className="text-pink-500 w-8 h-8" />
        Sale Products
      </h1>
      {hasNoProducts ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-pink-50 rounded-lg shadow-md">
          <Percent className="w-16 h-16 text-pink-300 mb-4 animate-bounce" />
          <h2 className="text-2xl font-semibold text-pink-600 mb-2">
            No Sale Products
          </h2>
          <p className="text-pink-500 mb-4">
            Currently, there are no discounted products available. Please check
            back later!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductPageCart products={products} />
          </div>
          {hasNextPage && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-4 py-2 bg-primary text-white rounded mt-4 cursor-pionter"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
      {isFetchingNextPage && !hasNextPage && <Loading />}
    </div>
  );
};

export default page;
