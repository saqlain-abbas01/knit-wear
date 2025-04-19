"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCheckout } from "@/context/checkout-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  CreditCard,
  ShoppingCartIcon as Paypal,
  Smartphone,
} from "lucide-react";

const schema = z.object({
  paymentMethod: z.enum(["credit_card", "paypal", "apple_pay", "google_pay"]),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Please enter a valid 16-digit card number")
    .optional()
    .or(z.literal("")),
  cardHolder: z.string().optional().or(z.literal("")),
  expiryDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Please use MM/YY format")
    .optional()
    .or(z.literal("")),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "Please enter a valid CVV")
    .optional()
    .or(z.literal("")),
});

interface PaymentFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentForm({ onNext, onBack }: PaymentFormProps) {
  const { paymentInfo, updatePaymentInfo } = useCheckout();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: paymentInfo,
  });

  const watchPaymentMethod = watch("paymentMethod");

  const onSubmit = (data: any) => {
    updatePaymentInfo(data);
    toast.success("Payment information saved");
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-muted/30 p-6 rounded-lg">
        <h2 className="text-lg font-medium mb-4">Payment Method</h2>
        <RadioGroup
          defaultValue={paymentInfo.paymentMethod}
          {...register("paymentMethod")}
          className="space-y-3"
        >
          {["credit_card", "paypal", "apple_pay", "google_pay"].map(
            (method) => (
              <div
                key={method}
                className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
              >
                <RadioGroupItem value={method} id={method} />
                <Label
                  htmlFor={method}
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  {method === "credit_card" && (
                    <CreditCard className="h-5 w-5" />
                  )}
                  {method === "paypal" && <Paypal className="h-5 w-5" />}
                  {(method === "apple_pay" || method === "google_pay") && (
                    <Smartphone className="h-5 w-5" />
                  )}
                  {method
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Label>
              </div>
            )
          )}
        </RadioGroup>
      </div>

      {watchPaymentMethod === "credit_card" && (
        <div className="bg-muted/30 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Card Details</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                {...register("cardNumber")}
                className={errors.cardNumber ? "border-red-500" : ""}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs">
                  {errors.cardNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardHolder">Cardholder Name</Label>
              <Input
                id="cardHolder"
                placeholder="John Doe"
                {...register("cardHolder")}
                className={errors.cardHolder ? "border-red-500" : ""}
              />
              {errors.cardHolder && (
                <p className="text-red-500 text-xs">
                  {errors.cardHolder.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  {...register("expiryDate")}
                  className={errors.expiryDate ? "border-red-500" : ""}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  {...register("cvv")}
                  className={errors.cvv ? "border-red-500" : ""}
                  maxLength={4}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-xs">{errors.cvv.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Shipping
        </Button>
        <Button type="submit">Continue to Review</Button>
      </div>
    </form>
  );
}
