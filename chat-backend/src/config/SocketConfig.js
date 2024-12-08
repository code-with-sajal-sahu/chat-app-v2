import { Server } from "socket.io";
import ChatRoom from "../model/ChatRoom.js";
import Message from "../model/Message.js";

const getMyChats = async (userId) => {
  try {
    const chats = await ChatRoom.find(
      {
        participants: { $in: [userId] },
      },
      { messages: 0 }
    )
      .populate({ path: "participants", select: "name username" })
      .populate({
        path: "lastMessage",
        select: "content sender createdAt",
        populate: { path: "sender", select: "name username" },
      })
      .sort({ updatedAt: -1 });

    return { status: 200, message: "Chats fetched successfully", data: chats };
  } catch (error) {
    return { status: 500, message: "Internal server error", data: [error.message] };
  }
};
const getChatMessages = async (chatRoomId) => {
    try {
        const messages = await Message.find({chatRoom: chatRoomId}).populate("sender", "name username");
        return {status: 200, message: "Messages fetched successfully", data: messages};
    } catch (error) {
        return {status: 500, message: "Internal server error", data: [error.message]};
    }
}
const sendMessage = async (sender, receiver, content, socket) => {
    try {
    //   if (!content || !receiver) {
    //     return res
    //       .status(400)
    //       .send({ status: 400, message: "Content and receiver are required" });
    //   }
  
      let chatRoom = await ChatRoom.findOne({
        participants: { $all: [sender, receiver] },
      });
      if (!chatRoom) {
        chatRoom = await ChatRoom.create({ participants: [sender, receiver] });
      }
      const message = await Message.create({
        sender,
        content,
        chatRoom: chatRoom._id,
      });
      chatRoom.lastMessage = message._id;
      chatRoom.messages.push(message._id);
      await chatRoom.save();
      return {status: 200, message: "Messages fetched successfully", data: message};
    } catch (error) {
        return {status: 500, message: "Internal server error", data: [error.message]};
    }
  };
const socketConfig = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  const userSocketMap = new Map(); // Track user-socket mapping

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle user joining with their ID
    socket.on("setup", (userId, userName) => {
      if (!userId) return;

      userSocketMap.set(userId, socket.id);
      socket.join(userId);
      console.log(`${userName} -> Socket_id ${socket.id}`);
    });

    socket.on("get-my-chats", async (userId) => {
      if (!userId) return;

      const chats = await getMyChats(userId);
      socket.emit("my-chats", chats);
    });

    socket.on("get-chat-messages", async (chatRoomId) => {
      if (!chatRoomId) return;

      
      const messages = await getChatMessages(chatRoomId);
      socket.emit("chat-messages", messages);
    });

    socket.on("send-message", async (messageData) => {
      if (!messageData) return;

      const {sender, receiver, content} = messageData;

      const messageInfo = await sendMessage(sender, receiver, content, socket);
      if(messageInfo?.status === 200) {
        socket.emit("new-message", messageInfo);
        socket.to(receiver).emit("new-message", messageInfo);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

export default socketConfig;
