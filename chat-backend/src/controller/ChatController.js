import ChatRoom from "../model/ChatRoom.js";
import Message from "../model/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;
    const sender = req.user._id;

    if (!content || !receiverId) {
      return res
        .status(400)
        .send({ status: 400, message: "Content and receiverId are required" });
    }

    let chatRoom = await ChatRoom.findOne({
      participants: { $all: [sender, receiverId] },
    });
    if (!chatRoom) {
      chatRoom = await ChatRoom.create({ participants: [sender, receiverId] });
    }
    const message = await Message.create({
      sender,
      content,
      chatRoom: chatRoom._id,
    });
    chatRoom.lastMessage = message._id;
    chatRoom.messages.push(message._id);
    await chatRoom.save();
    res.status(200).send({
      status: 200,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal server error",
      data: [error.message],
    });
  }
};

export const getMyChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await ChatRoom.find({
      participants: { $in: [userId] },
    }, {messages: 0})
      .populate({ path: "participants", select: "name username" })
      .populate({
        path: "lastMessage",
        select: "content sender createdAt",
        populate: { path: "sender", select: "name username" },
      }).sort({updatedAt: -1});
    res.status(200).send({
      status: 200,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal server error",
      data: [error.message],
    });
  }
};


export const getChatMessages = async (req, res) => {
    try {
        const {chatRoomId} = req.body;
        const messages = await Message.find({chatRoom: chatRoomId}).populate("sender", "name username");
        res.status(200).send({
            status: 200,
            message: "Messages fetched successfully",
            data: messages,
        });
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "Internal server error",
            data: [error.message],
        });
    }
}
