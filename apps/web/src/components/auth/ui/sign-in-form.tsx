"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleEmailOtp = async (pin: string) => {
    setIsLoading(true);
    await authClient.signIn.emailOtp(
      {
        email: form.getValues("email"),
        otp: pin,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
          toast.success("Signed in successfully!");
          setIsLoading(false);
        },
        onError: () => {
          toast.error("Failed to sign in. Please check your credentials.");
          setIsLoading(false);
        },
      }
    );
  };

  async function onSubmit(values: SignInFormValues) {
    setIsLoading(true);

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
          toast.success("Signed in successfully!");
          setIsLoading(false);
        },
        onError: () => {
          toast.error("Failed to sign in. Please check your credentials.");
          setIsLoading(false);
        },
      }
    );
  }

  return (
    <div className="w-full max-w-md mx-auto h-full  border rounded-md p-4">
      <div className="text-center mb-6">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={40}
          height={40}
          className="mx-auto"
        />
        <h3>Task Manager</h3>
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
                  <Input placeholder="you@example.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button className=" w-full" type="submit">
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
          {/* forgot password link */}
          <Link
            href="/forgot-password"
            className="text-xs text-blue-500 hover:underline font-medium block text-right"
          >
            Forgot Password?
          </Link>
          <div className="text-xs text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
            <span> or </span>
            <Link href="/otp-sign-in" className="text-blue-500 hover:underline">
              OTP Sign In
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
