"use client";

import SignInForm from "@/components/auth/ui/otp-sign-in-form";
import SignUpForm from "@/components/auth/ui/sign-up-form";
import { useState } from "react";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
