import React, { useCallback, useEffect, useState, useRef } from "react";
import Index from "../../container/Index";
import PageIndex from "../../container/PageIndex";
import io from "socket.io-client";

const MessageBubble = Index.styled(Index.Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: 16,
  maxWidth: "70%",
  alignSelf: isUser ? "flex-end" : "flex-start",
  backgroundColor: isUser
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  color: isUser
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  transition: theme.transitions.create(["background-color", "color"], {
    duration: theme.transitions.duration.standard,
  }),
}));

const SOCKET_ENDPOINT = "http://localhost:5000";

const ChatRoom = () => {
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const { selectedChat, setNewMessage, newMessage } = PageIndex.useAppContext();
  const myProfile = JSON.parse(localStorage.getItem("user"));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    const newSocket = io(SOCKET_ENDPOINT);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && myProfile?.id) {
      socket.emit("setup", myProfile.id);
    }
  }, [socket, myProfile?.id]);

  useEffect(() => {
    if (socket && selectedChat?.chatRoom) {
      socket.emit("join chat", selectedChat.chatRoom);
    }
    if (socket) {
      socket.on("message received", (message) => {
        if (selectedChat?.chatRoom === message.chatRoom) {
          setChatMessages((prev) => [...prev, message]);
        }
        setNewMessage(!newMessage);
      });
    }
  }, [socket, selectedChat?.chatRoom]);

  const handleSendMessage = async () => {
    const response = await PageIndex.handlePostRequest(
      PageIndex.API.SEND_MESSAGE,
      {
        content: messageInput,
        receiverId: selectedChat?.user?._id,
      },
      false
    );
    if (response.status === 200) {
      if (socket) {
        socket.emit("new message", {
          chatRoomId: selectedChat.chatRoom,
          message: response.data,
        });
      }
      setChatMessages((prev) => [...prev, response.data]);
      setMessageInput("");
      setNewMessage(!newMessage);
    }
  };

  const handleGetChatMessages = useCallback(async () => {
    const response = await PageIndex.handlePostRequest(
      PageIndex.API.GET_CHAT_MESSAGES,
      {
        chatRoomId: selectedChat?.chatRoom,
      },
      false
    );
    if (response.status === 200) {
      setChatMessages(response.data);
    }
  }, [selectedChat?.chatRoom]);

  useEffect(() => {
    if (selectedChat?.chatRoom) {
      handleGetChatMessages();
    } else {
      setChatMessages([]);
    }
  }, [selectedChat?.chatRoom, handleGetChatMessages]);

  return (
    <>
      {/* Chat messages */}
      <Index.Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflow: "auto",
          // display: "flex",
          // flexDirection: "column",
          // justifyContent: "end",
        }}
      >
        {/* Messages would go here */}
        {chatMessages.map((message) => (
          <Index.Box
            key={message.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems:
                message.sender?._id == myProfile?.id ||
                message.sender == myProfile?.id
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            <MessageBubble
              isUser={
                message.sender?._id == myProfile?.id ||
                message.sender == myProfile?.id
              }
            >
              <Index.Typography variant="body1">
                {message.content}
              </Index.Typography>
            </MessageBubble>
            <Index.Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 0.5,
                transition: (theme) =>
                  theme.transitions.create("color", {
                    duration: theme.transitions.duration.standard,
                  }),
              }}
            >
              {Index.moment(message.createdAt).format("hh:mm A")}
            </Index.Typography>
          </Index.Box>
        ))}
        <div ref={messagesEndRef} />
      </Index.Box>

      {/* Message input */}
      <Index.Paper
        elevation={3}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          transition: (theme) =>
            theme.transitions.create(["background-color", "box-shadow"], {
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        <Index.IconButton>
          <Index.AttachFile />
        </Index.IconButton>
        <Index.TextField
          fullWidth
          placeholder="Type your message here..."
          variant="outlined"
          size="small"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Index.IconButton color="primary" onClick={handleSendMessage}>
          <Index.Send />
        </Index.IconButton>
      </Index.Paper>
    </>
  );
};

export default ChatRoom;
