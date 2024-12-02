import React, { useEffect, useState } from "react";
import Index from "../../container/Index";
import PageIndex from "../../container/PageIndex";
import SearchNewUser from "../searchNewUser/SearchNewUser";

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
  const { selectedChat, setSelectedChat, newMessage } = PageIndex.useAppContext();
  const [open, setOpen] = useState(false);
  const myProfile = JSON.parse(localStorage.getItem("user"));
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [myChatList, setMyChatList] = useState([]);
  const handleGetMyChats = async () => {
    const response = await PageIndex.handleGetRequest(
      PageIndex.API.GET_MY_CHATS,
      false
    );
    if (response.status === 200) {
      setMyChatList(response.data);
    }
  };
  const updateSelectedChat = (chat) => {
    setSelectedChat({
      user: chat.participants.find((participant) => participant._id !== myProfile.id),
      chatRoom: chat._id,
    });
  };
  const handleSearchMyChats = (searchText) => {
    // setMyChatList(myChatList.filter((chat) => chat.name.includes(searchText)));
  };

  useEffect(() => {
    handleGetMyChats();
  }, [newMessage]);
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
            onChange={(e) => handleSearchMyChats(e.target.value)}
          />
          <Index.Tooltip arrow title="Start new chat" placement="bottom">
            <Index.IconButton aria-label="start new chat" onClick={handleOpen}>
              <Index.NewChatIcon />
            </Index.IconButton>
          </Index.Tooltip>
        </Index.Box>
        {/* <Index.List sx={{ bgcolor: "background.paper" }}> */}
        <Index.List>
          {myChatList.map((chat) => (
            <Index.ListItem
              key={chat.id}
              button
              // selected={selectedChat?.user?._id === chat.id}
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
                    (participant) => participant._id !== myProfile.id
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
                    {chat?.lastMessage?.content}
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
            </Index.ListItem>
          ))}
        </Index.List>
      </Index.Box>
      <SearchNewUser open={open} handleClose={handleClose} />
    </>
  );
};

export default MyChats;
