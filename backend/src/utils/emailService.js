const nodemailer = require('nodemailer');

// Use Ethereal for testing in development
const getTransporter = async () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }
};

const sendResetOTP = async (email, otp) => {
  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: '"ElimuPath Authentication" <noreply@elimupath.test>', // sender address
      to: email, // list of receivers
      subject: 'Password Reset Code - ElimuPath', // Subject line
      text: `Your password reset code is: ${otp}. It expires in 15 minutes.`, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2>Password Reset Request</h2>
          <p>Please use the following 6-digit code to reset your password:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0; padding: 10px; background: #f0f0f0; border-radius: 5px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This code expires in 15 minutes. If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    
    // Preview only available when sending through an Ethereal account
    if (process.env.NODE_ENV !== 'production') {
      console.log('--- OTP PREVIEW URL ---');
      console.log(nodemailer.getTestMessageUrl(info));
      console.log('-----------------------');
    }
    
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

module.exports = { sendResetOTP };
