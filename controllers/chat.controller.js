import { callMimoAI } from "../services/openRouter.js";
import { Chat } from "../models/chat.modal.js";

export const chatHandler = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // 🔐 Security guard
    if (
      message.toLowerCase().includes("password") ||
      message.toLowerCase().includes("otp")
    ) {
      return res.json({
        role: "assistant",
        content:
          "For security reasons, please do not share sensitive information in chat."
      });
    }

    // 🧠 System instruction (VERY IMPORTANT)
    const messages = [
      {
        role: "system",
        content:
          "You are a Paytm-like finance assistant. NEVER ask for passwords, OTPs, or full card numbers."
      },
      {
        role: "user",
        content: message
      }
    ];

    const aiReply = await callMimoAI(messages);

    // 💾 Store only last 5 chat participants logic later
    await Chat.create({
      userId,
      sender: "user",
      message
    });

    await Chat.create({
      userId,
      sender: "assistant",
      message: aiReply
    });

    return res.json({
      role: "assistant",
      content: aiReply
    });

  } catch (err) {
    return res.status(500).json({
      message: "AI service error"
    });
  }
};
