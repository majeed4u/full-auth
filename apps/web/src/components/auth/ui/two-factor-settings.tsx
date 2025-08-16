// two-factor-settings.tsx
"use client";

import { useState, useEffect } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";
import {
  Shield,
  ShieldCheck,
  ShieldX,
  Key,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import QRCode from "react-qr-code";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TwoFactorSettingsProps {
  user: {
    id: string;
    email: string;
    twoFactorEnabled?: boolean;
  };
}

export function TwoFactorSettings({ user }: TwoFactorSettingsProps) {
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totpUri, setTotpUri] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleEnable2FA = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error: enableError } = await authClient.twoFactor.enable({
        password,
        issuer: "Task Manager",
      });

      if (enableError) {
        setError(enableError.message || "Failed to enable 2FA");
        return;
      }

      if (data) {
        setTotpUri(data.totpURI);
        setBackupCodes(data.backupCodes);
        setSuccess(
          "2FA setup initiated! Please scan the QR code and verify with a code from your authenticator app to complete setup."
        );
        setShowQrCode(true);
        setPendingVerification(true);
        setPassword("");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTotp = async () => {
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
        });

      if (verifyError) {
        setError(verifyError.message || "Invalid code. Please try again.");
        return;
      }

      if (data) {
        setSuccess(
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
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirmPassword) {
      setError("Password is required to disable 2FA");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error: disableError } = await authClient.twoFactor.disable({
        password: confirmPassword,
      });

      if (disableError) {
        setError(disableError.message || "Failed to disable 2FA");
        return;
      }

      if (data) {
        setSuccess("2FA disabled successfully!");
        setConfirmPassword("");
        setTotpUri("");
        setBackupCodes([]);
        setShowQrCode(false);
        // Refresh the page to update the user state
        window.location.reload();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBackupCodes = async () => {
    if (!password) {
      setError("Password is required to generate backup codes");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: generateError } =
        await authClient.twoFactor.generateBackupCodes({
          password,
        });

      if (generateError) {
        setError(generateError.message || "Failed to generate backup codes");
        return;
      }

      if (data) {
        setBackupCodes(data.backupCodes);
        setSuccess("New backup codes generated successfully!");
        setShowBackupCodes(true);
        setPassword("");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetTotpUri = async () => {
    if (!password) {
      setError("Password is required to view QR code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: uriError } = await authClient.twoFactor.getTotpUri({
        password,
      });

      if (uriError) {
        setError(uriError.message || "Failed to get TOTP URI");
        return;
      }

      if (data) {
        setTotpUri(data.totpURI);
        setShowQrCode(true);
        setPassword("");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join("\n");
    const blob = new Blob([codesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            {user.twoFactorEnabled ? (
              <ShieldCheck className="h-5 w-5 text-green-600" />
            ) : (
              <ShieldX className="h-5 w-5 text-red-600" />
            )}
            <CardTitle>Two-Factor Authentication</CardTitle>
            <Badge variant={user.twoFactorEnabled ? "default" : "secondary"}>
              {user.twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <CardDescription>
            Add an extra layer of security to your account by enabling
            two-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={user.twoFactorEnabled ? "manage" : "enable"}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="enable" disabled={user.twoFactorEnabled}>
                Enable 2FA
              </TabsTrigger>
              <TabsTrigger value="manage" disabled={!user.twoFactorEnabled}>
                Manage 2FA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="enable" className="space-y-4">
              {!user.twoFactorEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="enable-password">Current Password</Label>
                    <Input
                      id="enable-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>
                  <Button
                    onClick={handleEnable2FA}
                    disabled={loading || !password}
                    className="w-full"
                  >
                    {loading ? <Loader /> : "Enable Two-Factor Authentication"}
                  </Button>

                  {showQrCode && totpUri && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h3 className="font-semibold text-center">
                        Scan QR Code
                      </h3>
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-lg">
                          <QRCode value={totpUri} size={200} />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Scan this QR code with your authenticator app (Google
                        Authenticator, Authy, etc.)
                      </p>

                      {pendingVerification && (
                        <div className="space-y-4 pt-4 border-t">
                          <h4 className="font-medium text-center">
                            Verify Setup
                          </h4>
                          <p className="text-sm text-muted-foreground text-center">
                            Enter the 6-digit code from your authenticator app
                            to complete setup
                          </p>
                          <div className="flex justify-center">
                            <InputOTP
                              value={totpCode}
                              onChange={setTotpCode}
                              maxLength={6}
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
                          </div>
                          <Button
                            onClick={handleVerifyTotp}
                            disabled={loading || totpCode.length !== 6}
                            className="w-full"
                          >
                            {loading ? <Loader /> : "Verify & Complete Setup"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {backupCodes.length > 0 && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Backup Codes</h3>
                        <Button
                          onClick={downloadBackupCodes}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Save these backup codes in a secure location. You can
                        use them to access your account if you lose your
                        authenticator device.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {backupCodes.map((code, index) => (
                          <code
                            key={index}
                            className="p-2 bg-muted rounded text-sm font-mono"
                          >
                            {code}
                          </code>
                        ))}
                      </div>
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          Each backup code can only be used once. Keep them safe
                          and secure.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              {user.twoFactorEnabled && (
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
                            Enter your password to view the QR code for your
                            authenticator app.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="qr-password">
                              Current Password
                            </Label>
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
                          {totpUri && (
                            <div className="flex justify-center">
                              <div className="bg-white p-4 rounded-lg">
                                <QRCode value={totpUri} size={200} />
                              </div>
                            </div>
                          )}
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
                            This will generate new backup codes and invalidate
                            the old ones.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="backup-password">
                              Current Password
                            </Label>
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
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">
                                  New Backup Codes
                                </h4>
                                <Button
                                  onClick={downloadBackupCodes}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {backupCodes.map((code, index) => (
                                  <code
                                    key={index}
                                    className="p-2 bg-muted rounded text-sm font-mono"
                                  >
                                    {code}
                                  </code>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-4 p-4 border border-destructive rounded-lg">
                    <h3 className="font-semibold text-destructive">
                      Disable Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Disabling 2FA will make your account less secure. Are you
                      sure you want to continue?
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
                      {loading ? (
                        <Loader />
                      ) : (
                        "Disable Two-Factor Authentication"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
