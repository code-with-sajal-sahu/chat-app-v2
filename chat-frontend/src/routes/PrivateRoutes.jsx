import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PageIndex from "../container/PageIndex";

const PrivateRoutes = () => {
  const navigate = PageIndex.useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
