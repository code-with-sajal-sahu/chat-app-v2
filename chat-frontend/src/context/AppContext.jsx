import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedChat, setSelectedChat] = useState();
  const [newMessage, setNewMessage] = useState(false);
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
