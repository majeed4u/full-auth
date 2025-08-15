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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React from "react";
import { Input } from "../../ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const verifyEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  otp: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters.",
    })
    .max(6, {
      message: "Verification code must be exactly 6 characters.",
    }),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: emailFromQuery,
      otp: "",
    },
  });

  async function onSubmit(values: VerifyEmailFormValues) {
    setIsLoading(true);

    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email: values.email,
        otp: values.otp,
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      toast.success("Email verified successfully!");

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Verify email error:", error);

      // Handle specific error cases
      if (error?.code === "INVALID_OTP") {
        toast.error("Invalid or expired verification code. Please try again.");
      } else if (error?.code === "MAX_ATTEMPTS_EXCEEDED") {
        toast.error(
          "Too many attempts. Please request a new verification code."
        );
      } else if (error?.code === "EMAIL_ALREADY_VERIFIED") {
        toast.success("Email is already verified!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to verify email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendCode = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "email-verification",
      });

      if (error) {
        throw error;
      }

      toast.success("New verification code sent to your email!");
      form.setValue("otp", ""); // Clear the OTP field
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to send new verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto h-full border rounded-md p-4">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="mx-auto"
            />

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
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

            <div className="space-y-2">
              <h3 className="text-base font-semibold">Email Verified!</h3>
              <div className="text-xs text-muted-foreground">
                Your email has been successfully verified. You'll be redirected
                to your dashboard shortly.
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={() => router.push("/dashboard")}>
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto h-full border rounded-md p-4">
      <div className="text-center mb-6">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={75}
          height={75}
          className="mx-auto"
        />
        <h3 className="text-lg font-semibold mt-2">Verify Your Email</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the verification code sent to your email
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
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
                <FormDescription>
                  The email address you want to verify
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} disabled={isLoading} {...field}>
                    <InputOTPGroup className="w-full justify-center">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Enter the 6-digit code sent to your email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend Verification Code"}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Didn't receive the code? Check your spam folder or{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                request a new one
              </button>
            </div>

            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:underline block"
            >
              Skip for now
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
