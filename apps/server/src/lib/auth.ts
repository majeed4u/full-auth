
// auth.ts backend express
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins"

import db from "../../prisma";
import { getOTPEmailTemplate, sendEmail } from "./mailer";

export const auth = betterAuth({
  database: prismaAdapter(db, {

    provider: "sqlite"


  }),
  trustedOrigins: [
    process.env.CORS_ORIGIN || "",
  ],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        try {
          const { html, text, subject } = getOTPEmailTemplate(otp, type);

          await sendEmail({
            to: email,
            subject,
            html,
            text,
          });

          console.log(`OTP email sent successfully to ${email} for ${type}`);
        } catch (error) {
          console.error(`Failed to send OTP email to ${email}:`, error);
          // Re-throw the error so Better Auth knows the email failed
          throw error;
        }
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
    })
  ]
});



