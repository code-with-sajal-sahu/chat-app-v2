import { useState } from "react";
import PageIndex from "../../../container/PageIndex";
import Index from "../../../container/Index";
import ProfileDrawer from "../../profileDrawer/ProfileDrawer";

const Sidebar = () => {
  const { isDarkMode, toggleTheme, setUserProfile } = PageIndex.useAppContext();
  const navigate = PageIndex.useNavigate();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const handleProfileDrawer = () => setOpenProfile(!openProfile); 
  const handleLogoutClick = () => {
    setOpenLogoutModal(true);
  };

  const handleCloseModal = () => {
    setOpenLogoutModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserProfile(null);
    navigate("/login");
    handleCloseModal();
  };

  return (
    <>
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
            zIndex: 1210,
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
            height: "100%"
          }}
        >
          <Index.Box sx={{textAlign: "center"}}>
            <Index.Tooltip arrow title="Profile" placement="right">
              <Index.IconButton onClick={handleProfileDrawer}>
                <Index.AccountCircle />
              </Index.IconButton>
            </Index.Tooltip>
            <Index.Tooltip arrow title="Notification" placement="right">
              <Index.IconButton>
              <Index.Badge badgeContent={0} showZero={false} color="primary">
                <Index.NotificationsIcon />
              </Index.Badge>
              </Index.IconButton>
            </Index.Tooltip>
          </Index.Box>

          <Index.Box sx={{ marginTop: "auto", textAlign: "center" }}>
            <Index.Tooltip arrow title="Log out" placement="right">
              <Index.IconButton onClick={handleLogoutClick}>
                <Index.LogoutIcon />
              </Index.IconButton>
            </Index.Tooltip>
            <Index.Tooltip
              arrow
              title={isDarkMode ? "Light mode" : "Dark mode"}
              placement="right"
            >
              <Index.IconButton onClick={toggleTheme} aria-label="toggle dark mode">
                {isDarkMode ? <Index.LightMode /> : <Index.DarkMode />}
              </Index.IconButton>
            </Index.Tooltip>
            <Index.Tooltip arrow title="Settings" placement="right">
              <Index.IconButton>
                <Index.Settings />
              </Index.IconButton>
            </Index.Tooltip>
          </Index.Box>
        </Index.Box>
      </Index.Drawer>
      <ProfileDrawer open={openProfile} handleClose={handleProfileDrawer}/>
      <Index.Modal
        open={openLogoutModal}
        onClose={handleCloseModal}
        aria-labelledby="logout-modal"
        aria-describedby="logout-confirmation"
      >
        <Index.Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          <Index.Typography id="logout-modal" variant="h6" component="h2" gutterBottom>
            Confirm Logout
          </Index.Typography>
          <Index.Typography id="logout-confirmation" sx={{ mt: 2 }}>
            Are you sure you want to log out?
          </Index.Typography>
          <Index.Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Index.IconButton onClick={handleCloseModal} color="primary">
              <Index.Close />
            </Index.IconButton>
            <Index.IconButton onClick={handleLogout} color="error">
              <Index.LogoutIcon />
            </Index.IconButton>
          </Index.Box>
        </Index.Box>
      </Index.Modal>
    </>
  );
};

export default Sidebar;
