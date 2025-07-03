"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addWishList, fetchWishList } from "@/lib/api/wishlist";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createCart } from "@/lib/api/cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCartProps {
  products?: Product[];
}

const ProductPageCart = ({ products }: ProductCartProps) => {
  const route = useRouter();
  const queryClient = useQueryClient();
  const cartUnseen = useCartStore((state) => state.markCartUnseen);
  const setStoreCarts = useCartStore((state) => state.setStoreCarts);
  const setTotalItems = useCartStore((state) => state.setTotalItems);
  const totalItmes = useCartStore((state) => state.totalItems);
  const [wishList, setWishList] = useState<Product[]>();
  const [quantity, setQuantity] = useState(1);

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => fetchWishList(),
  });

  useEffect(() => {
    if (wishlist?.data) {
      setWishList(wishlist?.data);
    }
  }, [wishlist]);

  const createCartMutation = useMutation({
    mutationFn: createCart,
    onSuccess: (data) => {
      toast.success(`Added to cart successfully`, {
        action: {
          label: "View Cart",
          onClick: () => route.push("/carts"),
        },
      });
      cartUnseen();
      setTotalItems(totalItmes + 1);
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.response?.data;
      if (errorMessage === "Unauthorized") {
        toast.error("Unauthorized", {
          description: `Please login first to add product to cart`,
          action: {
            label: "Login",
            onClick: () => route.push("/auth/signin"),
          },
        });
      } else {
        toast.error(`Failed to add to cart: ${errorMessage}`);
      }
    },
  });

  const createWishListMutation = useMutation({
    mutationFn: addWishList,
    onSuccess: (data) => {
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
            label: "Login",
            onClick: () => route.push("/auth/signin"),
          },
        });
      } else {
        toast.error(`Failed to add to wishlist`);
      }
    },
  });

  return (
    <>
      {products?.map((product: Product) => {
        const isOnSale = product.discountPercentage > 0;
        const originalPrice = isOnSale
          ? product.price / (1 - product.discountPercentage / 100)
          : product.price;
        const isInWishlist = wishList?.some(
          (item: Product) => item.id === product.id
        );
        const isOutOfStock = product.stock === 0;

        return (
          <div key={product.id} className="group">
            {/* Image Container */}
            <div className="aspect-square relative overflow-hidden mb-4">
              <Link
                href={`/products/${product.id}?category=${product.category}`}
              >
                <Image
                  src={`${product.images?.[0]}` || "/placeholder.svg"}
                  alt={product.title || "Product image"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Badges */}
              {isOnSale && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-500 hover:bg-red-600 text-white font-medium text-xs">
                    -{Math.round(product.discountPercentage)}%
                  </Badge>
                </div>
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Badge
                    variant="secondary"
                    className="bg-white text-black font-medium"
                  >
                    Out of Stock
                  </Badge>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    createWishListMutation.mutate(product.id);
                  }}
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isInWishlist
                        ? "text-red-500 fill-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                  />
                </button>

                <button
                  className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isOutOfStock) {
                      createCartMutation.mutate({
                        quantity: quantity,
                        product: product.id,
                        size: product.size,
                      });
                    }
                  }}
                  disabled={isOutOfStock || createCartMutation.isPending}
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="h-4 w-4 text-gray-600 hover:text-black transition-colors" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              {/* Brand and Rating */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {product.brand}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">4.5</span>
                </div>
              </div>

              {/* Title */}
              <Link
                href={`/products/${product.id}?category=${product.category}`}
              >
                <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors text-sm leading-tight">
                  {product.title}
                </h3>
              </Link>

              {/* Price */}
              <div className="flex items-center gap-2">
                {isOnSale ? (
                  <>
                    <span className="font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <p className="text-xs text-gray-500">
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProductPageCart;
