"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fecthCarts } from "@/lib/api/cart";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState("");

  // Shipping cost could be calculated based on location, weight, etc.
  const shippingCost = 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shippingCost + tax;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    // This would typically check against valid coupon codes in a database
    toast.error("Invalid coupon code", {
      description: "The coupon code you entered is not valid or has expired.",
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  console.log("items", items);
  return (
    <main className="container mx-auto max-w-6xl py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <Separator className="mb-6 hidden md:block" />

          {items.map((item) => (
            <div key={item.product.id} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="col-span-1 md:col-span-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.product.category} | {item.product.brand}
                      </p>
                      <button
                        onClick={() => {
                          removeItem(item.product.id);
                          toast.success("Item removed from cart");
                        }}
                        className="text-sm text-red-500 flex items-center gap-1 mt-1 md:hidden"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 md:text-center">
                  <div className="flex items-center justify-between md:block">
                    <span className="text-sm font-medium md:hidden">
                      Price:
                    </span>
                    <span>${item.product.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 md:text-center">
                  <div className="flex items-center justify-between md:justify-center">
                    <span className="text-sm font-medium md:hidden">
                      Quantity:
                    </span>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.product.id,
                            Number.parseInt(e.target.value) || 1
                          )
                        }
                        className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 md:text-right">
                  <div className="flex items-center justify-between md:block">
                    <span className="text-sm font-medium md:hidden">
                      Total:
                    </span>
                    <span className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      removeItem(item.product.id);
                      toast.success("Item removed from cart");
                    }}
                    className="text-sm text-red-500 hidden md:flex md:items-center md:gap-1 md:mt-1 md:ml-auto md:w-fit"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
              <Separator className="mt-6 mb-6" />
            </div>
          ))}

          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" asChild className="gap-2">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-muted/30 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({totalItems} items)
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 mt-3 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="shrink-0"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </Button>
              </div>

              <Button className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
