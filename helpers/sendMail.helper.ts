import exp from "constants";
import nodemailer, { SentMessageInfo } from "nodemailer";

// Defining types for the mail options
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const sendMail = (
  email: string,
  subject: string,
  html: string
): void => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions: MailOptions = {
    from: "chinh9675pl365@gmail.com",
    to: email,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info: SentMessageInfo) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendMail;