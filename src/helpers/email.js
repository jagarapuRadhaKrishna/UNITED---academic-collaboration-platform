import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendOTPEmail = async (email, otp) => {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
        console.log('=================================');
        console.log('DEV MODE: OTP would be sent to:', email);
        console.log('OTP:', otp);
        console.log('=================================');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification OTP',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
          ${otp}
        </div>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully to:', email);
    } catch (error) {
        console.error('Error sending email:', error.message);
        console.error('Full error:', error);
        throw new Error('Failed to send OTP email. Please check email configuration and ensure SMTP access is enabled.');
    }
};

export { sendOTPEmail };
