import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SecurityCardProps {
  twoFactorEnabled?: boolean | undefined;
}

export function SecurityCard({ twoFactorEnabled }: SecurityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Security Settings</span>
        </CardTitle>
        <CardDescription>
          Manage your account security and two-factor authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="h-4 w-4" />
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>
        <Link href="/settings/security">
          <Button className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Configure Two-Factor Authentication
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
