const nodemailer = require('nodemailer');

// Set up the transporter
// For production, you will need to replace this with your real SMTP credentials
// via `.env` variables (e.g., SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'ethereal_test_user@ethereal.email',
    pass: process.env.SMTP_PASS || 'ethereal_test_pass'
  }
});

const sendOrderReceipt = async (userEmail, orderId, amount) => {
  try {
    const mailOptions = {
      from: '"Sole Savvy" <no-reply@solesavvy.com>',
      to: userEmail,
      subject: `Order Confirmation: #${orderId.slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px;">
          <h2 style="color: #000;">Thank you for your order!</h2>
          <p style="color: #555; font-size: 16px;">We have received your payment of <b>₹${amount}</b> for order <b>#${orderId.slice(-8)}</b>.</p>
          <hr style="border: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="color: #555;">Your sneakers are currently being processed. You will receive another email once your items have shipped.</p>
          <br/>
          <a href="http://localhost:5173/orders" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order Status</a>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order receipt email successfully sent to', userEmail);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('Error sending order receipt email:', error);
    return false;
  }
};

module.exports = { sendOrderReceipt };
