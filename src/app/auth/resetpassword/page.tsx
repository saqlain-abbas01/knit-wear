"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/auth/AuthLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/lib/types";
import { resetUserPassword } from "@/lib/api/user";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: resetUserPassword,
    onSuccess: () => {
      toast.success("Password reset sucessfully ");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push("/auth/signin");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message;
      console.log("errorMessage", errorMessage);
      toast.error(`Error while sending resetting password: ${errorMessage}`);
    },
  });

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    // if (!token) {
    //   toast.error("Invalid reset link", {
    //     description: "The password reset link is invalid or has expired.",
    //   });
    //   return;
    // }

    changePasswordMutation.mutate(data);
  }

  // if (!token) {
  //   return (
  //     <AuthLayout
  //       title="Invalid Reset Link"
  //       subtitle="The password reset link is invalid or has expired"
  //     >
  //       <div className="text-center space-y-4">
  //         <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
  //           <p>
  //             The password reset link you followed is invalid or has expired.
  //           </p>
  //         </div>

  //         <p className="text-sm text-muted-foreground">
  //           Please request a new password reset link.
  //         </p>

  //         <Button className="w-full mt-4" asChild>
  //           <Link href="/auth/forgot-password">Request New Link</Link>
  //         </Button>
  //       </div>
  //     </AuthLayout>
  //   );
  // }

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Create a new password for your account"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      className="pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {changePasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
