const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sohaibmushtaq5@gmail.com",
    pass: "aqur zmye olxt uhnq", // Your Gmail App Password
  },
});

const sendverficationcode = async (email, verificationCode) => {
  const subject = "Email Verification - ClickMasters";

  const text = `Hi,

Thank you for registering with ClickMasters.

Your email verification code is: ${verificationCode}

If you did not request this, please ignore this email.

Regards,
ClickMasters Support Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Email Verification</h2>
      <p>Hi,</p>
      <p>Thank you for registering with <strong>ClickMasters</strong>.</p>
      <p>Your email verification code is:</p>
      <h2 style="color: #007BFF;">${verificationCode}</h2>
      <p>If you did not request this, please ignore this email.</p>
      <br/>
      <p>Regards,<br/>ClickMasters Support Team</p>
      <hr/>
      <small>This is a system-generated email. Please do not reply.</small>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"ClickMasters Support" <sohaibmushtaq5@gmail.com>', // Clean sender
      to: email,
      subject,
      text,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendverficationcode };