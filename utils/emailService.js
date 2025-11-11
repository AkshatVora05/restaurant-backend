const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const generateOTP = () => {
    const crypto = require('crypto');
    return crypto.randomInt(100000, 999999).toString();
};

const sendVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: `Restaurant Food App <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Account Verification Code (OTP)',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Email Verification</h2>
                <p>Use the following One-Time Password (OTP) to complete your registration:</p>
                <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center;">
                    <h1 style="color: #333; margin: 0; letter-spacing: 3px;">${otp}</h1>
                </div>
                <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to: ${email}`);
        return true;
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        return false;
    }
};

module.exports = { generateOTP, sendVerificationEmail };