import React, { useEffect, useState } from "react";
import Index from "../../container/Index";
import PageIndex from "../../container/PageIndex";
import SearchNewUser from "../searchNewUser/SearchNewUser";
import { useSocket } from "../../context/SocketContext";
import { useAppContext } from "../../context/AppContext";

const messages = [
  {
    id: 1,
    name: "John Doe",
    message: "How are you doing?",
    time: "16:45",
    avatar: "https://randomuser.me/api/portraits/men/0.jpg",
    read: true,
  },
  {
    id: 2,
    name: "Travis Barker",
    message: "...is typing",
    time: "16:45",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    isTyping: true,
  },
  {
    id: 3,
    name: "Kate Rose",
    message: "See you tomorrow!",
    time: "16:45",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    read: true,
  },
  {
    id: 4,
    name: "Robert Parker",
    message: "Awesome!",
    time: "16:45",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    read: false,
  },
  {
    id: 5,
    name: "Rick Owens",
    message: "Good idea 😄",
    time: "16:45",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    read: true,
  },
];
const MyChats = () => {
  const { selectedChat, setSelectedChat, newMessage } =
    PageIndex.useAppContext();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [myChatList, setMyChatList] = useState([]);
  const [filterMyChat, setFilterMyChat] = useState([]);
  const { socket } = useSocket();
  const { userProfile } = useAppContext();

  const updateSelectedChat = (chat) => {
    setSelectedChat({
      user: chat.participants.find(
        (participant) => participant._id !== userProfile?.id
      ),
      chatRoom: chat._id,
    });
  };

  useEffect(() => {
    if (socket && userProfile?.id) {
      socket.emit("get-my-chats", userProfile?.id);
    }
    socket?.on("my-chats", (chats) => {
      if (chats?.status === 200) {
        setMyChatList(chats?.data);
      }
    });
  }, [socket, userProfile?.id]);
  const handleSearchMyChats = (searchText) => {
    if (!searchText) {
      setFilterMyChat(myChatList);
      return;
    }
    setFilterMyChat(
      myChatList.filter((chat) =>
        chat?.participants?.some(
          (participant) =>
            participant._id !== userProfile?.id &&
            participant?.name?.toLowerCase().includes(searchText)
        )
      )
    );
  };

  const trimContent = (content) => {
    if (content.length > 20) {
      return content.substring(0, 20) + "...";
    }
    return content;
  };

  useEffect(() => {
    setFilterMyChat(myChatList);
  }, [myChatList]);
  return (
    <>
      <Index.Box
        sx={{
          width: 360,
          borderRight: 1,
          borderColor: "divider",
          transition: (theme) =>
            theme.transitions.create("border-color", {
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        <Index.Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Index.TextField
            fullWidth
            placeholder="Search"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <Index.InputAdornment position="start">
                  <Index.Search />
                </Index.InputAdornment>
              ),
            }}
            onChange={(e) => handleSearchMyChats(e.target.value?.toLowerCase())}
          />
          <Index.Tooltip arrow title="Start new chat" placement="bottom">
            <Index.IconButton aria-label="start new chat" onClick={handleOpen}>
              <Index.NewChatIcon />
            </Index.IconButton>
          </Index.Tooltip>
        </Index.Box>
        {/* <Index.List sx={{ bgcolor: "background.paper" }}> */}
        <Index.List>
          {filterMyChat.map((chat) => (
            <Index.ListItemButton
              key={chat.id}
              button
              selected={selectedChat?.chatRoom === chat?._id}
              onClick={() => updateSelectedChat(chat)}
            >
              <Index.ListItemAvatar>
                <PageIndex.StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Index.Avatar src={chat.avatar} />
                </PageIndex.StyledBadge>
              </Index.ListItemAvatar>
              <Index.ListItemText
                primary={
                  chat.participants.find(
                    (participant) => participant._id !== userProfile?.id
                  ).name
                }
                secondary={
                  <Index.Typography
                    component="span"
                    variant="body2"
                    color={chat.isTyping ? "primary" : "text.secondary"}
                    sx={{
                      transition: (theme) =>
                        theme.transitions.create("color", {
                          duration: theme.transitions.duration.standard,
                        }),
                    }}
                  >
                    {trimContent(chat?.lastMessage?.content)}
                  </Index.Typography>
                }
              />
              <Index.Box
                sx={{ display: "flex", alignItems: "center", ml: "auto" }}
              >
                {chat.read ? (
                  <Index.DoneAllIcon
                    sx={{
                      fontSize: 16,
                      color: "primary.main",
                      mr: 1,
                    }}
                  />
                ) : (
                  <Index.Check
                    sx={{
                      fontSize: 16,
                      color: "primary.main",
                      mr: 1,
                    }}
                  />
                )}
                <Index.Typography variant="caption" color="text.secondary">
                  {Index.moment(chat.lastMessage?.createdAt).format("hh:mm A")}
                </Index.Typography>
              </Index.Box>
            </Index.ListItemButton>
          ))}
        </Index.List>
      </Index.Box>
      <SearchNewUser open={open} handleClose={handleClose} />
    </>
  );
};

export default MyChats;
