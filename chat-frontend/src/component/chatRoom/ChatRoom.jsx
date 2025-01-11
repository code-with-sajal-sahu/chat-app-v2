import React, { useCallback, useEffect, useState, useRef } from "react";
import Index from "../../container/Index";
import PageIndex from "../../container/PageIndex";
import io from "socket.io-client";
import { useSocket } from "../../context/SocketContext";
import { useAppContext } from "../../context/AppContext";
import ViewImage from "../viewImage/ViewImage";

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { selectedChat, setNewMessage, newMessage } = PageIndex.useAppContext();
  const myProfile = JSON.parse(localStorage.getItem("user"));
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);
  const { userProfile } = useAppContext();
  const [openViewImage, setOpenViewImage] = useState(-1);
  const [viewImageSlides, setViewImageSlides] = useState([]);

  const handleOpenViewImage = (img) => {
    const imgIndex = viewImageSlides.findIndex((slide) => slide.src === img);
    setOpenViewImage(imgIndex);
  };
  const handleCloseViewImage = () => {
    setOpenViewImage(-1);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrl(previewUrls);
      setSelectedFile(files);
    }
  };

  const handleSendMessage = () => {
    if (messageInput || previewUrl) {
      if (previewUrl) {
        // Handle file upload logic here
        // const reader = new FileReader();
        // reader.onloadend = () => {
        //   socket?.emit("send-message", {
        //     sender: userProfile?.id,
        //     receiver: selectedChat?.user?._id,
        //     content: messageInput,
        //     file: {
        //       data: reader.result,
        //       type: selectedFile.type,
        //       name: selectedFile.name
        //     }
        //   });
        // };
        // reader.readAsDataURL(selectedFile);
        socket?.emit("send-message", {
          sender: userProfile?.id,
          receiver: selectedChat?.user?._id,
          content: messageInput,
          // file: {
          //   value: selectedFile,
          //   type: selectedFile.type,
          //   name: selectedFile.name
          // }
          file: selectedFile?.map((file) => ({
            value: file,
            type: file.type,
            name: file.name,
          })),
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setPreviewUrl(null);
      } else {
        socket?.emit("send-message", {
          sender: userProfile?.id,
          receiver: selectedChat?.user?._id,
          content: messageInput,
        });
      }
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
        let imagesArr = [];
        chatMessages?.data?.forEach((message) => {
          if (message?.file?.length > 0) {
            let files = message?.file?.map((file) => ({
              src: `${SOCKET_ENDPOINT}/public/upload/${file}`,
              description: message?.content,
            }));
            imagesArr.push(...files);
          }
        });
        setViewImageSlides(imagesArr);
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
          if (messageInfo?.data?.file?.length > 0) {
            let files = messageInfo?.data?.file?.map((file) => ({
              src: `${SOCKET_ENDPOINT}/public/upload/${file}`,
              description: messageInfo?.data?.content,
            }));
            setViewImageSlides((prev) => ([...prev, ...files]));
          }
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
              {/* {message.file ? (
                message.file.type.startsWith('image/') ? (
                  <img src={message.file.data} alt="Shared" style={{maxWidth: '100%', maxHeight: '200px'}} />
                ) : message.file.type.startsWith('video/') ? (
                  <video controls style={{maxWidth: '100%', maxHeight: '200px'}}>
                    <source src={message.file.data} type={message.file.type} />
                  </video>
                ) : null
              ) : null} */}
              {message.file?.length > 0 && (
                <Index.Box
                  sx={{
                    display: "grid",
                    gap: 1,
                    gridTemplateColumns:
                      message.file.length > 1 ? "repeat(2, 1fr)" : "1fr",
                  }}
                >
                  {message.file.slice(0, 4).map((file, index) => (
                    <Index.Box
                      key={index}
                      sx={{ position: "relative", cursor: "pointer"}}
                      onClick={() =>
                        handleOpenViewImage(
                          `${SOCKET_ENDPOINT}/public/upload/${file}`
                        )
                      }
                    >
                      <img
                        src={`${SOCKET_ENDPOINT}/public/upload/${file}`}
                        alt={`Shared ${index + 1}`}
                        style={{
                          width: "100%",
                          height: message.file.length > 1 ? "80px" : "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          filter:
                            index === 3 && message.file.length > 4
                              ? "blur(2px)"
                              : "none",
                        }}
                      />
                      {index === 3 && message.file.length > 4 && (
                        <Index.Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            borderRadius: "8px",
                          }}
                        >
                          <Index.Typography color="white" variant="h6">
                            +{message.file.length - 4}
                          </Index.Typography>
                        </Index.Box>
                      )}
                    </Index.Box>
                  ))}
                </Index.Box>
              )}
              <Index.Typography variant="body1" sx={{maxWidth: "400px"}}>
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
              {Index.moment(message.createdAt).format("DD/MM/YYYY hh:mm A")}
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
          flexDirection: "column",
          gap: 1,
          transition: (theme) =>
            theme.transitions.create(["background-color", "box-shadow"], {
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        {previewUrl && (
          <Index.Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {previewUrl.map((url, index) => (
              <Index.Box
                key={index}
                sx={{ position: "relative", maxWidth: 200 }}
              >
                {selectedFile[index].type.startsWith("image/") ? (
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                ) : selectedFile[index].type.startsWith("video/") ? (
                  <video controls style={{ width: "100%", borderRadius: 8 }}>
                    <source src={url} type={selectedFile[index].type} />
                  </video>
                ) : null}
                <Index.IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    bgcolor: "background.paper",
                  }}
                  onClick={() => {
                    const newFiles = [...selectedFile];
                    const newUrls = [...previewUrl];
                    newFiles.splice(index, 1);
                    newUrls.splice(index, 1);
                    setSelectedFile(newFiles.length ? newFiles : null);
                    setPreviewUrl(newUrls.length ? newUrls : null);
                  }}
                >
                  <Index.Close fontSize="small" />
                </Index.IconButton>
              </Index.Box>
            ))}
          </Index.Box>
        )}
        <Index.Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <input
            type="file"
            accept="image/*,video/*"
            hidden
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
          />
          <Index.IconButton onClick={() => fileInputRef.current?.click()}>
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
        </Index.Box>
      </Index.Paper>
      <ViewImage
        open={openViewImage}
        onClose={handleCloseViewImage}
        slides={viewImageSlides}
      />
    </>
  ) : (
    <PageIndex.NoChatSelected />
  );
};

export default ChatRoom;
