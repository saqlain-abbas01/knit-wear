"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addWishList, fetchWishList } from "@/lib/api/wishlist";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createCart } from "@/lib/api/cart";

interface ProductCartPrpos {
  products?: Product[];
}

const ProductCart = ({ products }: ProductCartPrpos) => {
  const route = useRouter();
  const queryClient = useQueryClient();
  const cartUnseen = useCartStore((state) => state.markCartUnseen);

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
    onSuccess: () => {
      toast("Added to cart", {
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

  return (
    <>
      {products?.map((product: Product) => {
        const isOnSale = product.discountPercentage > 0;
        const originalPrice = isOnSale
          ? product.price / (1 - product.discountPercentage / 100)
          : product.price;

        return (
          <div key={product.id} className="group ">
            <div className=" rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square relative overflow-hidden">
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

                {isOnSale && (
                  <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    SALE
                  </div>
                )}

                {/* Quick action buttons */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-full shadow-md cursor-pointer transition-all"
                    onClick={(e) => {
                      e.preventDefault();
                      createCartMutation.mutate({
                        quantity: quantity,
                        product: product.id,
                        size: product.size,
                      });
                    }}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                  <button
                    className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-full shadow-md cursor-pointer transition-all"
                    onClick={(e) => {
                      e.preventDefault();
                      createWishListMutation.mutate(product.id);
                    }}
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        wishList?.some(
                          (item: Product) => item.id === product.id
                        )
                          ? "text-red-500 fill-red-500"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-1.5">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    {product.brand}
                  </p>
                  <Link
                    href={`/products/${product.id}?category=${product.category}`}
                  >
                    <h3 className="font-medium text-base line-clamp-1 hover:text-primary transition-colors dark:text-gray-200">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center text-xs gap-2 mt-0.5">
                    {isOnSale ? (
                      <>
                        <span className="font-medium text-rose-600 dark:text-rose-400">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground dark:text-gray-500 line-through">
                          ${originalPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium dark:text-gray-200">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-1.5 mt-1.5 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-muted-foreground dark:text-gray-400 line-clamp-1 mt-0.5">
                    {product.description}
                  </p>
                  <p className="text-xs mt-1 font-medium text-muted-foreground dark:text-gray-400">
                    {product.stock > 10
                      ? "In stock"
                      : product.stock > 0
                      ? `Only ${product.stock} left`
                      : "Out of stock"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProductCart;
