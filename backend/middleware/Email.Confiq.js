const nodemailer = require("nodemailer");

// Step 1: Configure the Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Simplifies config for Gmail
  auth: {
    user: "sohaibmushtaq5@gmail.com", // ✅ Your Gmail
    pass: "aqur zmye olxt uhnq", // ✅ Gmail App Password
  },
});

// Step 2: Reusable email sending function
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"ClickMasters Support" <sohaibmushtaq5@gmail.com>', // ✅ Clean, business-like sender
      to,
      subject,
      text,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    return { success: false, error: error.message };
  }
};

// Step 3: Run the script directly
if (require.main === module) {

  sendEmail(
    "umerkhayam1717@gmail.com", // ✅ Receiver
    "Welcome to ClickMasters 🎉", // ✅ Subject
    "Thank you for joining ClickMasters. We're excited to have you!", // ✅ Plain Text
    `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to ClickMasters 🎉</h2>
        <p>Hi there,</p>
        <p>Thank you for joining our community. We're glad to have you with us!</p>
        <p style="color: #555;">If you have any questions, just reply to this email. We're here to help.</p>
        <br/>
        <p>Best regards,<br/>ClickMasters Team</p>
      </div>
    ` // ✅ Clean HTML body
  );
}

module.exports = sendEmail;