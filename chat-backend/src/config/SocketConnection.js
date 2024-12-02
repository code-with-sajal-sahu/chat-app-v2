import { Server } from "socket.io";

const initializeSocket = (server) => {
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
    socket.on("setup", (userId) => {
      userSocketMap.set(userId, socket.id);
      socket.join(userId);
      console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    // Join chat room
    socket.on("join chat", (chatRoomId) => {
      socket.join(chatRoomId);
      console.log(`User joined room: ${chatRoomId}`);
    });

    // Handle new message
    socket.on("new message", (messageData) => {
      const { chatRoomId, message } = messageData;
      
      if (!chatRoomId) return;

      // Broadcast to all users in the chat room except sender
      socket.to(chatRoomId).emit("message received", message);
    });

    // Handle typing status
    socket.on("typing", (chatRoomId) => {
      socket.to(chatRoomId).emit("typing", chatRoomId);
    });

    socket.on("stop typing", (chatRoomId) => {
      socket.to(chatRoomId).emit("stop typing", chatRoomId);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      // Remove user from mapping
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export default initializeSocket;
