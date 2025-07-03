"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCart, fecthCarts, updateCart } from "@/lib/api/cart";
import type { CartItem } from "@/lib/types";
import CartPageLoading from "@/components/CartLoadingPage";
import { useDebouncedCallback } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const queryClient = useQueryClient();
  const [carts, setCarts] = useState<CartItem[]>([]);
  const {
    storeCarts,
    setStoreCarts,
    setSubtotal,
    totalItems,
    setTotalItems,
    markCartSeen,
    removeCartItem,
  } = useCartStore();
  let subtotal = 0;
  let totalItemsInCart = 0;

  const sizeMap = {
    xs: {
      label: "Extra Small",
      color: "bg-violet-100 text-violet-700 border-violet-200",
    },
    s: {
      label: "Small",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    m: {
      label: "Medium",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    l: { label: "Large", color: "bg-rose-100 text-rose-700 border-rose-200" },
    xl: {
      label: "Extra Large",
      color: "bg-sky-100 text-sky-700 border-sky-200",
    },
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["carts"],
    queryFn: () => fecthCarts(),
  });

  useEffect(() => {
    if (data?.cart) {
      setCarts(data.cart);
      markCartSeen();
    }
  }, [data]);

  console.log("carts", carts);
  console.log("store carts", storeCarts);

  const updateMutation = useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
      setStoreCarts(carts);
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error) => {
      toast.error("Failed to update quantity. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCart,
    onSuccess: (data) => {
      console.log("remove data", data.cart.id);
      toast.success("Item removed from cart id");
      removeCartItem(data.cart.id);
      setTotalItems(totalItems - 1);
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error) => {
      toast.error("Failed to remove item. Please try again.");
    },
  });

  useEffect(() => {
    subtotal = carts.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    totalItemsInCart = carts.reduce((acc, item) => acc + item.quantity, 0);
    setStoreCarts(carts);
    setSubtotal(subtotal);
    setTotalItems(totalItems);
  }, [carts, setSubtotal, setTotalItems]);

  const shippingCost = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const debouncedUpdate = useDebouncedCallback(
    (cartId: string, quantity: number) => {
      updateMutation.mutate({ cartId, quantity });
    },
    500
  );

  const updateCartQuantityOptimistic = (
    cartId: string,
    productId: string,
    quantity: number
  ) => {
    if (quantity < 1) return;

    setCarts((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    debouncedUpdate(cartId, quantity);
  };

  if (isLoading) return <CartPageLoading />;

  if (error)
    return (
      <div className="container mx-auto max-w-7xl py-16  flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-semibold mb-2">Error Loading Cart</h2>
          <p>We couldn't fetch your cart items. Please try again later.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );

  if (carts.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl py-16  flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="bg-muted p-10 rounded-xl max-w-md">
          <div className="bg-background rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">Browse Collection</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl py-10 md:py-16">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {/* <p className="text-muted-foreground mt-1">
            You have {totalItems} {totalItems === 1 ? "item" : "items"} in your
            cart
          </p> */}
        </div>
        <Button variant="outline" asChild className="gap-2 mt-4 md:mt-0">
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="hidden md:grid grid-cols-12  gap-4 mb-2 text-sm font-medium text-muted-foreground bg-muted px-6 py-4 rounded-lg">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Total</div>
          </div>

          {carts?.map((item, index) => (
            <Card key={index} className="overflow-hidden border-muted/40">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-center ">
                  <div className="col-span-1 md:col-span-6">
                    <div className="flex items-center gap-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0 bg-muted/20">
                        <Image
                          src={item.product.images?.[0] || "/placeholder.svg"}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-medium text-base">
                          {item.product.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{item.product.category}</span>
                          <span>•</span>
                          <span>{item.product.brand}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${sizeMap[item.size]?.color} border`}
                        >
                          {sizeMap[item.size]?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 md:text-center ">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-sm font-medium md:hidden">
                        Price:
                      </span>
                      <span className="font-medium">
                        ${item.product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 md:text-center ">
                    <div className="flex items-center justify-between md:justify-center">
                      <span className="text-sm font-medium md:hidden">
                        Quantity:
                      </span>
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-none"
                          onClick={() =>
                            updateCartQuantityOptimistic(
                              item.id,
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          readOnly
                          className="h-9 w-12 rounded-none text-center border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-none"
                          onClick={() =>
                            updateCartQuantityOptimistic(
                              item.id,
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 md:text-right  flex md:block ">
                    <span className="text-sm font-medium md:hidden">
                      Total:
                    </span>
                    <span className="font-medium text-base">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-red-600 transition-colors ml-auto "
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Remove Item</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove "
                            {item.product.title}" from your cart?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-2 mt-4">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                deleteMutation.mutate({
                                  id: item.id,
                                  deleteAll: false,
                                });
                              }}
                              disabled={deleteMutation.isPending}
                            >
                              Remove
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="md:mt-16">
            <CardHeader className="pb-3">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between text-base font-semibold pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
