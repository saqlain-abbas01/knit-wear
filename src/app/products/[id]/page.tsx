"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams, notFound } from "next/navigation"
import { products } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Heart, ShoppingCart } from "lucide-react"

export default function ProductPage() {
  const params = useParams()
  const product = products.find((p) => p.id === params.id)

  const [selectedSize, setSelectedSize] = useState("")

  if (!product) {
    notFound()
  }

  return (
    <main className="px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square relative overflow-hidden rounded-lg border cursor-pointer hover:opacity-80"
              >
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.brand}</p>
            <p className="text-2xl font-medium mt-2">${product.price.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Size</h3>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                  <Label
                    htmlFor={`size-${size}`}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-muted bg-background 
                    text-center peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="flex-1 gap-2">
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Heart className="h-5 w-5" />
              Add to Wishlist
            </Button>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Material</span>
              <span>95% Cotton, 5% Elastane</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Care</span>
              <span>Machine wash cold</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
