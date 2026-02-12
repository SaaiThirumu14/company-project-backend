const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

const sendMail = async (otp, to = process.env.SEND_EMAIL) => {
  try {
    const info = await transporter.sendMail({
      from: '"hii" <tm1492004@gmail.com>',
      to: to,
      subject: "Your Verification Code",
      text: `Your OTP is ${otp}. It will expire in 1 minute.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Security Verification</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) for logging into Kathir Memorial Hospital is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; padding: 10px 0;">
            ${otp}
          </div>
          <p>For security reasons, do not share this code with anyone. This code will expire in 1 minute.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });

      } catch (err) {
    console.error("Mail error:", err);
  }
};

module.exports = sendMail;
