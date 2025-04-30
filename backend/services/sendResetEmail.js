const nodemailer = require("nodemailer");

module.exports = async function sendResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `http://localhost:5173/reset-password/${token}`;

  const mailOptions = {
    from: 'ismat6812@gmail.com',
    to: email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
