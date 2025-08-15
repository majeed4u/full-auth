"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { Input } from "../../ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);

    try {
      const { error } = await authClient.forgetPassword.emailOtp({
        email: values.email,
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      toast.success("Password reset instructions sent to your email!");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleResend = async () => {
    const email = form.getValues("email");
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await authClient.forgetPassword.emailOtp({
        email: email,
      });

      if (error) {
        throw error;
      }

      toast.success("Reset instructions sent again!");
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend instructions.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToResetPage = () => {
    const email = form.getValues("email");
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full max-w-md mx-auto h-full border rounded-md p-4">
      <div className="text-center mb-6">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={40}
          height={40}
          className="mx-auto"
        />
        <h3 className="text-lg font-semibold mt-2">Reset Your Password</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email address and we'll send you a reset code
        </p>
      </div>

      {!isSuccess ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full max-w-sm mx-auto p-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=" text-xs">
                    We'll send a reset code to this email address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Code"}
            </Button>

            <div className="text-center space-y-2">
              <Link
                href="/sign-in"
                className="text-xs text-primary hover:underline hover:text-blue-500"
              >
                Back to Sign In
              </Link>
              <div className="text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-primary hover:underline hover:text-blue-500"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        </Form>
      ) : (
        // Success state
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h4 className="font-medium">Check Your Email</h4>
            <div className="text-sm text-muted-foreground">
              We've sent a 6-digit reset code to:
            </div>
            <p className="font-medium text-sm">{form.getValues("email")}</p>
          </div>

          <div className="space-y-3">
            <Button className="w-full" onClick={goToResetPage}>
              Enter Reset Code
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend Code"}
            </Button>
          </div>

          <Link
            href="/sign-in"
            className="text-sm hover:underline hover:text-blue-500"
          >
            Back to Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
