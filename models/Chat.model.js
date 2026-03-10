import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // AI messages may not have sender
    },

    senderType: {
      type: String,
      enum: ["USER", "AI", "SYSTEM"],
      default: "USER"
    },

    content: {
      type: String,
      required: true
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
