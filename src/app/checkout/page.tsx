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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);

  // Redirect to cart if cart is empty
  if (items.length === 0 && typeof window !== "undefined") {
    router.push("/cart");
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

  const handleCompleteOrder = () => {
    // In a real application, this would submit the order to the backend
    setCurrentStep(3); // Move to complete step
    clearCart(); // Clear the cart after successful order
  };

  return (
    <CheckoutProvider>
      <main className="conatainer mx-auto max-w-6xl py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <CheckoutStepper steps={steps} currentStep={currentStep} />

          <div className="mt-8">
            {currentStep === 0 && <ShippingForm onNext={handleNextStep} />}
            {currentStep === 1 && (
              <PaymentForm onNext={handleNextStep} onBack={handlePrevStep} />
            )}
            {currentStep === 2 && (
              <OrderReview
                items={items}
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
