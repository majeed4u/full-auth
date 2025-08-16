"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, Bell } from "lucide-react";
import { TwoFactorSettings } from "@/components/features/security/two-factor-settings-refactored";

export default function SecuritySettingsPage() {
  const { data: session } = authClient.useSession();

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Please sign in to access security settings.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">
            Manage your account security and privacy settings.
          </p>
        </div>

        <Tabs defaultValue="2fa" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="2fa" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Two-Factor Auth</span>
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="2fa" className="mt-6">
            <TwoFactorSettings
              user={{
                id: session.user.id,
                email: session.user.email,
                twoFactorEnabled: session.user.twoFactorEnabled || false,
              }}
            />
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">User ID</label>
                    <p className="text-sm text-muted-foreground font-mono">
                      {session.user.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Account Created
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {session.user.createdAt
                        ? new Date(session.user.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Notification settings will be available in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
