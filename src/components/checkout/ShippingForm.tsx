"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCheckout } from "@/context/checkout-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ShippingFormValues, shippingSchema } from "@/lib/types";
import { useUserStore } from "@/store/userStore";

interface ShippingFormProps {
  onNext: () => void;
  handleAddress: (values: ShippingFormValues) => void;
}

export default function ShippingForm({
  onNext,
  handleAddress,
}: ShippingFormProps) {
  const { addressInfo, updateAddressInfo } = useCheckout();
  const user = useUserStore((state) => state.user);

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: addressInfo,
  });

  const onSubmit = (values: ShippingFormValues) => {
    updateAddressInfo(values);
    handleAddress(values);
    toast.success("Shipping information saved");
    onNext();
  };

  // ✅ Handler for "Use Default Address" button
  const useDefaultAddress = () => {
    if (user?.address) {
      const { street, city, state, zipCode } = user.address;

      if (street && city && state && zipCode) {
        form.reset({
          ...form.getValues(),
          street,
          city,
          state,
          zipCode,
        });
        toast.success("Default address applied");
      } else {
        toast.warning(
          "Incomplete default address. Please update it in settings."
        );
      }
    } else {
      toast.warning("Please set a default address in your profile settings.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={useDefaultAddress}>
            Use Default Address
          </Button>
        </div>

        <div className="bg-muted/30 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Continue to Payment
          </Button>
        </div>
      </form>
    </Form>
  );
}
