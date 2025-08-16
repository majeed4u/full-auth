import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Settings, ChevronRight } from "lucide-react";

interface SecurityQuickAccessProps {
  user: {
    twoFactorEnabled?: boolean | null;
  };
}

export function SecurityQuickAccess({ user }: SecurityQuickAccessProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Security</span>
        </CardTitle>
        <CardDescription>
          Quick access to your security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">
                Extra security for your account
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={user.twoFactorEnabled ? "default" : "secondary"}>
              {user.twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
            <Link href="/settings/security">
              <Button variant="ghost" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Link href="/settings/security">
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Manage Security Settings
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
