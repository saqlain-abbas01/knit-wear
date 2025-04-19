"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function OrderComplete() {
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`;

  return (
    <div className="text-center py-8 space-y-6">
      <div className="flex justify-center">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Thank You for Your Order!</h2>
        <p className="text-muted-foreground">
          Your order has been placed and is being processed.
        </p>
      </div>

      <div className="bg-muted/30 p-6 rounded-lg max-w-md mx-auto">
        <h3 className="font-medium mb-2">Order Details</h3>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Number:</span>
            <span className="font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">Processing</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        We've sent a confirmation email to your email address.
        <br />
        You will receive another email when your order ships.
      </p>

      <div className="flex justify-center gap-4 pt-4">
        <Button asChild variant="outline">
          <Link href="/products">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}
