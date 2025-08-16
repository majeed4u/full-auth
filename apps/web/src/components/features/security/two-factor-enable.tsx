"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  PasswordForm,
  QRCodeDisplay,
  TOTPVerification,
  BackupCodesDisplay,
} from "./index";

interface TwoFactorEnableProps {
  user: {
    id: string;
    email: string;
  };
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
  onClearMessages: () => void;
}

export function TwoFactorEnable({
  user,
  onError,
  onSuccess,
  onClearMessages,
}: TwoFactorEnableProps) {
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [totpUri, setTotpUri] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showQrCode, setShowQrCode] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleEnable2FA = async () => {
    if (!password) {
      onError("Password is required");
      return;
    }

    setLoading(true);
    onClearMessages();

    try {
      const { data, error: enableError } = await authClient.twoFactor.enable({
        password,
        issuer: "Task Manager",
      });

      if (enableError) {
        onError(enableError.message || "Failed to enable 2FA");
        return;
      }

      if (data) {
        setTotpUri(data.totpURI);
        setBackupCodes(data.backupCodes);
        onSuccess(
          "2FA setup initiated! Please scan the QR code and verify with a code from your authenticator app to complete setup."
        );
        setShowQrCode(true);
        setPendingVerification(true);
        setPassword("");
      }
    } catch (err) {
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTotp = async () => {
    if (totpCode.length !== 6) {
      onError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    onClearMessages();

    try {
      const { data, error: verifyError } =
        await authClient.twoFactor.verifyTotp({
          code: totpCode,
        });

      if (verifyError) {
        onError(verifyError.message || "Invalid code. Please try again.");
        return;
      }

      if (data) {
        onSuccess(
          "2FA enabled and verified successfully! Your account is now secured with two-factor authentication."
        );
        setPendingVerification(false);
        setTotpCode("");
        // Refresh the page to update the user state
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PasswordForm
        password={password}
        onPasswordChange={setPassword}
        onSubmit={handleEnable2FA}
        loading={loading}
        buttonText="Enable Two-Factor Authentication"
        label="Current Password"
        placeholder="Enter your current password"
      />

      {showQrCode && totpUri && <QRCodeDisplay totpUri={totpUri} />}

      {pendingVerification && (
        <TOTPVerification
          totpCode={totpCode}
          onCodeChange={setTotpCode}
          onVerify={handleVerifyTotp}
          loading={loading}
        />
      )}

      {backupCodes.length > 0 && (
        <BackupCodesDisplay backupCodes={backupCodes} />
      )}
    </div>
  );
}
