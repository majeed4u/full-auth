
// auth.ts backend express
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins"
import { twoFactor } from "better-auth/plugins"

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
  appName: "Task Manager",
  plugins: [
    twoFactor({
      issuer: "Task Manager",
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          try {
            const { html, text, subject } = getOTPEmailTemplate(otp, "2fa-verification");

            await sendEmail({
              to: user.email,
              subject,
              html,
              text,
            });

            console.log(`2FA OTP email sent successfully to ${user.email}`);
          } catch (error) {
            console.error(`Failed to send 2FA OTP email to ${user.email}:`, error);
            // Re-throw the error so Better Auth knows the email failed
            throw error;
          }
        },
      },
    }),
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
    }),

  ],

});



