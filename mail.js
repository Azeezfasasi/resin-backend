const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
    const msg = {
        to: to, // Change to recipient email
        from: 'fas.azeez@gmail.com',
        subject: subject,
        text: text,
        html: `<strong>${text}</strong>`, // Optional HTML version
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully!');
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error);
        return { success: false, message: 'Failed to send email!' };
    }
};

// Test email function
// sendEmail("fas.azeez@gmail.com", "Test Email", "Hello! This is a test email using SendGrid API.");

module.exports = sendEmail;
