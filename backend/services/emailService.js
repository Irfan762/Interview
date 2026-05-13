import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBulkEmail = async (emails, subject, message) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email credentials missing. Printing email to console instead:');
    console.log(`To: ${emails.join(', ')}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    return { success: true, mode: 'console' };
  }

  const mailOptions = {
    from: `"CracKInterview Admin" <${process.env.EMAIL_USER}>`,
    bcc: emails, // Use BCC to hide list from recipients
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #FFD700;">CracKInterview Announcement</h2>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">You are receiving this because you are a registered user of CracKInterview.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};
