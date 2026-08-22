import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendGmail(to: string, subject: string, html: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(
      "Credenciais de e-mail nao configuradas (GMAIL_USER / GMAIL_APP_PASSWORD)"
    );
  }
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&copy;/g, "(c)")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  await transporter.sendMail({
    from: `Barbearia Dreamer <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    text,
    replyTo: process.env.GMAIL_USER,
  });
}
