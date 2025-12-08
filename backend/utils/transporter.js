import nodemailer from "nodemailer";

const isProduction = process.env.NODE_ENV === "production";

// export const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

export let transporter;

isProduction
  ? (transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    }))
  : (transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }));

const mailOptions = async ({ from, to, content, subject, text }) => {
  try {
    await transporter.sendMail({
      from: isProduction ? "" : process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: content,
    });
  } catch (error) {
    console.error("Failed to send email: ", error.message);
    throw new Error("Email sending failed");
  }
};

export default mailOptions;
