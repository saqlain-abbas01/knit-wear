"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductGrid from "@/components/ProductGrid"
import ProductFilters from "@/components/ProductFilters"
import { products } from "@/lib/products"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"

  const [filters, setFilters] = useState({
    category: initialCategory,
    size: "all",
    sort: "newest",
    brands: [],
  })

  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    let result = [...products]

    // Filter by category
    if (filters.category !== "all") {
      result = result.filter((product) => product.category === filters.category)
    }

    // Filter by size
    if (filters.size !== "all") {
      result = result.filter((product) => product.sizes.includes(filters.size))
    }

    // Filter by brand
    if (filters.brands.length > 0) {
      result = result.filter((product) => filters.brands.includes(product.brand))
    }

    // Sort products
    if (filters.sort === "newest") {
      result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (filters.sort === "price-low") {
      result = result.sort((a, b) => a.price - b.price)
    } else if (filters.sort === "price-high") {
      result = result.sort((a, b) => b.price - a.price)
    }

    setFilteredProducts(result)
  }, [filters])

  return (
    <main className="px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tighter mb-8">
        {filters.category === "all"
          ? "All Products"
          : filters.category === "men"
            ? "Men's Collection"
            : "Women's Collection"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <ProductFilters filters={filters} setFilters={setFilters} />
        <ProductGrid products={filteredProducts} />
      </div>
    </main>
  )
}
