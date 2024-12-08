import React from "react";
import Index from "../../Index";
import PageIndex from "../../PageIndex";
import Sidebar from "../../../component/layout/sidebar/Sidebar";

export default function ChatInterface() {

  const { selectedChat } =
    PageIndex.useAppContext();

  return (
    <Index.Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "background.default",
        transition: (theme) =>
          theme.transitions.create("background-color", {
            duration: theme.transitions.duration.standard,
          }),
      }}
    >
      <Sidebar />
      {/* Left sidebar */}
      <PageIndex.MyChats />
      {/* Main chat area */}
      <Index.Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <PageIndex.ChatRoom />
      </Index.Box>
    </Index.Box>
  );
}
