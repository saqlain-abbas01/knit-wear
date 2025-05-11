"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, z } from "zod";

import { useCheckout } from "@/context/checkout-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ShoppingCartIcon } from "lucide-react";

const schema = z.object({
  paymentMethod: z.string(),
});

interface PaymentFormProps {
  onNext: () => void;
  onBack: () => void;
  handlePaymentMethod: (value: string) => void;
}

export default function PaymentForm({
  onNext,
  onBack,
  handlePaymentMethod,
}: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: "cash",
    },
  });

  const onSubmit = (data: any) => {
    handlePaymentMethod(data.paymentMethod);
    toast.success("Payment information saved");
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-lg font-medium mb-4">Payment Method</h2>
        <RadioGroup
          defaultValue="cash"
          {...register("paymentMethod")}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 rounded-lg border p-4">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="flex items-center gap-2 flex-1">
              <ShoppingCartIcon className="h-5 w-5" />
              Cash
            </Label>
          </div>
        </RadioGroup>
        {errors.paymentMethod && (
          <p className="text-red-500 text-xs mt-2">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Shipping
        </Button>
        <Button type="submit">Continue to Review</Button>
      </div>
    </form>
  );
}
