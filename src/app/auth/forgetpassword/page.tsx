"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

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

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);

    try {
      // This would be replaced with your actual password reset API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      toast.error("Failed to send reset link", {
        description:
          "There was an error processing your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your email and we'll send you a link to reset your password"
    >
      {!isSubmitted ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </form>
        </Form>
      ) : (
        <div className="text-center space-y-4">
          <div className="bg-primary/10 text-primary p-4 rounded-lg">
            <p>
              If an account exists for <strong>{submittedEmail}</strong>, you
              will receive a password reset link shortly.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Please check your email and follow the instructions to reset your
            password.
          </p>

          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href="/auth/login">Return to Login</Link>
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
