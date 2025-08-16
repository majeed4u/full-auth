import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader } from "@/components/common/loader";

interface TOTPVerificationProps {
  totpCode: string;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  loading: boolean;
}

export function TOTPVerification({
  totpCode,
  onCodeChange,
  onVerify,
  loading,
}: TOTPVerificationProps) {
  return (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="font-medium text-center">Verify Setup</h4>
      <p className="text-sm text-muted-foreground text-center">
        Enter the 6-digit code from your authenticator app to complete setup
      </p>
      <div className="flex justify-center">
        <InputOTP value={totpCode} onChange={onCodeChange} maxLength={6}>
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
        onClick={onVerify}
        disabled={loading || totpCode.length !== 6}
        className="w-full"
      >
        {loading ? <Loader /> : "Verify & Complete Setup"}
      </Button>
    </div>
  );
}
