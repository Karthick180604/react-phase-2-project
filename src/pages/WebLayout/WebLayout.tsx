import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const WebLayout = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery("(min-width: 601px) and (max-width: 960px)");
  const isDesktop = useMediaQuery("(min-width: 960px)");

  const drawerWidth = isTablet ? 72 : isDesktop ? 200 : 0;
  const topPadding = { xs: 2, sm: 3 };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { sm: `${drawerWidth}px` },
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
