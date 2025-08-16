"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

export default function TwoFactorPage() {
  const [totpCode, setTotpCode] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("totp");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleTotpVerify = async () => {
    if (totpCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: verifyError } =
        await authClient.twoFactor.verifyTotp({
          code: totpCode,
          trustDevice,
        });

      if (verifyError) {
        setError(verifyError.message || "Invalid code. Please try again.");
        return;
      }

      if (data) {
        setSuccess("Authentication successful! Redirecting...");
        setTimeout(() => {
          router.push(callbackUrl);
        }, 1000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setOtpSending(true);
    setError("");

    try {
      const { data, error: sendError } = await authClient.twoFactor.sendOtp();

      if (sendError) {
        setError(sendError.message || "Failed to send OTP. Please try again.");
        return;
      }

      if (data) {
        setSuccess("OTP sent to your email. Please check your inbox.");
        setActiveTab("otp");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: verifyError } = await authClient.twoFactor.verifyOtp(
        {
          code: otpCode,
          trustDevice,
        }
      );

      if (verifyError) {
        setError(verifyError.message || "Invalid code. Please try again.");
        return;
      }

      if (data) {
        setSuccess("Authentication successful! Redirecting...");
        setTimeout(() => {
          router.push(callbackUrl);
        }, 1000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackupCodeVerify = async () => {
    if (backupCode.length < 6) {
      setError("Please enter a valid backup code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: verifyError } =
        await authClient.twoFactor.verifyBackupCode({
          code: backupCode,
          trustDevice,
        });

      if (verifyError) {
        setError(
          verifyError.message || "Invalid backup code. Please try again."
        );
        return;
      }

      if (data) {
        setSuccess("Authentication successful! Redirecting...");
        setTimeout(() => {
          router.push(callbackUrl);
        }, 1000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Please verify your identity using one of the methods below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="totp">Authenticator</TabsTrigger>
              <TabsTrigger value="otp">Email OTP</TabsTrigger>
              <TabsTrigger value="backup">Backup Code</TabsTrigger>
            </TabsList>

            <TabsContent value="totp" className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
                <InputOTP
                  value={totpCode}
                  onChange={setTotpCode}
                  maxLength={6}
                  className="flex justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button
                  onClick={handleTotpVerify}
                  disabled={loading || totpCode.length !== 6}
                  className="w-full"
                >
                  {loading ? <Loader /> : "Verify Code"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="otp" className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We'll send a verification code to your email
                </p>
                <Button
                  onClick={handleSendOtp}
                  disabled={otpSending}
                  variant="outline"
                  className="w-full"
                >
                  {otpSending ? <Loader /> : "Send Email OTP"}
                </Button>
                <InputOTP
                  value={otpCode}
                  onChange={setOtpCode}
                  maxLength={6}
                  className="flex justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button
                  onClick={handleOtpVerify}
                  disabled={loading || otpCode.length !== 6}
                  className="w-full"
                >
                  {loading ? <Loader /> : "Verify Email Code"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter one of your backup recovery codes
                </p>
                <input
                  type="text"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value)}
                  placeholder="Enter backup code"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                />
                <Button
                  onClick={handleBackupCodeVerify}
                  disabled={loading || backupCode.length < 6}
                  className="w-full"
                >
                  {loading ? <Loader /> : "Verify Backup Code"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trust-device"
                checked={trustDevice}
                onCheckedChange={(checked) => setTrustDevice(checked === true)}
              />
              <label
                htmlFor="trust-device"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Trust this device for 30 days
              </label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
