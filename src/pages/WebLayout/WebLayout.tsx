import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const WebLayout = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const drawerWidth = isTablet ? 72 : isDesktop ? 200 : 0;
  const topPadding = { xs: 2, sm: 3 };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { sm: `${drawerWidth}px` }, // Left margin to avoid overlap
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          p: 2,
          pt: topPadding,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default WebLayout;
