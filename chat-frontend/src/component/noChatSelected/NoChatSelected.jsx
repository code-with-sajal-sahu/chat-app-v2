import React from "react";
import Index from "../../container/Index";

const NoChatSelected = () => {
  return (
    <Index.Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: 3,
        textAlign: "center",
      }}
    >
      <Index.IconButton
        sx={{
          width: 80,
          height: 80,
          backgroundColor: "action.hover",
          "&:hover": {
            backgroundColor: "action.selected",
          },
        }}
      >
        <Index.ChatBubbleOutline sx={{ fontSize: 40 }} />
      </Index.IconButton>
      <Index.Typography variant="h4" gutterBottom>
        Welcome to Chat App
      </Index.Typography>
      <Index.Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Select a user from the sidebar to start chatting
      </Index.Typography>
    </Index.Box>
  );
};

export default NoChatSelected;
