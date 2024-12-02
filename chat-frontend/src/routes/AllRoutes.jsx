import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../container/auth/Login';
import Signup from '../container/auth/Signup';
import ChatInterface from '../container/page/chat/ChatInterface';
import PrivateRoutes from './PrivateRoutes';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<ChatInterface />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
