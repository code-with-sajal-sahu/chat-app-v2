import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageIndex from "../container/PageIndex";
import { handleGetRequest } from "../config/DataService";

const PrivateRoutes = () => {
  const navigate = PageIndex.useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const location = useLocation();
  const verifyToken = async ()=>{
    const resp = await handleGetRequest('/verify');
    if(resp?.status=== 401){
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }
  useEffect(()=>{
    verifyToken();
  }, [location.pathname])

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
