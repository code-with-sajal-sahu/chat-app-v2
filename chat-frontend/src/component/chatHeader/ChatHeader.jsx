import React from "react";
import Index from "../../container/Index";
import PageIndex from "../../container/PageIndex";

const ChatHeader = () => {
  const { selectedChat } = PageIndex.useAppContext();
  return (
    <Index.Box
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        borderBottom: 1,
        borderColor: "divider",
        transition: (theme) =>
          theme.transitions.create("border-color", {
            duration: theme.transitions.duration.standard,
          }),
      }}
    >
      <PageIndex.StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
      >
        <Index.Avatar src={selectedChat?.user?.avatar} />
      </PageIndex.StyledBadge>
      <Index.Box sx={{ ml: 2, flexGrow: 1 }}>
        <Index.Typography variant="subtitle1">
          {selectedChat?.user?.name}
        </Index.Typography>
        <Index.Typography
          variant="body2"
          color="text.secondary"
          sx={{
            transition: (theme) =>
              theme.transitions.create("color", {
                duration: theme.transitions.duration.standard,
              }),
          }}
        >
          Online
        </Index.Typography>
      </Index.Box>
      <Index.IconButton>
        <Index.Videocam />
      </Index.IconButton>
      <Index.IconButton>
        <Index.CallIcon />
      </Index.IconButton>
      {/* <Index.IconButton onClick={toggleTheme} aria-label="toggle dark mode">
        {isDarkMode ? <Index.LightMode /> : <Index.DarkMode />}
      </Index.IconButton> */}
      <Index.IconButton>
        <Index.MoreVert />
      </Index.IconButton>
    </Index.Box>
  );
};

export default ChatHeader;
