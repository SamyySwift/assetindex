import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Email Configuration...');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('Secure:', process.env.SMTP_SECURE);
console.log('User:', process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // Adding debug options
    logger: true,
    debug: true
});

async function testEmail() {
    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ Server connection verified');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"Test Asset Index" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to yourself
            subject: "Test Email from Asset Index",
            text: "If you receive this, your email configuration is correct!",
            html: "<b>If you receive this, your email configuration is correct!</b>",
        });

        console.log("✅ Message sent: %s", info.messageId);
    } catch (error) {
        console.error("❌ Error occurred:", error);
    }
}

testEmail();
