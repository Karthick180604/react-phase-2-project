import React from 'react'
import type { RootState } from '../../redux/Store/store';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const AuthProtectedRoutes: React.FC<ProtectedRoutesProps>  = ({children}) => {
  const userDetails=useSelector((state:RootState)=>state.user)
    const isAuthenticated=!!userDetails.email
    if(!isAuthenticated)
    {
        return children
    }
    else{
        return <Navigate to="/home" />
    }
}

export default AuthProtectedRoutes
