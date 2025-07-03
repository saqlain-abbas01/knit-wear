"use client";

import Image from "next/image";
import { useCheckout } from "@/context/checkout-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/context/cart-context";
import {
  CreditCard,
  ShoppingCartIcon as Paypal,
  Smartphone,
} from "lucide-react";

interface OrderReviewProps {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  onBack: () => void;
  onComplete: () => void;
}

export default function OrderReview({
  items,
  subtotal,
  totalItems,
  onBack,
  onComplete,
}: OrderReviewProps) {
  const { addressInfo, paymentInfo } = useCheckout();
  console.log("items", items);
  // Calculate additional costs
  const shippingCost = 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shippingCost + tax;

  const getPaymentMethodIcon = () => {
    switch (paymentInfo.paymentMethod) {
      case "credit_card":
        return <CreditCard className="h-5 w-5" />;
      case "paypal":
        return <Paypal className="h-5 w-5" />;
      case "apple_pay":
      case "google_pay":
        return <Smartphone className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentInfo.paymentMethod) {
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "apple_pay":
        return "Apple Pay";
      case "google_pay":
        return "Google Pay";
      default:
        return "Unknown";
    }
  };

  const getLastFourDigits = () => {
    if (paymentInfo.paymentMethod === "credit_card" && paymentInfo.cardNumber) {
      const digits = paymentInfo.cardNumber.replace(/\s/g, "");
      return digits.slice(-4);
    }
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Shipping Information</h2>
          <div className="text-sm space-y-1">
            <p className="font-medium">
              {addressInfo.firstName} {addressInfo.lastName}
            </p>
            <p>{addressInfo.street}</p>
            <p>
              {addressInfo.city}, {addressInfo.state} {addressInfo.zipCode}
            </p>
            <p>
              {addressInfo.country === "US"
                ? "United States"
                : addressInfo.country}
            </p>
            <p className="mt-2">{addressInfo.email}</p>
            <p>{addressInfo.phone}</p>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Payment Method</h2>
          <div className="flex items-center gap-2 text-sm">
            {getPaymentMethodIcon()}
            <span>{getPaymentMethodName()}</span>
            {paymentInfo.paymentMethod === "credit_card" &&
              getLastFourDigits() && (
                <span className="text-muted-foreground">
                  ending in {getLastFourDigits()}
                </span>
              )}
          </div>
        </div>
      </div>

      <div className="bg-muted/30 p-6 rounded-lg">
        <h2 className="text-lg font-medium mb-4">Order Summary</h2>

        <div className="space-y-4">
          {items?.map((item) => (
            <div key={item.product.id} className="flex gap-4">
              <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item?.product?.images?.[0] ?? "/placeholder.svg"}
                  alt={item.product.name ?? "image"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.product.category} | {item.product.brand}
                </p>
                <div className="flex justify-between mt-1">
                  <p className="text-sm">Qty: {item.quantity}</p>
                  <p className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2 text-sm">
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

          <div className="pt-2 mt-2 border-t">
            <div className="flex justify-between font-medium text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Payment
        </Button>
        <Button onClick={onComplete}>Place Order</Button>
      </div>
    </div>
  );
}
