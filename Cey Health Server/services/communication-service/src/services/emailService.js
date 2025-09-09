// communication-service/services/emailService.js
import transporter from "../emaliConfig.js";

const sendEmail = async ({ to, from, subject, text }) => {
  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

export default {
  sendEmail,
};
