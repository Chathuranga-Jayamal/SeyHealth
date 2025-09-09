// communication-service/controllers/emailController.js
import emailService from "../services/emailService.js";

const sendEmailController = async (req, res) => {
  const { receiver, subject, message } = req.body;
  const sender = req.headers["email"]; // Email of the sender

  if (!receiver || !sender) {
    return res
      .status(400)
      .json({ message: "Sender and receiver emails are required" });
  }

  if (!subject && !message) {
    return res
      .status(400)
      .json({ message: "Subject or message body is required" });
  }

  const result = await emailService.sendEmail({
    to: receiver,
    from: sender,
    subject: subject,
    text: message,
  });

  if (result.success) {
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } else {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to send email",
        error: result.error,
      });
  }
};

export default {
  sendEmailController,
};
