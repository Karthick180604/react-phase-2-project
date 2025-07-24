import React from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../redux/Store/store'
import { Navigate } from 'react-router-dom';

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({children}) => {
    const userDetails=useSelector((state:RootState)=>state.user)
    const isAuthenticated=!!userDetails.email
    if(isAuthenticated)
    {
        return children
    }
    else{
        return <Navigate to="/" />
    }
}

export default ProtectedRoutes
