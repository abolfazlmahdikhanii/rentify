import nodemailer from "nodemailer";

export async function sendMail(options) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.eu",
      port: 465,
      secure: true,

      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },

      tls: {
        rejectUnauthorized: false,
      },

      family: 4,
    });

    const info = await transporter.sendMail({
      from: `"Rentify" <${process.env.ZOHO_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log("EMAIL SENT:", info.messageId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("FULL MAIL ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}