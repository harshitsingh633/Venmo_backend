import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // AI messages
    },

    senderType: {
      type: String,
      enum: ["USER", "AI", "SYSTEM"],
      default: "USER"
    },

    messageType: {
      type: String,
      enum: ["TEXT", "TRANSACTION"],
      default: "TEXT"
    },

    content: {
      type: String
    },

    transactionSnapshot: {
      amount: Number,
      to: String,
      date: Date,
      status: String
    }
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    messages: [messageSchema]
  },
  { timestamps: true }
);

// 🔐 Enforce max 5 participants
chatSchema.path("participants").validate(function (value) {
  return value.length <= 5;
}, "Chat can have at most 5 participants");

export const Chat = mongoose.model("Chat", chatSchema);
