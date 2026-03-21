// const nodemailer = require("nodemailer");
// 
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASS
//   }
// });

const sendMail = async (name, to = process.env.SEND_EMAIL) => {
  // Lab Email disabled: SMTP credentials missing (EAUTH PLAIN)
  console.log(`[Lab Email Service Bypass] Notification for ${name} to ${to}`);
  return;
};

module.exports = sendMail;
