import { Server } from "socket.io";
import ChatRoom from "../model/ChatRoom.js";
import Message from "../model/Message.js";
import fs from "fs";
import path from "path";

const uploadFile = async (file) => {
  try {
    if (!file || !file.value || !file.name) {
      return {
        status: 400,
        message: "Invalid file format",
        data: null
      };
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = 'public/upload';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // Write buffer directly to disk
    fs.writeFileSync(filepath, file.value);

    return {
      status: 200,
      message: "File uploaded successfully",
      data: filename
    };

  } catch (error) {
    return {
      status: 500, 
      message: "Error uploading file",
      data: error.message
    };
  }
};

const uploadMultipleFiles = async (files) => {
  try {
    if (!files || !Array.isArray(files) || files.length === 0) {
      return {
        status: 400,
        message: "No files provided",
        data: null
      };
    }

    // Validate file format
    const validFiles = files.every(file => file.value && file.name);
    if (!validFiles) {
      return {
        status: 400,
        message: "Invalid file format in array",
        data: null
      };
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = 'public/upload';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Generate unique filename for each file
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const filepath = path.join(uploadDir, filename);

      // Write buffer directly to disk
      fs.writeFileSync(filepath, file.value);

      uploadedFiles.push(filename);
    }

    return {
      status: 200,
      message: "Files uploaded successfully",
      data: uploadedFiles
    };

  } catch (error) {
    return {
      status: 500,
      message: "Error uploading files", 
      data: error.message
    };
  }
};



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
    return {
      status: 500,
      message: "Internal server error",
      data: [error.message],
    };
  }
};
const getChatMessages = async (chatRoomId) => {
  try {
    const messages = await Message.find({ chatRoom: chatRoomId }).populate(
      "sender",
      "name username"
    );
    return {
      status: 200,
      message: "Messages fetched successfully",
      data: messages,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal server error",
      data: [error.message],
    };
  }
};
const sendMessage = async (sender, receiver, content, file) => {
  try {
    //   if (!content || !receiver) {
    //     return res
    //       .status(400)
    //       .send({ status: 400, message: "Content and receiver are required" });
    //   }
    console.log("41: ", file);
    let uploadedFile = "";
    if (file) {
      // const uploadDir = path.join(process.cwd(), "public", "upload");

      // // Create upload directory if it doesn't exist
      // if (!fs.existsSync(uploadDir)) {
      //   fs.mkdirSync(uploadDir, { recursive: true });
      // }

      // // Generate unique filename
      // const fileName = `${Date.now()}-${file?.name}`;
      // const filePath = path.join(uploadDir, fileName);
      // console.log("56: ", filePath);
      // // Write buffer to file
      // fs.writeFileSync(filePath, file?.value);

      // // Update file path to be relative URL
      // uploadedFile = fileName;

      if (Array.isArray(file)) {
        // Handle multiple files
        uploadedFile = await uploadMultipleFiles(file);
      } else {
        // Handle single file
        uploadedFile = await uploadFile(file);
      }
    }

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
      file: uploadedFile?.data || [],
    });
    console.log("54: ", message);
    chatRoom.lastMessage = message._id;
    chatRoom.messages.push(message._id);
    await chatRoom.save();
    return {
      status: 200,
      message: "Messages fetched successfully",
      data: message,
    };
  } catch (error) {
    console.log("82: ", error);
    return {
      status: 500,
      message: "Internal server error",
      data: [error.message],
    };
  }
};
const socketConfig = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 1e8,
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
      // console.log("100: ", messageData)

      const { sender, receiver, content, file } = messageData;

      const messageInfo = await sendMessage(sender, receiver, content, file);
      if (messageInfo?.status === 200) {
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
