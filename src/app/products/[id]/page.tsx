"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, ShoppingBag, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductById } from "@/lib/api/products";
import { Product } from "@/lib/types";
import ImageCarouselComponent from "@/components/ImageCarouselComponent";
import { createCart } from "@/lib/api/cart";
import { AxiosError } from "axios";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/error";
import { useCartStore } from "@/store/cartStore";
import { Separator } from "@/components/ui/separator";
import RelatedProduct from "@/components/RelatedProduct";
import { addWishList, fetchWishList } from "@/lib/api/wishlist";

const sizes = [
  { label: "XL", value: "xl" },
  { label: "L", value: "l" },
  { label: "M", value: "m" },
  { label: "S", value: "s" },
];

export default function ProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const route = useRouter();
  const queryClient = useQueryClient();

  const id = params.id;
  const category = searchParams.get("category");

  const [filters, setFilters] = useState({
    category: category,
  });

  const cartUnseen = useCartStore((state) => state.markCartUnseen);

  console.log("category", category);

  if (!id || typeof id !== "string") {
    route.push("/");
    return null; // important: avoid rendering the rest of the component
  }

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [wishList, setWishList] = useState<Product[]>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => fetchWishList(),
  });

  useEffect(() => {
    if (wishlist?.data) {
      setWishList(wishlist?.data);
    }
  }, [wishlist]);

  console.log("wishlist", wishList);

  const product = data?.product as Product;

  const createMutation = useMutation({
    mutationFn: createCart,
    onSuccess: () => {
      toast("Added to cart", {
        description: `${product.title} has been added to your cart`,
        action: {
          label: "View Cart",
          onClick: () => route.push("/carts"),
        },
      });
      cartUnseen();
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.response?.data;
      if (errorMessage === "Unauthorized") {
        toast("Unauthorized", {
          description: `Please login first to add product to carts`,
          action: {
            label: "Login In",
            onClick: () => route.push("/auth/signin"),
          },
        });
      } else {
        toast.error(`Failed To create cart: ${errorMessage}`);
      }
    },
  });

  const createWishListMutation = useMutation({
    mutationFn: addWishList,
    onSuccess: (data) => {
      console.log("response message from wishlist", data.message);
      toast.success(data.message, {
        action: {
          label: "View Wishlist",
          onClick: () => route.push("/carts"),
        },
      });
      cartUnseen();
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.response?.data;
      if (errorMessage === "Unauthorized") {
        toast.error("Unauthorized", {
          description: `Please login first to add product to wishlist`,
          action: {
            label: "Login In",
            onClick: () => route.push("/auth/signin"),
          },
        });
      } else {
        toast.error(`Failed To add product to wishlist try again`);
      }
    },
  });

  if (isLoading) return <Loading />;

  if (error)
    return <ErrorComponent title={"products"} discription={"products"} />;

  const isOnSale = product?.discountPercentage > 0;
  const originalPrice = isOnSale
    ? product?.price / (1 - product?.discountPercentage / 100)
    : product?.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast("Please select a size first");
      return;
    }

    createMutation.mutate({
      quantity: quantity,
      product: product.id,
      size: selectedSize,
    });
  };

  return (
    <main className="container mx-auto max-w-7xl py-8 md:py-12 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 ">
        <div className="space-y-4" onClick={() => setOpen(true)}>
          <div className="h-full relative overflow-hidden rounded-lg">
            <Image
              src={product?.images[0] || "/placeholder.svg"}
              alt={product?.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product?.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product?.images.map((image, i) => (
                <div
                  key={i}
                  className="aspect-square relative overflow-hidden rounded-lg border cursor-pointer hover:opacity-80"
                >
                  <Image
                    src={(i as unknown as string) || "/placeholder.svg"}
                    alt={`${image} thumbnail ${i + 1}`}
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
            <h1 className="text-3xl font-bold">{product?.name}</h1>
            <p className="text-muted-foreground mt-1">{product?.brand}</p>
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
              <span className="font-medium">${product?.price.toFixed(2)}</span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{product?.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-3"
              >
                {sizes?.map((size) => (
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
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
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
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => {
                createWishListMutation.mutate(product.id);
              }}
            >
              <Heart
                className={`h-5 w-5 ${
                  wishList?.some((item: Product) => item.id === product.id)
                    ? "text-red-500 fill-red-500"
                    : ""
                }`}
              />
              {wishList?.some((item: Product) => item.id === product.id)
                ? "Wishlisted"
                : "Add to Wishlist"}
            </Button>
          </div>
        </div>
      </div>
      <div className="py-8">
        <Separator />
      </div>
      <div>
        <div>
          <h1 className="font-medium text-2xl py-4">You may also like</h1>
        </div>
        <RelatedProduct filters={filters} />
      </div>
    </main>
  );
}
