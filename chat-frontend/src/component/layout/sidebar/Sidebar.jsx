import { useState } from "react";
import PageIndex from "../../../container/PageIndex";
import Index from "../../../container/Index";

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = PageIndex.useAppContext();
  const navigate = PageIndex.useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <Index.Drawer
      variant="permanent"
      sx={{
        width: 60,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 60,
          boxSizing: "border-box",
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px 0",
          transition: (theme) =>
            theme.transitions.create("background-color", {
              duration: theme.transitions.duration.standard,
            }),
        },
      }}
    >
      <Index.Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginTop: "auto", // Push to bottom
        }}
      >
        <Index.Tooltip arrow title="Log out" placement="right">
          <Index.IconButton onClick={handleLogout}>
            <Index.LogoutIcon />
          </Index.IconButton>
        </Index.Tooltip>
        <Index.Tooltip arrow title={isDarkMode ? "Light mode" : "Dark mode"} placement="right">
          <Index.IconButton onClick={toggleTheme} aria-label="toggle dark mode">
            {isDarkMode ? <Index.LightMode /> : <Index.DarkMode />}
          </Index.IconButton>
        </Index.Tooltip>
        <Index.Tooltip arrow title="Settings" placement="right">
          <Index.IconButton>
            <Index.Settings />
          </Index.IconButton>
        </Index.Tooltip>
        <Index.Tooltip arrow title="Profile" placement="right">
          <Index.IconButton>
            <Index.AccountCircle />
          </Index.IconButton>
        </Index.Tooltip>
      </Index.Box>
    </Index.Drawer>
  );
};

export default Sidebar;
