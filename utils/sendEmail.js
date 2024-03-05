const nodemailer = require("nodemailer");

const sendEmail = async (
  recipientEmail,
  subject,
  textContent,
  htmlContent = null
) => {
  const senderEmail = "suzalsigdel1@gmail.com";
  const senderPassword = "zavz taav cgjv ckdh";
  // Create a Nodemailer transporter object
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });

  // Set up email data
  let mailOptions = {
    from: senderEmail,
    to: recipientEmail,
    subject: subject,
    text: textContent,
    html: htmlContent,
  };

  try {
    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true; // Email sent successfully
  } catch (error) {
    console.error("Error occurred:", error);
    return false; // Email sending failed
  }
};

module.exports = { sendEmail };
