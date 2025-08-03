import nodemailer from "nodemailer";

export async function sendVerificationEmail(to: string, link: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "o6228466@gmail.com",
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });
  await transporter
    .verify()
    .then(() => console.log("SMTP Server is ready to take our messages"))
    .catch(() => console.error("SMTP Server is not ready to take message"));

  await transporter.sendMail({
    from: '"Coin Control" <no-reply@o6228466@gmail.com>',
    to,
    subject: "Please verify your email",
    html: `<p>Click <a href=${link}>here<a/> to verify you email address<p/>`,
  });
}
