"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TwoFactorStatus } from "@/components/features/security";
import { TwoFactorEnable } from "./two-factor-enable";
import { TwoFactorManage } from "./two-factor-manage";

interface TwoFactorSettingsProps {
  user: {
    id: string;
    email: string;
    twoFactorEnabled?: boolean;
  };
}

export function TwoFactorSettings({ user }: TwoFactorSettingsProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <TwoFactorStatus enabled={user.twoFactorEnabled || false} />
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
              <TwoFactorEnable
                user={user}
                onError={setError}
                onSuccess={setSuccess}
                onClearMessages={clearMessages}
              />
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              <TwoFactorManage
                user={user}
                onError={setError}
                onSuccess={setSuccess}
                onClearMessages={clearMessages}
              />
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
