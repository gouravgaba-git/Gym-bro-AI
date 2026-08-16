import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

/**
 * Generate a 6-digit random numeric OTP string.
 */
export function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

let activeTransporter = null;
let isInitialized = false;

/**
 * Create or return active Nodemailer Transporter based on environment configuration:
 * 1. Gmail OAuth2 (priority, matching gouravgaba-git/authentication)
 * 2. Standard SMTP / App Password
 * 3. Null if unconfigured (falls back to console logging)
 */
export function getTransporter() {
  if (activeTransporter) return activeTransporter;

  const googleUserEmail = process.env.GOOGLE_USER_EMAIL || process.env.EMAIL_USER;
  const clientId = process.env.CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  // 1. Gmail OAuth2 Setup
  if (googleUserEmail && clientId && clientSecret && googleRefreshToken) {
    try {
      activeTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: googleUserEmail,
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: googleRefreshToken
        }
      });
      console.log("📧 Email Service: Configured with Gmail OAuth2.");
      return activeTransporter;
    } catch (e) {
      console.error("❌ Failed to initialize Gmail OAuth2 transporter:", e.message);
    }
  }

  // 2. Standard SMTP / Gmail App Password Setup
  const smtpUser = process.env.SMTP_USER || googleUserEmail;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  if (smtpUser && smtpPass) {
    try {
      activeTransporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || "gmail",
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      console.log("📧 Email Service: Configured with SMTP / App Password.");
      return activeTransporter;
    } catch (e) {
      console.error("❌ Failed to initialize SMTP transporter:", e.message);
    }
  }

  if (!isInitialized) {
    console.log("ℹ️ Email Service: No email credentials found in .env. Running in Development mode (OTPs logged to console).");
    isInitialized = true;
  }
  return null;
}

/**
 * Returns a high-energy, dark-themed Gym Bro HTML email template.
 */
export function getOtpEmailTemplate(otp, name = "Athlete") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Gym Bro Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #09090b; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center; background: linear-gradient(180deg, #27272a 0%, #18181b 100%);">
              <div style="display: inline-block; background-color: #f4f4f5; color: #09090b; font-size: 24px; line-height: 48px; width: 48px; height: 48px; border-radius: 12px; font-weight: bold; margin-bottom: 12px;">
                💪
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: #ffffff;">THE GYM BRO</h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Athlete Portal & AI Coach</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #ffffff;">Account Verification Code</h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #a1a1aa;">
                Hey <strong style="color: #ffffff;">${name}</strong>, use the one-time verification code below to activate your Gym Bro account and start tracking your gains:
              </p>

              <!-- OTP Code Display Box -->
              <div style="background-color: #09090b; border: 1px solid #3f3f46; border-radius: 12px; padding: 18px 24px; margin: 0 auto 24px auto; display: inline-block;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #e4e4e7; display: block; margin-left: 8px;">
                  ${otp}
                </span>
              </div>

              <!-- Expiry & Security Notice -->
              <div style="background-color: #27272a; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; text-align: left;">
                <p style="margin: 0; font-size: 12px; line-height: 1.4; color: #d4d4d8;">
                  ⏱️ <strong>Valid for 5 minutes.</strong> If you did not initiate this request, you can safely ignore this email.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; color: #71717a;">
                Stay consistent and crush your goals,<br>
                <strong style="color: #a1a1aa;">Team Gym Bro</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #09090b; padding: 16px 32px; text-align: center; border-top: 1px solid #27272a;">
              <p style="margin: 0; font-size: 11px; color: #52525b;">
                Automated security transmission &bull; Powered by Gym Bro AI
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send OTP Verification Email to user.
 */
export async function sendOtpEmail(toEmail, otp, name = "Athlete") {
  const senderEmail = process.env.GOOGLE_USER_EMAIL || process.env.EMAIL_USER || "noreply@gymbro.app";
  const subject = `Your Gym Bro Verification Code: ${otp}`;
  const textBody = `Your Gym Bro 6-digit verification code is: ${otp}. It will expire in 5 minutes.`;
  const htmlBody = getOtpEmailTemplate(otp, name);

  const transporter = getTransporter();

  // If email transporter is configured, attempt sending with timeout
  if (transporter) {
    try {
      const sendPromise = transporter.sendMail({
        from: `"The Gym Bro" <${senderEmail}>`,
        to: toEmail,
        subject,
        text: textBody,
        html: htmlBody
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email dispatch timed out after 8s")), 8000)
      );

      const info = await Promise.race([sendPromise, timeoutPromise]);
      console.log(`✅ Verification email sent to ${toEmail} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`⚠️ Email dispatch warning for ${toEmail}:`, err.message);
      // Fall through to console log in dev / background
    }
  }

  // Development Fallback Console Banner
  console.log("\n=======================================================");
  console.log(`🔑 [DEV OTP CODE FOR ${toEmail.toUpperCase()}]: ${otp}`);
  console.log("=======================================================\n");

  return { success: true, devMode: true };
}
