import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = async ({from, to, content, subject, text }) => {
  try {
    await transporter.sendMail({
      from: from || process.env.EMAIL_USER,
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