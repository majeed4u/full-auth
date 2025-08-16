"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader } from "@/components/common/loader";

interface TwoFactorDisableProps {
  user: {
    id: string;
    email: string;
  };
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
  onClearMessages: () => void;
}

export function TwoFactorDisable({
  user,
  onError,
  onSuccess,
  onClearMessages,
}: TwoFactorDisableProps) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDisable2FA = async () => {
    if (!confirmPassword) {
      onError("Password is required to disable 2FA");
      return;
    }

    setLoading(true);
    onClearMessages();

    try {
      const { data, error: disableError } = await authClient.twoFactor.disable({
        password: confirmPassword,
      });

      if (disableError) {
        onError(disableError.message || "Failed to disable 2FA");
        return;
      }

      if (data) {
        onSuccess("2FA disabled successfully!");
        setConfirmPassword("");
        // Refresh the page to update the user state
        window.location.reload();
      }
    } catch (err) {
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border border-destructive rounded-lg">
      <h3 className="font-semibold text-destructive">
        Disable Two-Factor Authentication
      </h3>
      <p className="text-sm text-muted-foreground">
        Disabling 2FA will make your account less secure. Are you sure you want
        to continue?
      </p>
      <div className="space-y-2">
        <Label htmlFor="disable-password">Current Password</Label>
        <Input
          id="disable-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Enter your current password to disable 2FA"
        />
      </div>
      <Button
        onClick={handleDisable2FA}
        disabled={loading || !confirmPassword}
        variant="destructive"
        className="w-full"
      >
        {loading ? <Loader /> : "Disable Two-Factor Authentication"}
      </Button>
    </div>
  );
}
