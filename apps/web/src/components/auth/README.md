# Two-Factor Authentication (2FA) Implementation

This implementation provides comprehensive two-factor authentication for your Task Manager application using Better Auth.

## Features

- **TOTP Authentication**: Support for authenticator apps (Google Authenticator, Authy, etc.)
- **Email OTP**: One-time passwords sent via email
- **Backup Codes**: Recovery codes for account access
- **Trusted Devices**: Device trust for 30 days
- **Complete UI Components**: Ready-to-use React components

## Components

### 1. Two-Factor Verification Page (`/two-factor`)
Located at: `apps/web/src/app/(auth)/two-factor/page.tsx`

This page handles the second factor verification during login. It supports:
- TOTP code verification from authenticator apps
- Email OTP verification
- Backup code verification
- Device trust options

### 2. Two-Factor Settings Component
Located at: `apps/web/src/components/auth/two-factor-settings.tsx`

Comprehensive 2FA management component featuring:
- Enable/disable 2FA
- QR code generation and display
- Backup code generation and management
- TOTP URI management

### 3. Simple Two-Factor Toggle
Located at: `apps/web/src/components/auth/simple-two-factor-toggle.tsx`

A simplified component for quick 2FA enable/disable in user profiles.

### 4. Security Quick Access
Located at: `apps/web/src/components/auth/security-quick-access.tsx`

Dashboard widget showing 2FA status with quick access to settings.

### 5. Security Settings Page
Located at: `apps/web/src/app/(dashboard)/settings/security/page.tsx`

Complete security management page with tabbed interface.

## Hook

### `useTwoFactor`
Located at: `apps/web/src/hooks/use-two-factor.ts`

Custom hook providing all 2FA functionality:
- `enable2FA(password, issuer?)`
- `disable2FA(password)`
- `verifyTOTP(code, trustDevice?)`
- `sendOTP()`
- `verifyOTP(code, trustDevice?)`
- `verifyBackupCode(code, trustDevice?)`
- `generateBackupCodes(password)`
- `getTotpUri(password)`

## Usage Examples

### In a User Dashboard

```tsx
import { SecurityQuickAccess } from "@/components/auth";
import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  const { data: session } = authClient.useSession();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Other dashboard content */}
      <SecurityQuickAccess user={session?.user} />
    </div>
  );
}
```

### In User Settings

```tsx
import { SimpleTwoFactorToggle } from "@/components/auth";
import { authClient } from "@/lib/auth-client";

export default function UserSettings() {
  const { data: session } = authClient.useSession();

  return (
    <div className="space-y-6">
      <SimpleTwoFactorToggle 
        user={session?.user} 
        onUpdate={() => window.location.reload()} 
      />
    </div>
  );
}
```

### Using the Hook

```tsx
import { useTwoFactor } from "@/hooks/use-two-factor";

function CustomComponent() {
  const { loading, error, enable2FA, verifyTOTP } = useTwoFactor();

  const handleEnable = async () => {
    const result = await enable2FA("user-password", "My App");
    if (result.data) {
      console.log("2FA enabled:", result.data);
    }
  };

  const handleVerify = async (code: string) => {
    const result = await verifyTOTP(code, true); // Trust device
    if (result.data) {
      console.log("Verification successful");
    }
  };

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}
```

## Configuration

### Backend (Already Configured)
Your `auth.ts` file is already properly configured with:
- 2FA plugin with email OTP support
- Task Manager as the issuer
- Email sending via your existing mailer setup

### Frontend (Already Configured)
Your `auth-client.ts` is configured with:
- Two-factor client plugin
- Automatic redirect to `/two-factor` page

## Authentication Flow

1. **User logs in** with email/password
2. **If 2FA is enabled**, user is redirected to `/two-factor`
3. **User chooses verification method**:
   - Authenticator app (TOTP)
   - Email OTP
   - Backup code
4. **Upon successful verification**, user is redirected to dashboard
5. **Optional device trust** for 30 days

## Security Features

- **Encrypted secrets**: All TOTP secrets are encrypted in the database
- **One-time backup codes**: Each backup code can only be used once
- **Time-based codes**: TOTP codes expire after 30 seconds
- **Device trust**: Trusted devices skip 2FA for 30 days
- **Password verification**: All sensitive operations require password confirmation

## Navigation

Users can access 2FA settings through:
- Direct link: `/settings/security`
- Dashboard security widget
- User profile/settings integration

## Dependencies

The implementation uses these existing packages:
- `react-qr-code`: QR code generation
- `input-otp`: OTP input component
- `better-auth`: Authentication framework
- Your existing UI components from shadcn/ui

## Backup and Recovery

- **Backup codes**: Users can generate 10 backup codes
- **QR code re-display**: Users can view QR codes anytime with password
- **Email fallback**: OTP can be sent via email as backup method
- **Password reset**: Standard password reset flow remains available
