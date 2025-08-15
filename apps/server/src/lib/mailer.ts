// backend/utils/mailer.ts
import nodemailer from "nodemailer";

// Configure your SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP configuration error:', error);
    } else {
        console.log('SMTP server is ready to send emails');
    }
});

// Function to send email
// Function to send email
export async function sendEmail({
    to,
    subject,
    html,
    text,
}: {
    to: string;
    subject: string;
    html: string;
    text?: string;
}) {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.APP_NAME || 'Task Manager'}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            text, // Plain text fallback
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}



// Email templates for different OTP types
export function getOTPEmailTemplate(otp: string, type: string) {
    const getEmailContent = (type: string) => {
        switch (type) {
            case 'sign-in':
                return {
                    heading: 'Sign In to Your Account',
                    message: 'Use this code to sign in to your Task Manager account:',
                    icon: '🔐'
                };
            case 'email-verification':
                return {
                    heading: 'Verify Your Email Address',
                    message: 'Use this code to verify your email address:',
                    icon: '✉️'
                };
            case 'forget-password':
                return {
                    heading: 'Reset Your Password',
                    message: 'Use this code to reset your password:',
                    icon: '🔑'
                };
            default:
                return {
                    heading: 'Your Verification Code',
                    message: 'Your verification code is:',
                    icon: '🔢'
                };
        }
    };

    const content = getEmailContent(type);

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${content.heading}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
                        ${content.icon} ${process.env.APP_NAME || 'Task Manager'}
                    </h1>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; text-align: center;">
                        ${content.heading}
                    </h2>
                    
                    <p style="color: #666; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                        ${content.message}
                    </p>
                    
                    <!-- OTP Code Box -->
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);">
                        <div style="font-size: 42px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otp}
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #888; font-size: 14px; margin: 5px 0;">
                            ⏰ This code expires in <strong>5 minutes</strong>
                        </p>
                        <p style="color: #888; font-size: 14px; margin: 5px 0;">
                            🔒 Keep this code confidential and don't share it with anyone
                        </p>
                    </div>
                </div>
                
                <!-- Security Notice -->
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px 20px; margin: 20px 30px; border-radius: 4px;">
                    <p style="color: #856404; font-size: 14px; margin: 0;">
                        <strong>🛡️ Security Notice:</strong> If you didn't request this code, please ignore this email and consider securing your account.
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #dee2e6;">
                    <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                        This email was sent by ${process.env.APP_NAME || 'Task Manager'}
                    </p>
                    <p style="color: #6c757d; font-size: 12px; margin: 0;">
                        Please do not reply to this automated email.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    const text = `
        ${content.heading}
        
        ${content.message}
        
        Your verification code is: ${otp}
        
        This code will expire in 5 minutes.
        
        If you didn't request this code, please ignore this email.
        
        ---
        ${process.env.APP_NAME || 'Task Manager'}
        Do not reply to this email.
    `;

    return { html, text, subject: content.heading };
}
