import React from 'react'
import Navbar from '../../constants/Navbar/Navbar'
import { Outlet } from 'react-router-dom'

const WebLayout = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default WebLayout
