"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { CheckoutProvider } from "@/context/checkout-context";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderReview from "@/components/checkout/OrderReview";
import OrderComplete from "@/components/checkout/OrderComplete";
import { toast } from "sonner";
import { fecthCarts } from "@/lib/api/cart";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/store/cartStore";
import { ShippingFormValues } from "@/lib/types";
import { createOrder } from "@/lib/api/order";
import { useUserStore } from "@/store/userStore";
import { useStore } from "zustand";

export default function CheckoutPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [address, setAddress] = useState<ShippingFormValues>();
  const [paymentMethod, setPaymentMethod] = useState("");

  const carts = useCartStore((state) => state.storeCarts);
  const totalItems = useCartStore((state) => state.totalItems);
  const subtotal = useCartStore((state) => state.subtotal);
  const user = useUserStore((state) => state.user);
  const clearCart = useCartStore((state) => state.clearCart);

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("Order placed sucessfully");
    },
    onError: (error) => {
      toast.error("Failed to update quantity. Please try again.");
    },
  });

  if (carts.length === 0 && typeof window !== "undefined") {
    router.push("/carts");
    toast.error("Your cart is empty", {
      description:
        "Please add items to your cart before proceeding to checkout",
    });
    return null;
  }

  const steps = ["Shipping", "Payment", "Review", "Complete"];

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleAddress = (values: ShippingFormValues) => {
    setAddress(values);
  };

  const handlePaymentMethod = (value: string) => {
    setPaymentMethod(value);
  };

  const handleCompleteOrder = () => {
    const items = carts.map((cart) => ({
      product: cart.product.id, // ensure you're sending the ObjectId
      size: cart.size,
      quantity: cart.quantity,
    }));

    const data = {
      items,
      totalItems,
      totalAmount: subtotal,
      user: user?.id,
      paymentMethod,
      userInfo: address,
    };
    createMutation.mutate(data);
    setCurrentStep(3);
    clearCart();
  };

  return (
    <CheckoutProvider>
      <main className="conatainer mx-auto max-w-7xl py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <CheckoutStepper steps={steps} currentStep={currentStep} />

          <div className="mt-8">
            {currentStep === 0 && (
              <ShippingForm
                onNext={handleNextStep}
                handleAddress={handleAddress}
              />
            )}
            {currentStep === 1 && (
              <PaymentForm
                onNext={handleNextStep}
                onBack={handlePrevStep}
                handlePaymentMethod={handlePaymentMethod}
              />
            )}
            {currentStep === 2 && (
              <OrderReview
                items={carts}
                subtotal={subtotal}
                totalItems={totalItems}
                onBack={handlePrevStep}
                onComplete={handleCompleteOrder}
              />
            )}
            {currentStep === 3 && <OrderComplete />}
          </div>
        </div>
      </main>
    </CheckoutProvider>
  );
}
