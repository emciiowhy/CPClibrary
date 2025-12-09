import nodemailer from "nodemailer";
import { Resend } from "resend";

const isProduction = process.env.NODE_ENV === "production";
const resendApiKey = process.env.RESEND_API_KEY;

// In production, prefer Resend (works on Render without SMTP).
// In development, fall back to nodemailer + Gmail.
const resend =
  isProduction && resendApiKey ? new Resend(resendApiKey) : null;

export let transporter;

if (!resend) {
  // Only instantiate nodemailer when not using Resend
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const mailOptions = async ({ from, to, content, subject, text }) => {
  try {
    if (resend) {
      await resend.emails.send({
        from,
        to,
        subject,
        text,
        html: content,
      });
    } else {
      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html: content,
      });
    }
  } catch (error) {
    console.error("Failed to send email: ", error.message);
    throw new Error("Email sending failed");
  }
};

export default mailOptions;
