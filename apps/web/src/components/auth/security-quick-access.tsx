"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/loader";
import { Shield, ShieldCheck, ShieldX, Settings } from "lucide-react";
import { useTwoFactor } from "./hooks/use-two-factor";

interface SimpleTwoFactorToggleProps {
  user: {
    id: string;
    email: string;
    twoFactorEnabled?: boolean;
  };
  onUpdate?: () => void;
}

export function SimpleTwoFactorToggle({
  user,
  onUpdate,
}: SimpleTwoFactorToggleProps) {
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState("");
  const router = useRouter();

  const { loading, error, disable2FA } = useTwoFactor();

  const handleEnable2FA = () => {
    // Redirect to full settings page for complete 2FA setup
    router.push("/settings/security");
  };

  const handleDisable2FA = async () => {
    if (!password) {
      return;
    }

    try {
      const result = await disable2FA(password);
      if (result.data) {
        setShowSuccess("Two-factor authentication disabled successfully!");
        setPassword("");
        setTimeout(() => {
          onUpdate?.();
        }, 1500);
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {user.twoFactorEnabled ? (
            <ShieldCheck className="h-5 w-5 text-green-600" />
          ) : (
            <ShieldX className="h-5 w-5 text-red-600" />
          )}
          <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
          <Badge variant={user.twoFactorEnabled ? "default" : "secondary"}>
            {user.twoFactorEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
        <CardDescription>
          {user.twoFactorEnabled
            ? "Your account is protected with two-factor authentication."
            : "Add an extra layer of security to your account."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!user.twoFactorEnabled ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To enable two-factor authentication, click the button below to
              access the complete setup process.
            </p>
            <Button onClick={handleEnable2FA} className="w-full max-w-sm">
              <Settings className="h-4 w-4 mr-2" />
              Set Up Two-Factor Authentication
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Current Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                className="max-w-sm"
              />
            </div>
            <Button
              onClick={handleDisable2FA}
              disabled={loading || !password}
              variant="destructive"
              className="w-full max-w-sm"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <ShieldX className="h-4 w-4 mr-2" />
                  Disable 2FA
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showSuccess && (
          <Alert>
            <AlertDescription>{showSuccess}</AlertDescription>
          </Alert>
        )}

        {user.twoFactorEnabled && (
          <div className="text-sm text-muted-foreground">
            To manage QR codes, backup codes, and other 2FA settings, visit your{" "}
            <a
              href="/settings/security"
              className="text-primary hover:underline"
            >
              security settings
            </a>
            .
          </div>
        )}
      </CardContent>
    </Card>
  );
}
