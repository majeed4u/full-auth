"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Shield, CheckCircle, AlertTriangle, Info } from "lucide-react";

export default function TwoFactorTestPage() {
  const { data: session } = authClient.useSession();
  const [testResults, setTestResults] = useState<string[]>([]);

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                sign in
              </Link>{" "}
              to test 2FA functionality.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const addTestResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testSignOut = async () => {
    try {
      await authClient.signOut();
      addTestResult("✅ Successfully signed out");
    } catch (error) {
      addTestResult("❌ Failed to sign out");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Two-Factor Authentication Test Page
          </h1>
          <p className="text-muted-foreground">
            Test your 2FA implementation step by step
          </p>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Current 2FA Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>User Email:</span>
              <span className="font-mono">{session.user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>2FA Status:</span>
              <Badge
                variant={
                  session.user.twoFactorEnabled ? "default" : "secondary"
                }
              >
                {session.user.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Test Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
            <CardDescription>
              Follow these steps to test the complete 2FA flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <h3 className="font-semibold">
                  Enable Two-Factor Authentication
                </h3>
              </div>
              <p className="text-sm text-muted-foreground ml-8">
                {session.user.twoFactorEnabled
                  ? "✅ 2FA is already enabled for your account"
                  : "❌ 2FA is not enabled. Click below to set it up."}
              </p>
              {!session.user.twoFactorEnabled && (
                <div className="ml-8">
                  <Link href="/settings/security">
                    <Button>Go to Security Settings</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <h3 className="font-semibold">Complete 2FA Setup</h3>
              </div>
              <div className="ml-8 space-y-2">
                <p className="text-sm text-muted-foreground">
                  In the security settings:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                  <li>
                    Enter your password and click "Enable Two-Factor
                    Authentication"
                  </li>
                  <li>
                    Scan the QR code with an authenticator app (Google
                    Authenticator, Authy, etc.)
                  </li>
                  <li>
                    <strong>Important:</strong> Enter the 6-digit code from your
                    app to verify setup
                  </li>
                  <li>Save the backup codes in a secure location</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <h3 className="font-semibold">Test 2FA Login</h3>
              </div>
              <div className="ml-8 space-y-2">
                <p className="text-sm text-muted-foreground">
                  After enabling 2FA, test the login flow:
                </p>
                <Button
                  onClick={testSignOut}
                  variant="outline"
                  disabled={!session.user.twoFactorEnabled}
                >
                  Sign Out & Test Login
                </Button>
                <p className="text-xs text-muted-foreground">
                  After signing out, try to sign in again. You should be
                  redirected to the 2FA verification page.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <h3 className="font-semibold">Verify 2FA Methods</h3>
              </div>
              <div className="ml-8 space-y-2">
                <p className="text-sm text-muted-foreground">
                  On the 2FA verification page, test all methods:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                  <li>
                    <strong>Authenticator:</strong> Enter code from your
                    authenticator app
                  </li>
                  <li>
                    <strong>Email OTP:</strong> Click "Send Email OTP" and use
                    the emailed code
                  </li>
                  <li>
                    <strong>Backup Code:</strong> Use one of your saved backup
                    codes
                  </li>
                  <li>
                    <strong>Trust Device:</strong> Check the "Trust this device"
                    option
                  </li>
                </ul>
              </div>
            </div>

            {session.user.twoFactorEnabled && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Great! 2FA is enabled. Now sign out and try logging in again
                  to test the verification flow.
                </AlertDescription>
              </Alert>
            )}

            {!session.user.twoFactorEnabled && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  2FA is not enabled yet. Complete Step 1 and 2 to enable it,
                  then test the login flow.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono bg-muted p-2 rounded"
                  >
                    {result}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTestResults([])}
                className="mt-2"
              >
                Clear Results
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Link href="/settings/security">
                <Button variant="outline" size="sm">
                  Security Settings
                </Button>
              </Link>
              <Link href="/two-factor">
                <Button variant="outline" size="sm">
                  2FA Verification Page
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Sign In Page
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
