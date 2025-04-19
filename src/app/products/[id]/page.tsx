"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, notFound, useRouter } from "next/navigation";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";

export default function ProductPage() {
  const params = useParams();
  const route = useRouter();
  const product = products.find((p) => p.id === params.id);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast("Please select a size");
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      addItem(product, quantity);

      toast("Added to cart", {
        description: `${product.name} has been added to your cart`,
        action: {
          label: "View Cart",
          onClick: () => route.push("/carts"),
        },
      });

      setIsAdding(false);
    }, 600);
  };

  return (
    <main className="container mx-auto max-w-6xl py-8 md:py-12">
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
            <p className="text-2xl font-medium mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-3"
              >
                {product.sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={size}
                      id={`size-${size}`}
                      className="peer sr-only"
                    />
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

            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <span>-</span>
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <span>+</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Check className="h-5 w-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart
                </>
              )}
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
  );
}
