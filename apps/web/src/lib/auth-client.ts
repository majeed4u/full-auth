
// auth-client.ts frontend
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_SERVER_URL,
  plugins: [
    emailOTPClient()
  ]
});
