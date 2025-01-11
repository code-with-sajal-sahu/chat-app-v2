import React from "react";
import Index from "../../container/Index";

const ProfileDrawer = ({ open, handleClose }) => {
  const profile = JSON.parse(localStorage.getItem("user"));
  return (
    <Index.Drawer
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          paddingLeft: "60px",
          backgroundColor: "background.default",
          transition: (theme) =>
            theme.transitions.create("background-color", {
              duration: theme.transitions.duration.standard,
            }),
        },
      }}
    >
      <Index.Box sx={{ width: 360 }} role="presentation">
        <Index.Box sx={{ p: 3 }}>
          <Index.Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              justifyContent: "end",
            }}
          >
            <Index.IconButton onClick={handleClose} sx={{ mr: 2 }}>
              <Index.Close />
            </Index.IconButton>
          </Index.Box>

          <Index.Box sx={{ textAlign: "center", mb: 4, position: "relative" }}>
            <Index.Avatar
              sx={{ width: 100, height: 100, margin: "0 auto", mb: 2 }}
            >
              <Index.AccountCircle sx={{ width: 100, height: 100 }} />
            </Index.Avatar>
            <Index.IconButton 
              sx={{
                position: "absolute",
                right: "54%",
                bottom: 6,
                padding: "4px",
                backgroundColor: "background.default",
                transform: "translateX(60px)",
                "& svg": {
                    width: "18px",
                    height: "18px"
                }
              }}
              disableRipple
            >
              <Index.Edit />
            </Index.IconButton>
          </Index.Box>

          <Index.List>
            <Index.ListItem>
              <Index.ListItemIcon>
                <Index.Person />
              </Index.ListItemIcon>
              <Index.ListItemText>
                <Index.Typography sx={{
                    fontSize: "14px",
                    color: "#8696a0"
                }}>Name</Index.Typography>
                <Index.Typography>{profile?.name}</Index.Typography>
              </Index.ListItemText>
              {/* <Index.IconButton>
                <Index.Edit />
              </Index.IconButton> */}
            </Index.ListItem>
            <Index.ListItem>
              <Index.ListItemIcon>
                <Index.StarOutline />
              </Index.ListItemIcon>
              <Index.ListItemText>
                <Index.Typography sx={{
                    fontSize: "14px",
                    color: "#8696a0"
                }}>Username</Index.Typography>
                <Index.Typography>{profile?.username}</Index.Typography>
              </Index.ListItemText>
              {/* <Index.IconButton>
                <Index.Edit />
              </Index.IconButton> */}
            </Index.ListItem>
            <Index.ListItem>
              <Index.ListItemIcon>
                <Index.MailOutline />
              </Index.ListItemIcon>
              <Index.ListItemText>
                <Index.Typography sx={{
                    fontSize: "14px",
                    color: "#8696a0"
                }}>Email</Index.Typography>
                <Index.Typography>{profile?.email}</Index.Typography>
              </Index.ListItemText>
            </Index.ListItem>
            <Index.ListItem>
              <Index.ListItemIcon>
                <Index.FormatQuoteRounded />
              </Index.ListItemIcon>
              <Index.ListItemText>
                <Index.Typography sx={{
                    fontSize: "14px",
                    color: "#8696a0"
                }}>Bio</Index.Typography>
                <Index.Typography>Working</Index.Typography>
              </Index.ListItemText>
            </Index.ListItem>
          </Index.List>
        </Index.Box>
      </Index.Box>
    </Index.Drawer>
  );
};

export default ProfileDrawer;
