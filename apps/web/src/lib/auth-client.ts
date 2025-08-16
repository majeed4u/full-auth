
// auth-client.ts frontend
import { createAuthClient } from "better-auth/react";
import { emailOTPClient, twoFactorClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_SERVER_URL,
  plugins: [
    emailOTPClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        // Redirect to the two-factor authentication page
        window.location.href = "/two-factor";
      },
    })
  ]
});
