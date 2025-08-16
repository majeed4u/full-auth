import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldX } from "lucide-react";

interface TwoFactorStatusProps {
  enabled: boolean;
  title?: string;
}

export function TwoFactorStatus({
  enabled,
  title = "Two-Factor Authentication",
}: TwoFactorStatusProps) {
  return (
    <div className="flex items-center space-x-2">
      {enabled ? (
        <ShieldCheck className="h-5 w-5 text-green-600" />
      ) : (
        <ShieldX className="h-5 w-5 text-red-600" />
      )}
      <span className="font-semibold">{title}</span>
      <Badge variant={enabled ? "default" : "secondary"}>
        {enabled ? "Enabled" : "Disabled"}
      </Badge>
    </div>
  );
}
