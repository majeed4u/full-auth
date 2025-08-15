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
import { Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    otp: z
      .string()
      .min(6, {
        message: "Reset code must be 6 characters.",
      })
      .max(6, {
        message: "Reset code must be exactly 6 characters.",
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromQuery,
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setIsLoading(true);

    try {
      const { error } = await authClient.emailOtp.resetPassword({
        email: values.email,
        otp: values.otp,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } catch (error: any) {
      console.error("Reset password error:", error);

      // Handle specific error cases
      if (error?.code === "INVALID_OTP") {
        toast.error("Invalid or expired reset code. Please try again.");
      } else if (error?.code === "MAX_ATTEMPTS_EXCEEDED") {
        toast.error("Too many attempts. Please request a new reset code.");
      } else {
        toast.error("Failed to reset password. Please try again.");
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
      const { error } = await authClient.forgetPassword.emailOtp({
        email: email,
      });

      if (error) {
        throw error;
      }

      toast.success("New reset code sent to your email!");
      form.setValue("otp", ""); // Clear the OTP field
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to send new reset code.");
    } finally {
      setIsLoading(false);
    }
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
        <h3 className="text-base font-semibold mt-2">Reset Your Password</h3>
        <div className="text-xs text-muted-foreground mt-1">
          Enter the reset code and your new password
        </div>
      </div>

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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reset Code</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter new password"
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
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
                  <div className="relative">
                    <Input
                      placeholder="Confirm new password"
                      type={showConfirmPassword ? "text" : "password"}
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend Reset Code"}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/sign-in"
              className="text-xs text-primary hover:underline font-medium block"
            >
              Back to Sign In
            </Link>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:underline block"
            >
              Back to Forgot Password
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
