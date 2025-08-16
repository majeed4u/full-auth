import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Shield } from "lucide-react";

interface BackupCodesDisplayProps {
  backupCodes: string[];
  onDownload?: () => void;
}

export function BackupCodesDisplay({
  backupCodes,
  onDownload,
}: BackupCodesDisplayProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }

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
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Backup Codes</h3>
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Save these backup codes in a secure location. You can use them to access
        your account if you lose your authenticator device.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {backupCodes.map((code, index) => (
          <code key={index} className="p-2 bg-muted rounded text-sm font-mono">
            {code}
          </code>
        ))}
      </div>
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Each backup code can only be used once. Keep them safe and secure.
        </AlertDescription>
      </Alert>
    </div>
  );
}
