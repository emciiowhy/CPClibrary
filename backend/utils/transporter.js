import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = ({from, to, content, subject, text }) => {
  transporter.sendMail({
    from: from || process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
    html: content,
  });
};

export default mailOptions;