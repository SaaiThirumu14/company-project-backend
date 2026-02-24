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

const sendMail = async (name, to = process.env.SEND_EMAIL) => {
  try {
    await transporter.sendMail({
      from: `"MediCare Lab" <${process.env.EMAIL}>`,
      to: to,
      subject: "Remainder for test to be taken",
      text: `Please ensure you have taken the test.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Security Verification</h2>
          <p>Hello,</p>
          <p>Please ensure you have taken the test</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; padding: 10px 0;">
            ${name}
          </div>
          <div>
            <p>If you have already taken the test, please ignore this email.</p>
            <p>If you have not taken the test, please take it as soon as possible.</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Mail error:", err);
  }
};

module.exports = sendMail;
