const nodeMailer = require("nodemailer");
const User = require("../models/User");

const MAIL_HOST = process.env.REACT_APP_MAIL_HOST;
const MAIL_PORT = process.env.REACT_APP_MAIL_PORT;
const MAIL_USERNAME = process.env.REACT_APP_MAIL_USERNAME;
const MAIL_PASSWORD = process.env.REACT_APP_MAIL_PASSWORD;

const FROM_ADDRESS = process.env.REACT_APP_FROM_ADDRESS;
const FROM_NAME = process.env.REACT_APP_FROM_NAME;

const transporter = nodeMailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: true,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
});

async function mailerVerify() {
  // Make sure you have created a User object with a valid email property
  const user = new User({ email: "user@example.com" });

  const htmlContent = `<p>Please verify your email address, ${user.email}, by clicking on the button below.</p>`;
  const info = await transporter.sendMail({
    from: `${FROM_NAME} <${FROM_ADDRESS}>`,
    to: to,
    subject: "Verify Email at Chợ Đất Gia Lai",
    text: "Xin chào",
    html: htmlContent,
  });
  console.log("Message sent: %s", info.messageId);
}

mailerVerify().catch(console.error);
