import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const myProfile = JSON.parse(localStorage.getItem("user"));
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedChat, setSelectedChat] = useState();
  const [newMessage, setNewMessage] = useState(false);
  const [userProfile, setUserProfile] = useState(myProfile);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    selectedChat,
    setSelectedChat,
    newMessage,
    setNewMessage,
    userProfile,
    setUserProfile
  };

  return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
