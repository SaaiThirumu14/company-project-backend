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

const sendMail = async (otp, to = process.env.SEND_EMAIL) => {
  // Email disabled: SMTP credentials missing (EAUTH PLAIN)
  console.log(`[Email Service Bypass] OTP: ${otp} to ${to}`);
  return;
};

module.exports = sendMail;
