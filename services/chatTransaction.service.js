import { Chat } from "../models/Chat.model.js";
import { Transaction } from "../models/Transaction.model.js";

export async function addTransactionToChat({
  chatId,
  transactionId,
  senderId
}) {
  const transaction = await Transaction.findById(transactionId)
    .populate("to", "name");

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  await Chat.findByIdAndUpdate(chatId, {
    $push: {
      messages: {
        sender: senderId,
        type: "TRANSACTION",
        content: `Paid ₹${transaction.amount}`,
        transactionSnapshot: {
          amount: transaction.amount,
          to: transaction.to.name,
          date: transaction.createdAt,
          status: transaction.status
        }
      }
    }
  });
}
