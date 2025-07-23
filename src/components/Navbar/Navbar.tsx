import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const navItems = [
  { label: "Home", path: "/", icon: <HomeIcon /> },
  { label: "Users", path: "/users", icon: <PeopleIcon /> },
  { label: "Profile", path: "/profile", icon: <AccountCircleIcon /> },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  if (isMobile) {
    return (
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={location.pathname}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              icon={item.icon}
              component={RouterLink}
              to={item.path}
              value={item.path}
            />
          ))}
        </BottomNavigation>
      </Paper>
    );
  }

  if (isTablet) {
    return (
      <Box
        sx={{
          width: 72,
          height: "100vh",
          position: "fixed",
          backgroundColor: "#1976d2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 2,
        }}
      >
        {navItems.map((item) => (
          <IconButton
            key={item.label}
            component={RouterLink}
            to={item.path}
            color="inherit"
            sx={{ mb: 3 }}
          >
            {item.icon}
          </IconButton>
        ))}
      </Box>
    );
  }

  // Desktop: full vertical sidebar
  return (
    <Box
      sx={{
        width: 200,
        height: "100vh",
        position: "fixed",
        backgroundColor: "#1976d2",
        color: "white",
        display: "flex",
        flexDirection: "column",
        pt: 3,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}
      >
        Connectify
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={RouterLink}
            to={item.path}
            sx={{ color: "white", pl: 3 }}
            selected={location.pathname === item.path}
          >
            {item.icon}
            <ListItemText primary={item.label} sx={{ ml: 2 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Navbar;
