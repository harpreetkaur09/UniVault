const Message = require("../models/Message");

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const savedMessage = await Message.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: { id: savedMessage._id },
    });
  } catch (error) {
    console.error("Contact save error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

module.exports = { sendContactMessage };
