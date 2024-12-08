import React, { useCallback, useEffect, useState, useRef } from "react";
import Index from "../../container/Index";
import PageIndex from "../../container/PageIndex";
import io from "socket.io-client";
import { useSocket } from "../../context/SocketContext";
import { useAppContext } from "../../context/AppContext";

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
  const { selectedChat, setNewMessage, newMessage } = PageIndex.useAppContext();
  const myProfile = JSON.parse(localStorage.getItem("user"));
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);
  const { userProfile } = useAppContext();

  const handleSendMessage = () => {
    if (messageInput) {
      socket?.emit("send-message", {
        sender: userProfile?.id,
        receiver: selectedChat?.user?._id,
        content: messageInput,
      });
      setMessageInput("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    setChatMessages([]);
    if (socket && selectedChat?.chatRoom) {
      socket.emit("get-chat-messages", selectedChat?.chatRoom);
    }
    socket?.on("chat-messages", (chatMessages) => {
      if (chatMessages?.status === 200) {
        setChatMessages(chatMessages?.data);
      }
    });

    socket?.on("new-message", (messageInfo) => {
      if (messageInfo?.status === 200) {
        if (
          (selectedChat && !selectedChat.chatRoom) ||
          selectedChat?.chatRoom === messageInfo?.data?.chatRoom
        ) {
          setChatMessages((prev) => {
            return [...prev, messageInfo?.data];
          });
        }
        socket?.emit("get-my-chats", userProfile?.id);
      }
    });

    return () => {
      socket?.off("chat-messages");
      socket?.off("new-message");
    };
  }, [socket, selectedChat?.chatRoom]);

  return selectedChat ? (
    <>
      {/* Chat messages */}
      <PageIndex.ChatHeader />
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
  ) : (
    <PageIndex.NoChatSelected />
  );
};

export default ChatRoom;