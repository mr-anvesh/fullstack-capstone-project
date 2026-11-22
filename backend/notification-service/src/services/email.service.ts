import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const port = Number(process.env.SMTP_PORT ?? 587);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type Email = { to: string; subject: string; text: string };

export async function sendEmail(email: Email) {
  const result = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    ...email,
  });

  if (result.accepted.length === 0) {
    throw new Error('SMTP server did not accept the recipient');
  }
}