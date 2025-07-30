import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/Store/store";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const location=useLocation()
  console.log(location)
  const userDetails = useSelector((state: RootState) => state.user);
  const isAuthenticated = !!userDetails.email;
  if (isAuthenticated) 
  {
    if(location.pathname!=="/" && location.pathname!=="/signup")
    {
      return children;
    }
    else
    {
      return <Navigate to="/home" />;
    }
  } 
  else if(!isAuthenticated) 
  {
    if(location.pathname==="/" || location.pathname==="/signup")
    {
      return children
    }
    else
    {
      return <Navigate to="/" />
    }
  }
};

export default ProtectedRoutes;
