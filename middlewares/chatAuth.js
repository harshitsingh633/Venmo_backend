import { Chat } from "../models/chat.modal.js";

export async function chatAuth(req, res, next) {
  const { chatId } = req.params;
  const userId = req.userId;

  const chat = await Chat.findById(chatId);

  if (!chat || !chat.participants.includes(userId)) {
    return res.status(403).json({ message: "Access denied" });
  }

  req.chat = chat;
  next();
}
