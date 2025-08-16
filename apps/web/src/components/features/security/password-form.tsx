import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/common/loader";

interface PasswordFormProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  loading: boolean;
  buttonText: string;
  label?: string;
  placeholder?: string;
}

export function PasswordForm({
  password,
  onPasswordChange,
  onSubmit,
  loading,
  buttonText,
  label = "Current Password",
  placeholder = "Enter your current password",
}: PasswordFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">{label}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      <Button
        onClick={onSubmit}
        disabled={loading || !password}
        className="w-full"
      >
        {loading ? <Loader /> : buttonText}
      </Button>
    </div>
  );
}
