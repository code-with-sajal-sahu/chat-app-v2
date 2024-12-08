import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAppContext } from './AppContext';

const SOCKET_ENDPOINT = "http://localhost:5000";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userProfile } = useAppContext();

  useEffect(() => {
    const newSocket = io(SOCKET_ENDPOINT);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);
  useEffect(() => {
    if (socket && userProfile?.id) {
      socket.emit("setup", userProfile.id, userProfile?.name);
    }
  }, [socket, userProfile?.id]);

  const value = {
    socket
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};


export const useSocket = () => useContext(SocketContext);