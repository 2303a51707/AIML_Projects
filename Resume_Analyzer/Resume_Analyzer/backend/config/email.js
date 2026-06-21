const nodemailer = require('nodemailer');

const sendVerificationEmail = async (userEmail, otpCode) => {
  // 1. Initialize transporter with robust environment fallbacks
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Must be the 16-character Google App Password
    },
  });

  // 2. Define premium themed layout payload
  const mailOptions = {
    from: `"ResuMatch.ai Support" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Verify Your Email - ResuMatch.ai",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 30px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #0A192F; margin-bottom: 10px;">Welcome to ResuMatch.ai</h2>
          <p style="color: #555; font-size: 16px;">Thank you for registering. Use the 6-digit verification security code below to complete your setup:</p>
          <div style="font-size: 32px; font-weight: bold; color: #0A192F; letter-spacing: 5px; margin: 25px 0; background: #f0f4f8; padding: 15px; border-radius: 4px;">
            ${otpCode}
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">This security code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  // 3. Execute with absolute visibility logging
  try {
    console.log(`[SMTP] Attempting to deliver validation email to: ${userEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log("[SMTP SUCCESS] Email successfully delivered. MessageId:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("[CRITICAL SMTP ERROR EXCEPTION]:", error.message);
    console.error("Full Trace Error Info:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendVerificationEmail;
