import Mailgen, { type Content } from "mailgen";
import nodemailer from "nodemailer";

const host = process.env.MAILTRAP_HOST as string;
const port = process.env.MAILTRAP_PORT as string;
const user = process.env.MAILTRAP_USER as string;
const pass = process.env.MAILTRAP_PASS as string;

export const emailVerificationEmailTemplate = (
  emailVerificationUrl: string,
  username: string,
): Content => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to Project Camp!, We are excited to have you on board!",
      action: {
        instructions: "Click the button below to verify your email",
        button: {
          link: emailVerificationUrl,
          text: "Verify Email",
          color: "#22BC66",
        },
      },
      outro: "If you did not request this email, please ignore it.",
    },
  };
};

export const forgotPasswordEmailTemplate = (
  forgotPasswordUrl: string,
  username: string,
): Content => {
  return {
    body: {
      name: username,
      intro:
        "You have received this email because a password reset request for your account was received.",
      action: {
        instructions:
          "Click the button below to reset your password:",
        button: {
          text: "Reset your password",
          link: forgotPasswordUrl,
          color: "#22BC66",
        },
      },
      outro: "If you did not request this email, please ignore it.",
    },
  };
};

export const sendEmail = async (
  options: Content,
  email: string,
  subject: string,
) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Camp",
      link: "https://projectcamp.com",
    },
  });

  const emailtextual = mailGenerator.generatePlaintext(options);
  const emailHTML = mailGenerator.generate(options);

  const transport = nodemailer.createTransport({
    host,
    port: parseInt(port),
    secure: false,
    auth: {
      user,
      pass,
    },
  });

  try {
    const result = await transport.sendMail({
      from: "projectcamp@projectcamp.com",
      to: email,
      subject: subject,
      text: emailtextual,
      html: emailHTML,
    });
    console.log("Email sent id:", result.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
