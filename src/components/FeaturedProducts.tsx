import Link from "next/link"
import Image from "next/image"
import { products } from "@/lib/products"

export default function FeaturedProducts() {
  // Get the 6 newest products
  const featuredProducts = [...products]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredProducts.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="group">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {product.sale && (
              <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded">
                SALE
              </div>
            )}
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h3 className="font-medium">{product.name}</h3>
            <div className="flex items-center gap-2">
              {product.sale ? (
                <>
                  <span className="text-muted-foreground line-through">${product.originalPrice?.toFixed(2)}</span>
                  <span className="font-medium text-rose-600">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="font-medium">${product.price.toFixed(2)}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
