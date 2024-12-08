import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      trim: true,
      required: false
    },
    file: [{
      type: String,
      trim: true
    }],
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ChatRoom",
      required: true
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
