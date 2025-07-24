import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/Actions/userActions";

const navItems = [
  { label: "Home", path: "/home", icon: <HomeIcon /> },
  { label: "Explore", path: "/home/explore", icon: <ExploreIcon /> },
  { label: "Search Users", path: "/home/search", icon: <SearchIcon /> },
  { label: "My Profile", path: "/home/profile/me", icon: <AccountCircleIcon /> },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const isExactPath = (targetPath: string) => location.pathname === targetPath;

  // ---- Mobile Navbar ----
  if (isMobile) {
    return (
      <Paper
  sx={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    bgcolor: theme.palette.primary.main,
  }}
  elevation={3}
>
  <BottomNavigation
    value={location.pathname}
    showLabels
    sx={{
      bgcolor: theme.palette.primary.main,
    }}
  >
    {navItems.map((item) => {
      const isActive = isExactPath(item.path);
      return (
        <BottomNavigationAction
          key={item.label}
          label={item.label}
          icon={item.icon}
          component={NavLink}
          to={item.path}
          value={item.path}
          sx={{
            "&.Mui-selected": {
              color: theme.palette.tertiary.main,
              bgcolor: `${theme.palette.tertiary.main}22`,
              borderRadius: 2,
              mx: 0.5,
            },
            color: theme.palette.secondary.main,
          }}
        />
      );
    })}
    <BottomNavigationAction
      label="Logout"
      icon={<LogoutIcon />}
      onClick={handleLogout}
      sx={{ color: theme.palette.secondary.main }}
    />
  </BottomNavigation>
</Paper>

    );
  }

  // ---- Tablet Navbar ----
  if (isTablet) {
    return (
      <Box
        sx={{
          width: 72,
          height: "100vh",
          position: "fixed",
          bgcolor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 2,
          boxShadow: 2,
        }}
      >
        {navItems.map((item) => (
          <IconButton
            key={item.label}
            component={NavLink}
            to={item.path}
            sx={{
              color: isExactPath(item.path)
                ? theme.palette.tertiary.main
                : theme.palette.secondary.main,
              mb: 3,
              borderRadius: 2,
              backgroundColor: isExactPath(item.path)
                ? `${theme.palette.tertiary.main}22`
                : "transparent",
              "&:hover": {
                backgroundColor: "transparent !important",
              },
            }}
          >
            {item.icon}
          </IconButton>
        ))}
        <IconButton
          onClick={handleLogout}
          sx={{
            mt: 2,
            color: theme.palette.secondary.main,
            "&:hover": {
              backgroundColor: "transparent !important",
            },
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Box>
    );
  }

  // ---- Desktop Navbar ----
  return (
    <Box
      sx={{
        width: 220,
        height: "100vh",
        position: "fixed",
        bgcolor: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        display: "flex",
        flexDirection: "column",
        pt: 3,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          mb: 3,
          fontWeight: "bold",
          color: theme.palette.secondary.main,
        }}
      >
        Connectify
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <List disablePadding>
          {navItems.map((item) => {
            const active = isExactPath(item.path);
            return (
              <NavLink
                key={item.label}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <ListItemButton
                  sx={{
                    color: active
                      ? theme.palette.primary.contrastText
                      : theme.palette.secondary.main,
                    bgcolor: active ? theme.palette.tertiary.main : "transparent",
                    borderRadius: "12px",
                    mx: 2,
                    mb: 1,
                    "&:hover": {
                      backgroundColor: "transparent !important",
                    },
                  }}
                >
                  {item.icon}
                  <ListItemText primary={item.label} sx={{ ml: 2 }} />
                </ListItemButton>
              </NavLink>
            );
          })}
        </List>

        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.secondary.main}44`,
          }}
        >
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: theme.palette.secondary.main,
              pl: 3,
              "&:hover": {
                backgroundColor: "transparent !important",
              },
            }}
          >
            <LogoutIcon />
            <ListItemText primary="Logout" sx={{ ml: 2 }} />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
