import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
  totpUri: string;
  title?: string;
  description?: string;
}

export function QRCodeDisplay({
  totpUri,
  title = "Scan QR Code",
  description = "Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)",
}: QRCodeDisplayProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold text-center">{title}</h3>
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg">
          <QRCode value={totpUri} size={200} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
    </div>
  );
}
