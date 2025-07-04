"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import ProductFilters from "@/components/ProductFilters";
import { fetchFilterProducts } from "@/lib/api/products";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") || "all";
  const type = searchParams.get("type") || "all";
  const size = searchParams.get("size") || "all";
  const sort = searchParams.get("_sort") || "newest";
  const brands = searchParams.getAll("brands");

  // Safe limit parsing: always use a valid integer between 1 and 100
  let rawLimit = searchParams.get("_limit");
  let limit = parseInt(
    Array.isArray(rawLimit) ? rawLimit[0] : rawLimit || "9",
    10
  );
  if (!Number.isFinite(limit) || limit < 1 || limit > 100) limit = 20;

  const [filters, setFilters] = useState({
    category: category || "all",
    type: type || "all",
    size: size || "all",
    _sort: sort || "newest",
    brands: brands || [],
  });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", filters, limit],
    queryFn: ({ pageParam = 1 }) =>
      fetchFilterProducts({
        filters,
        params: { _page: pageParam, _limit: limit },
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.products || lastPage.products.length < limit)
        return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  const products = data?.pages.flatMap((page) => page.products) || [];

  useEffect(() => {
    const query = new URLSearchParams();

    if (filters.category && filters.category !== "all") {
      query.set("category", filters.category);
    }

    if (filters.type && filters.type !== "all") {
      if (filters.category === "all") {
        setFilters({
          ...filters,
          type: "all",
        });
      } else {
        query.set("type", filters.type);
      }
    }

    if (filters.size && filters.size !== "all") {
      query.set("size", filters.size);
    }

    if (filters._sort && filters._sort !== "newest") {
      query.set("_sort", filters._sort);
    }

    filters.brands.forEach((brand) => {
      query.append("brands", brand);
    });

    // Only set _limit in the URL, do not set _page or any product ids
    query.set("_limit", limit.toString());
    router.replace(`/products?${query.toString()}`);
  }, [filters, limit, router]);

  useEffect(() => {
    if (filters.category === "all") {
      setFilters((prev) => ({
        ...prev,
        type: "all",
      }));
    }
  }, [filters.category]);

  return (
    <main className="contianer mx-auto max-w-7xl  py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tighter mb-8">
        {filters.category === "all"
          ? "All Products"
          : filters.category === "men"
          ? "Men's Collection"
          : "Women's Collection"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-14">
        <ProductFilters filters={filters} setFilters={setFilters} />
        <div>
          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={error}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
          {isFetchingNextPage && (
            <div className="flex justify-center mt-4">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary block" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
