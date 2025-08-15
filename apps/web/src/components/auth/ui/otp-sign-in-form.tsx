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
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Schema for email step
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Schema for OTP step
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, {
      message: "Your one-time password must be 6 characters.",
    })
    .max(6, {
      message: "Your one-time password must be exactly 6 characters.",
    }),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function OtpSignInForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = React.useState<"email" | "otp">("email");
  const [email, setEmail] = React.useState("");
  const router = useRouter();

  // Form for email step
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form for OTP step
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Step 1: Send OTP to email
  async function onEmailSubmit(values: EmailFormValues) {
    setIsLoading(true);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: values.email,
        type: "sign-in",
      });

      if (error) {
        throw error;
      }

      setEmail(values.email);
      setStep("otp");
      toast.success("OTP sent to your email!");
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Step 2: Verify OTP and sign in
  async function onOtpSubmit(values: OtpFormValues) {
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.emailOtp({
        email: email,
        otp: values.otp,
      });

      if (error) {
        throw error;
      }

      router.push("/dashboard");
      toast.success("Signed in successfully!");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Invalid OTP. Please check your code and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const goBackToEmail = () => {
    setStep("email");
    setEmail("");
    otpForm.reset();
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
        <h3 className="text-base font-semibold mt-2">Task Manager</h3>
      </div>

      {step === "email" ? (
        // Step 1: Email input
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            className="space-y-6 w-full max-w-sm mx-auto p-4"
          >
            <FormField
              control={emailForm.control}
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

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Sending Code..." : "Send Verification Code"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
              <span> or </span>
              <Link href="/sign-in" className="text-blue-500 hover:underline">
                Password Sign In
              </Link>
            </p>
          </form>
        </Form>
      ) : (
        // Step 2: OTP input
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
            className="space-y-6 w-full max-w-sm mx-auto p-4"
          >
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-4">
                We've sent a 6-digit code to:
              </p>
              <p className="font-medium text-sm mb-6">{email}</p>
            </div>

            <FormField
              control={otpForm.control}
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
                  <FormDescription className="text-xs text-muted-foreground">
                    Enter the 6-digit code from your email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Sign In"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={goBackToEmail}
                disabled={isLoading}
              >
                Use Different Email
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={() => onEmailSubmit({ email })}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Resend
              </button>
            </p>
          </form>
        </Form>
      )}
    </div>
  );
}
