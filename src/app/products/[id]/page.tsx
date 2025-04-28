"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, ShoppingBag, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductById } from "@/lib/api/products";
import { Product } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ImageCarouselComponent from "@/components/ImageCarouselComponent";
import { createCart } from "@/lib/api/cart";

const sizes = [
  { label: "XL", value: "xl" },
  { label: "L", value: "l" },
  { label: "M", value: "m" },
  { label: "S", value: "s" },
];

export default function ProductPage() {
  const params = useParams();
  const route = useRouter();
  const { addItem } = useCart();
  const queryClient = useQueryClient();

  const id = params.id;

  console.log("id", id);

  if (!id) return route.push("/");

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [open, setOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["product"],
    queryFn: () => fetchProductById(id as string),
  });

  const createMutation = useMutation({
    mutationFn: createCart,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  console.log("data;", data);
  if (isLoading) {
    return (
      <main className="container mx-auto max-w-7xl py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg bg-muted animate-pulse" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Product details skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
              <div className="h-6 w-1/4 bg-muted rounded animate-pulse mt-2" />
            </div>

            <div className="space-y-2">
              <div className="h-5 w-1/4 bg-muted rounded animate-pulse" />
              <div className="h-24 w-full bg-muted rounded animate-pulse" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="h-5 w-1/6 bg-muted rounded animate-pulse mb-3" />
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-10 w-10 bg-muted rounded-md animate-pulse"
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="h-5 w-1/5 bg-muted rounded animate-pulse mb-3" />
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
                  <div className="h-6 w-8 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="h-12 flex-1 bg-muted rounded-md animate-pulse" />
              <div className="h-12 flex-1 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <div className="w-full h-dvh flex justify-center items-center">
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="ml-2">Error loading product</AlertTitle>
          <AlertDescription className="ml-2">
            We couldn't load the product. Please try again later or contact
            support if the problem persists.
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  const product = data?.product as Product;

  const isOnSale = product.discountPercentage > 0;
  const originalPrice = isOnSale
    ? product.price / (1 - product.discountPercentage / 100)
    : product.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast("Please select a size");
      return;
    }

    setIsAdding(true);

    createMutation.mutate({
      quantity: quantity,
      product: product.id,
      user: product.name,
    });

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
    <main className="container mx-auto max-w-7xl py-8 md:py-12 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 ">
        <div className="space-y-4" onClick={() => setOpen(true)}>
          <div className="h-full relative overflow-hidden rounded-lg">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((index, i) => (
                <div
                  key={i}
                  className="aspect-square relative overflow-hidden rounded-lg border cursor-pointer hover:opacity-80"
                >
                  <Image
                    src={(i as unknown as string) || "/placeholder.svg"}
                    alt={`${index} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <ImageCarouselComponent
          product={product}
          open={open}
          setOpen={setOpen}
        />
        <div className="space-y-6 ">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.brand}</p>
            {isOnSale ? (
              <>
                <span className="text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className=" ml-1 font-medium text-rose-600">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-medium">${product.price.toFixed(2)}</span>
            )}
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
                {sizes.map((size) => (
                  <div key={size.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={size.value}
                      id={`size-${size.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`size-${size.value}`}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-muted bg-background 
                      text-center peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                    >
                      {size.label}
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

          <div className="flex flex-col sm:flex-row gap-4 pt-4 ">
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
        </div>
      </div>
    </main>
  );
}
