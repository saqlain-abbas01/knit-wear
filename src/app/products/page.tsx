"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import ProductFilters from "@/components/ProductFilters";
import { fetchFilterProducts } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") || "all";
  const type = searchParams.get("type") || "all";
  const size = searchParams.get("size") || "all";
  const sort = searchParams.get("_sort") || "newest";
  const brands = searchParams.getAll("brands");

  const [filters, setFilters] = useState({
    category: category || "all",
    type: type || "all",
    size: "all",
    _sort: "newest",
    brands: [],
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", filters],
    queryFn: fetchFilterProducts,
  });

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

    router.replace(`/products?${query.toString()}`);
  }, [filters, router]);

  useEffect(() => {
    // Reset type if category changed
    setFilters((prev) => ({
      ...prev,
      type: "all", // or "all"
    }));
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
        <ProductGrid
          products={data?.products}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </main>
  );
}
