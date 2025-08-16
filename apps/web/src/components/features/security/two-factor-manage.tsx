"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key, Download } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Loader } from "@/components/common/loader";
import { QRCodeDisplay, BackupCodesDisplay } from "./index";
import { TwoFactorDisable } from "./two-factor-disable";

interface TwoFactorManageProps {
  user: {
    id: string;
    email: string;
  };
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
  onClearMessages: () => void;
}

export function TwoFactorManage({
  user,
  onError,
  onSuccess,
  onClearMessages,
}: TwoFactorManageProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [totpUri, setTotpUri] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleGetTotpUri = async () => {
    if (!password) {
      onError("Password is required to view QR code");
      return;
    }

    setLoading(true);
    onClearMessages();

    try {
      const { data, error: uriError } = await authClient.twoFactor.getTotpUri({
        password,
      });

      if (uriError) {
        onError(uriError.message || "Failed to get TOTP URI");
        return;
      }

      if (data) {
        setTotpUri(data.totpURI);
        setPassword("");
      }
    } catch (err) {
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBackupCodes = async () => {
    if (!password) {
      onError("Password is required to generate backup codes");
      return;
    }

    setLoading(true);
    onClearMessages();

    try {
      const { data, error: generateError } =
        await authClient.twoFactor.generateBackupCodes({
          password,
        });

      if (generateError) {
        onError(generateError.message || "Failed to generate backup codes");
        return;
      }

      if (data) {
        setBackupCodes(data.backupCodes);
        onSuccess("New backup codes generated successfully!");
        setPassword("");
      }
    } catch (err) {
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Key className="h-4 w-4 mr-2" />
              View QR Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>TOTP QR Code</DialogTitle>
              <DialogDescription>
                Enter your password to view the QR code for your authenticator
                app.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qr-password">Current Password</Label>
                <Input
                  id="qr-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>
              <Button
                onClick={handleGetTotpUri}
                disabled={loading || !password}
                className="w-full"
              >
                {loading ? <Loader /> : "Show QR Code"}
              </Button>
              {totpUri && <QRCodeDisplay totpUri={totpUri} />}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate Backup Codes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New Backup Codes</DialogTitle>
              <DialogDescription>
                This will generate new backup codes and invalidate the old ones.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backup-password">Current Password</Label>
                <Input
                  id="backup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>
              <Button
                onClick={handleGenerateBackupCodes}
                disabled={loading || !password}
                className="w-full"
              >
                {loading ? <Loader /> : "Generate New Codes"}
              </Button>
              {backupCodes.length > 0 && (
                <BackupCodesDisplay backupCodes={backupCodes} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <TwoFactorDisable
        user={user}
        onError={onError}
        onSuccess={onSuccess}
        onClearMessages={onClearMessages}
      />
    </div>
  );
}
