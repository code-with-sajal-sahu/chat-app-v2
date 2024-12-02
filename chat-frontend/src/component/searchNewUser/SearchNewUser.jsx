import React, { useState } from "react";
import Index from "../../container/Index";
import PageIndex from "../../container/PageIndex";
const mockResults = [

    {
      id: 1,
      name: "John Smith",
      username: "johnsmith",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 2, 
      name: "Jane Doe",
      username: "janedoe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 3,
      name: "Robert Johnson",
      username: "rjohnson", 
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 4,
      name: "Sarah Williams",
      username: "swilliams",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 5,
      name: "Michael Brown",
      username: "mbrown",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 6,
      name: "Emily Davis",
      username: "edavis",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 7,
      name: "David Miller",
      username: "dmiller",
      avatar: "/placeholder.svg?height=40&width=40"
    }
  ];
const SearchNewUser = ({open, handleClose}) => {
//   const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { setSelectedChat } =
    PageIndex.useAppContext();
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    // TODO: Replace with actual API call
    if(query.trim()){
        const response = await PageIndex.handlePostRequest(PageIndex.API.SEARCH_USER, { searchQuery: query }, false);
        setSearchResults(response?.data || []);
    }else{
        setSearchResults([]);
    }
  };

  const handleStartChat = (user) => {
    // TODO: Implement chat creation logic
    setSelectedChat({user});
    handleClose();
  };

  return (
    
      <Index.Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="search-user-modal"
      >
        <Index.Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            height: 500,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Index.Typography variant="h6" component="h2" gutterBottom>
            Search Users
          </Index.Typography>
          
          <Index.TextField
            autoFocus
            fullWidth
            placeholder="Search by name or username"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <Index.InputAdornment position="start">
                  <Index.Search />
                </Index.InputAdornment>
              ),
            }}
          />

          <Index.List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {searchResults.map((user) => (
              <Index.ListItem
                key={user.id}
                button
                onClick={() => handleStartChat(user)}
              >
                <Index.ListItemAvatar>
                  <Index.Avatar src={user.avatar} />
                </Index.ListItemAvatar>
                <Index.ListItemText
                  primary={user.name}
                  secondary={`@${user.username}`}
                />
              </Index.ListItem>
            ))}
          </Index.List>
        </Index.Box>
      </Index.Modal>
    
  );
};

export default SearchNewUser;
